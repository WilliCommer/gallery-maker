

/** 
 * @module file-service-api
 * @description client interface to backend api
 */

import joinPaths from './joinpaths.js'
import parsePath from './parse-path.js'

/**
 * actual backend URL root
 */
export var fsURL = '/app/file';

/**
 * set backend URL root
 * @param {string} url 
 */
export function setURL(url) {
    fsURL = url;
};

/**
 * URL factory for browser GET file, mainly images
 * @param {string} filename 
 * @returns {string}
 */
export function getURL(filename) {
    const parsed = parsePath(filename);
    const url = joinPaths( fsURL, 'get', parsed.path, parsed.base )
    return url
}
// export function getURL(filename) {
//     return [fsURL, 'get', filename].join('/')  // encodeURI nicht benötigt, macht Browser
// }


async function postJson( command, data ) {
    try {
        const response = await fetch(fsURL + '/' + command, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Response status: ${response.status}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    }
}




/**
 * @param {string} path 
 * @returns {object}
 */
export async function getDir( path = '' ) {
    return await postJson( 'files', {path} )
}


/**
 * @param {string} path 
 * @param {string} newDir
 * @returns {boolean}
 */
export async function mkDir( path, newDir ) {
    if (typeof path === 'string')
        path = path.split('/');
    if (newDir) path.push(newDir);
    return await postJson( 'mkdir', {path} )
}


/**
 * 
 * @param {string} filename - path to file
 * @returns {string} - file content as text 
 */
export async function readTextFile( filename ) {
    try {
        const response = await fetch(fsURL + '/' + 'readtextfile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({filename})
        });
        if (!response.ok) throw new Error(`Response status: ${response.status}`);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error.message);
    }
}

// export async function readFile( fileName ) {
//     const parsed = parsePath(fileName);
//     let response = await fetch(fsURL + '/read', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ filename })
//     });
//     if (!response.ok) throw new Error('Network response was not ok');
//     const text = await response.text();
//     return text;
// }


/**
 * @param {string} filename 
 * @param {string} content
 * @returns {boolean}
 */
export async function writeFile( filename, content ) {
    return await postJson( 'write', {filename, content} )
}


/**
 * @param {string} filename 
 * @returns {boolean}
 */
export async function exists( filename ) {
    return await postJson( 'exists', {filename} )
}

/**
 * @param {string} filename 
 * @returns {boolean}
 */
export async function trashFile( filename ) {
    return await postJson( 'trash', {filename} )
}

/**
 * 
 * @param {string} directory
 * @param {Array<string>} files 
 * @returns {boolean}
 */
export async function trash(directory, files) {
    return await postJson( 'trash', {directory, files} )
}

/**
 * @param {string} filename - document or program name
 * @param {Array<string>} args - program arguments
 */
export async function open( filename, args ) {
    return await postJson( 'open', {filename, args} )
}

export async function getFileSystemPath( path ) {
    const info = await exists( path )
    return info?.path;
}

export async function normalizeFilename( filename ) {
    const fullName = await getFileSystemPath(filename) || filename;
    return joinPaths(fullName)
}

