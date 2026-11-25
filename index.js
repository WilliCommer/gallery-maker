import http from 'node:http';
import path from 'node:path';
import express from 'express';
import open from 'open';
import config from './server/config.js';
import {initHeartbeat} from './server/heartbeat-ws.js';
// import {fileRouter} from '../file-service-wcs/backend/index.js';
import fileRouter from './server/file-router.js';
import sessionRouter from './server/session-router.js';

const {port} = config;
const staticPath = path.resolve('public');
console.log('staticPath', staticPath)

// find out whether index.html should be opened automatically in the browser
var openClient = process.env.NODE_ENV !== 'development';
for (let arg of process.argv) {
	if (arg === 'nc') {             // no client
		openClient = false
	} else {                        // port
		let n = parseInt(arg);
		if (!isNaN(n)) port = n;
	}
}

const app = express();

// config.logger && app.use(logger('dev'));
app.use(express.json());
app.use(express.json({limit:"10mb"}));
app.use(express.static(staticPath));
app.use('/api/get', express.static(config.staticGet));
app.use('/api', fileRouter({root: config.fileRoot, debug: config.debugFileservice}));
app.use('/api', sessionRouter());
// app.use('/dateien', express.static(config.documentRoot));

app.use((err, req, res, next) => {
    let msg = 'Internal Error';
    msg = err.message || err || msg;
    console.error('ERROR', msg);
    res.status(500).json({"status": "error","message": err}).end();
});

app.set('port', port);
const server = http.createServer(app);
app.set('serverInstance', server);
server.listen(port);
server.on('listening', onListening);

function onListening() {
  	console.log(`Listening on http://localhost:${port} env: ${app.get('env')}`);
	initHeartbeat({
    	server,
    	debugLog: config.debugHeartbeat,
	});
	if (openClient) {
		open(`http://localhost:${port}`);
	}
}
