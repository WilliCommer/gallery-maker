/**
 * @module heartbeat-router
 * @description
 * Zuverlässiger WebSocket-Heartbeat für lokale Apps.
 * Schließt den Server, wenn kein Browser-Tab mehr offen ist.
 */

import { WebSocketServer } from 'ws';
import fs from 'node:fs';
import path from 'node:path';

// const clientDir = path.resolve(process.cwd(), 'client');
const clientDir = path.resolve(process.cwd(), 'public');
const time = () => new Date().toLocaleTimeString('de-DE');
const developmentMode = process.env.NODE_ENV === 'development';

let wss = null;
let shutdownTimeout = null;

// Diese Funktion wird einmalig in deiner Hauptdatei (z.B. app.js / server.js) aufgerufen
export function initHeartbeat({
    server,             // server instance
    maxClient           = 1,
    debugLog            = true,
}) {

    const log = debugLog ? console.log : ()=>{};

    // create a WebSocket server (uses the existing HTTP port from Express)
    wss = new WebSocketServer({ noServer: true });

    // instruct the Express HTTP server to pass WebSocket requests to us
    server.on('upgrade', (request, socket, head) => {
        if (request.url === '/ws-heartbeat') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        }
    });

    // connection event: a browser tab opens
    wss.on('connection', (ws) => {
        log(time(), 'browser-tab connected.', wss.clients.size);
        
        // if a shutdown was planned (e.g., via a quick refresh), cancel it immediately.
        if (shutdownTimeout) {
            clearTimeout(shutdownTimeout);
            shutdownTimeout = null;
            log(time(), 'shutdown aborted - tab is back.');
        }

        if(wss.clients.size > maxClient) {
            ws.send('forbidden')
        }

        // if the TCP connection is interrupted (tab closed, browser closed, F5 reload), hibernate
        ws.on('close', () => {
            log(time(), 'a tab was closed', wss.clients.size);
            if (wss.clients.size === 0) {
                const startShutdownAt = Date.now(); // remember timestamp upon closing
                
                shutdownTimeout = setTimeout(() => {
                    log(time(), 'No more tabs open. Shutting down in 2 seconds....');
                    const timePassed = Date.now() - startShutdownAt;
                    
                    // If significantly MORE than 2 seconds have elapsed between scheduling and executing the timeout
                    // (e.g., 30 seconds due to the system entering sleep mode),
                    // then we know: the PC has been asleep!
                    if (timePassed > 4000) { 
                        log(time(), '🔌 System hibernation detected. Shutdown postponed, waiting for client....');
                        
                        // We are giving the browser an additional 10 seconds to recover after coming out of standby.
                        shutdownTimeout = setTimeout(() => {
                            if (wss.clients.size === 0) {
                                log(time(), 'Server is now shutting down permanently.');
                                process.exit(0);
                            }
                        }, 10000);
                    } else {
                        // Normal sequence (tab was actually closed)
                        log(time(), 'The server is now shutting down.');
                        process.exit(0);
                    }
                }, 2000);
            }
        });

    });

    // start client live-reload for development
    if(developmentMode) {
        watchClientDir(clientDir);
    }
}

// Send a message to ALL open tabs (for live-reload)
export function sendBrowserReload() {
    if (wss) {
        console.log(time(), `Send Reload to ${wss.clients.size} open tabs.`);
        wss.clients.forEach((client) => {
            if (client.readyState === 1) { // 1 = OPEN
                client.send('reload');
            }
        });
    }
}

function watchClientDir(clientDir) {
    console.log('fs.watch', clientDir);
    fs.watch(clientDir, { recursive: true }, debounce(sendBrowserReload, 1000));
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
