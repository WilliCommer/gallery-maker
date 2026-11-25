import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import config from './config.js'
import createGallerieIndexHTML from './create-gallery-index.js'
const router = express.Router();
const log = 1 ? (...msg) => console.log(...msg) : ()=>{};
const { sessionDataDir, projectDir } = config;
const sessionFile = path.join( sessionDataDir, 'session.json' );
const template = fs.readFileSync( path.join(import.meta.dirname, 'gallery-template.html'), 'utf8' )

export default function init() {
  log('init session', sessionDataDir)
  fs.mkdirSync( sessionDataDir, { recursive: true } );
  return router;
}

const defaultSessionData = {
  // recent client folders
  projectDir,         
  imageDir: projectDir,
  recentProjects: []
}

// get session (client's global data) 
router.get('/session', async function(req,res,next) {
  try {
    let data = defaultSessionData;
    try {
      data = await fs.promises.readFile( sessionFile, 'utf8' )
      data = JSON.parse(data)
    } catch(_) {}
    res.json(data);
  } catch(err) {
    next(err)
  }
});

// post session
router.post('/session', async function(req,res,next) {
  try {
    let data = req.body;
    data = JSON.stringify( data, null, 2 )
    await fs.promises.writeFile( sessionFile, data, 'utf8' )
    res.json(true);
  } catch(err) {
    next(err)
  }
});


// make gallery
router.post('/makegallery', async function(req,res,next) {
  try {
    let data = defaultSessionData;
    try {
      data = await fs.promises.readFile( sessionFile, 'utf8' )
      data = JSON.parse(data)
    } catch(_) {}
    const result = makeGallery(data.project)
    // const result = makeGallery(req.body)
    res.json(result);
  } catch(err) {
    next(err)
  }
});


export function makeGallery( project ) {
  const result = {
    log: [],
    error: '',
  }
  try {
    if(!project.images.length) {
        throw new Error('Gallery has no images')
    }
    const imgPath = project.imgPath || project.name || 'img';
    project.imgPath = imgPath;
    project.name = project.name || 'index';

    const imgDir = path.join(project.directory, imgPath)
    result.imgDir = imgDir;

    // altes Bilder Verzeichnis löschen und neues anlegen
    fs.rmSync( imgDir, { recursive: true, force: true }); 
    fs.mkdirSync( imgDir, { recursive: true });

    // bilder kopieren
    project.images.forEach( image => {
      const newPath = path.join(imgDir, path.basename(image.img))
        fs.copyFileSync(image.img, newPath);
        image.img = path.basename(image.img);
    });

    const indexHTML = createGallerieIndexHTML( project, template ) 
    const indexFilePath = path.join(project.directory, project.name + '.html');
    fs.writeFileSync( indexFilePath, indexHTML, 'utf8');
    result.indexFilePath = indexFilePath;
  } catch(err) {
    result.error = err.message
  }
  return result;
}

