import { homedir } from 'node:os';
import path from 'node:path';
import config from '../config.json' with { type: "json" }

const filePath = p => {
	if(p === null) return p; 				// special case for filePath
    if(!p) return process.cwd();			// else current dir
    p = p.replace('{HOMEDIR}', homedir())   // check placeholder
    p = path.resolve(p)
    return p;
}

config.fileRoot = filePath(config.fileRoot)
config.projectDir = filePath(config.projectDir)
config.sessionDataDir = filePath(config.sessionDataDir)
config.staticGet = config.fileRoot || '/'

// console.log('config', config)

export default config;

/* comment

    The configuration "fileRoot = null" is intended to allow access to all drives.
	This is an experiment, however, and it is not functioning correctly. 
	One issue involves the "static" function in Express. 
	Furthermore, it is not yet possible to select drives from within the browser dialogs.
	
*/

