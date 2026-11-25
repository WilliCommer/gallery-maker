import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import trash from 'trash';
import open, { openApp } from 'open';

var router = express.Router()
var root, rootPath
var log

export default function init(options = {}) {
    // root = options.fileRoot || options.root || 'C:/';
    root = options.fileRoot || options.root || null;
    log = options.log || (options.debug ? console.log : () => { })
    if (root === null) {
        rootPath = []
    } else {
        root = path.resolve(root);
        rootPath = root.split(path.sep);
    }
    while (rootPath[rootPath.length - 1] === '') rootPath.pop();
    log('init file-router', root, rootPath);
    return router;
}



/**
 * Retrieves the contents of a directory based on the provided path.
 * POST /files {"path": "users/wcs"} or {"path": ["users","wcs"]}
 */
router.post('/files', async function (req, res, next) {
    try {
        const path = req.body?.path || [];
        res.json(await getDir(path));
    } catch (err) {
        next(err)
    }
});


/**
 * Retrieves the contents of a directory based on the provided path.
 * GET /dir/verzeichnis/sub  -> ['verzeichnis', 'sub']
 */
router.get('/dir/*path', async function (req, res, next) {
    try {
        const path = req.params.path || '';
        res.json(await getDir(path));
    } catch (err) {
        next(err)
    }
});


/**
 * Retrieves the contents of the root directory
 * GET /dir
 */
router.get('/dir', async function (req, res, next) {
    try {
        res.json(await getDir());
    } catch (err) {
        next(err)
    }
});


/**
 * check if path in body exits
 * POST /exists {"path": "users/wcs"}
 */
router.post('/exists', async function (req, res, next) {
    try {
        let filePath = req.body?.path || req.body?.filename || [];
        filePath = safeResolve(root, filePath, { checkRealPath: true })
        const stat = await fs.promises.stat(filePath);
        res.json({
            path: filePath,
            name: path.basename(filePath),
            isDir: stat.isDirectory(),
            size: stat.size,
            time: stat.mtime,
        })
    } catch (err) {
        res.json(false)
    }
});


/**
 * create a directory
 * POST /mkdir {"path": "users/wcs"}
 */
router.post('/mkdir', async function (req, res, next) {
    try {
        let filePath = req.body?.path || req.body?.filename || [];
        filePath = safeResolve(root, filePath)
        log('mkdir', filePath)
        await fs.promises.mkdir(filePath, { recursive: true });
        res.json(true)
    } catch (err) {
        next(err)
    }
});


/**
 * delete a file or directory
 * POST /trash {"path": "users/wcs"}
 */
router.post('/trash', async function (req, res, next) {
    try {
        let { directory, files } = req.body;
        if (directory && files && Array.isArray(files)) {
            directory = safeResolve(root, directory, { checkRealPath: true })
            files = files.map(file => path.join(directory, file))
            log('trash', files)
            await trash(files);
            res.json(true)
            return
        }

        let filePath = req.body?.path || req.body?.filename;
        if (!filePath)
            throw new Error('trash command expect filename');
        filePath = safeResolve(root, filePath, { checkRealPath: true })
        if (filePath === root)
            throw new Error('delete root folder blocked');
        log('trash', filePath);
        await trash(filePath);
        res.json(true)
    } catch (err) {
        next(err)
    }
});


/**
 * open a file with the operating system's default application.
 * POST /open {"path":"Users/wcs/Documents/Ablage/! readme.md"}
 * POST /open {"path": "powershell.exe", "args": ["-Command", "start \"C:\\Users\\wcs\\Documents\\Ablage\""]}
 */
router.post('/open', async function (req, res, next) {
    try {
        log('POST open', req.body);
        const { filename, args } = req.body;
        if (args) {
            log('openApp', filename, args)
            openApp(filename, { arguments: args });
        } else {
            let filePath = safeResolve(root, filename)
            log('open', filePath)
            open(filePath);
        }
        res.json(true)
    } catch (err) {
        next(err)
    }
});



/**
 * POST /read
 */
router.post('/readtextfile', async function (req, res, next) {
    try {
        let filePath = req.body?.path || req.body?.filename || [];
        log('readtextfile', filePath)
        filePath = safeResolve(root, filePath)
        var data = await fs.promises.readFile(filePath);
        res.set('Content-Type', 'text/plain');
        res.send(data);
    } catch (err) {
        next(err)
    }
});


/**
 * POST /write
 */
router.post('/write', async function (req, res, next) {
    try {
        let filePath = req.body?.path || req.body?.filename || [];
        let content = req.body?.content;
        log('write', filePath, typeof content)
        filePath = safeResolve(root, filePath)
        var data = await fs.promises.writeFile(filePath, content);
        res.json(true)
    } catch (err) {
        next(err)
    }
});

// -----------------------------


function safeResolve(root, paths, { checkRealPath = false, caseInsensitive = process.platform === 'win32' } = {}) {

    // EXPERIMENT full access
    if (root === null) {
        return simpleResolve(paths, { checkRealPath, caseInsensitive })
    }

    const segments = Array.isArray(paths) ? paths : [paths];
    const resolvedRoot = path.resolve(root);
    const targetPath = path.resolve(resolvedRoot, ...segments);

    const checkBounds = (base, target) => {
        const a = caseInsensitive ? base.toLowerCase() : base;
        const b = caseInsensitive ? target.toLowerCase() : target;
        const rel = path.relative(a, b);
        if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
            throw new Error(`access outside "${base}" blocked: "${target}"`);
        }
    };

    checkBounds(resolvedRoot, targetPath);

    if (!checkRealPath) return targetPath;

    const realRoot = fs.realpathSync.native(resolvedRoot);
    const missing = [];
    let current = targetPath;

    while (!fs.existsSync(current)) {
        const parent = path.dirname(current);
        if (parent === current) break;
        missing.unshift(path.basename(current));
        current = parent;
    }

    const realTarget = path.join(fs.realpathSync.native(current), ...missing);
    checkBounds(realRoot, realTarget);

    return realTarget;
}


function simpleResolve(paths, { checkRealPath = false } = {}) {
    const segments = Array.isArray(paths) ? paths : [paths];
    const targetPath = path.resolve(...segments);

    if (!checkRealPath) return targetPath;

    const missing = [];
    let current = targetPath;

    while (!fs.existsSync(current)) {
        const parent = path.dirname(current);
        if (parent === current) break;
        missing.unshift(path.basename(current));
        current = parent;
    }

    const realTarget = path.join(fs.realpathSync.native(current), ...missing);

    return realTarget;
}




/**
 * Read the contents and metadata of a directory.
 *
 * @param {string|string[]} [dir] - Directory path or breadcrumb trail.
 * @returns {Promise<FS_Directory|false>} Directory metadata, or false if it cannot be read.
 */
async function getDir(dir) {
    log('getDir', dir)
    // const fulldir = resolvePath(dir);
    dir = dir || '/';
    const resolvedDir = safeResolve(root, dir, { checkRealPath: true });
    const pathList = resolvedDir.split(path.sep).slice(rootPath.length);
    const res = {
        dir: pathList.join('/'),
        path: pathList,
        resolvedDir,
        files: []
    }

    const files = await fs.promises.readdir(resolvedDir);
    for (let file of files) {
        if (file.startsWith('.')) continue;
        try {
            let stat = await fs.promises.stat(path.join(resolvedDir, file));
            res.files.push({
                name: file,
                isDir: stat.isDirectory(),
                size: stat.size,
                time: stat.mtime,
            })
        } catch (_) { }
    }
    return res;
}
