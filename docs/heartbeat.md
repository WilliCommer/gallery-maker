## Heartbeat modules

The heartbeat keeps the local Gallery Maker server alive while at least one browser tab is connected. It uses a persistent WebSocket connection; it does not send periodic ping/pong frames.

### Server: `server/heartbeat-ws.js`

#### `initHeartbeat({ server, maxClient = 1, debugLog = true })`

Initializes the heartbeat on an existing Node.js HTTP server:

- Creates a `ws` WebSocket server in `noServer` mode and handles HTTP upgrade requests whose URL is exactly `/ws-heartbeat`.
- Logs connections and closures when `debugLog` is enabled.
- Allows one client by default. When the number of connected clients exceeds `maxClient`, it sends the extra connection the `forbidden` message. The client is responsible for closing that connection.
- When the last client disconnects, schedules server shutdown after two seconds. A new connection during this delay cancels the pending shutdown.
- If the shutdown timer runs more than four seconds after it was scheduled (for example, because the computer slept), it assumes the system resumed from hibernation and waits another ten seconds for a browser to reconnect. If no client returns, the process exits with code `0`.
- In `NODE_ENV=development`, watches the `public` directory recursively. Changes are debounced for one second before a reload message is sent to connected clients.

The module is initialized by the application after the HTTP server starts listening. The server passed in must support the `upgrade` event.

#### `sendBrowserReload()`

Sends the `reload` message to every connected WebSocket client that is currently open. It does nothing if the heartbeat has not been initialized. In development, the `public` directory watcher calls this function after a change.

### Client: `client/heartbeat-client.js`

#### `connectHeartbeat(options)`

Opens a WebSocket connection to the current page's host at `/ws-heartbeat`. It selects `ws://` for HTTP pages and `wss://` for HTTPS pages.

Options are optional:

| Option | Default | Purpose |
| --- | --- | --- |
| `debug` | `true` | Enables client-side console logging. |
| `forbiddenText` | `Die App ist in einem anderen Tab geöffnet` | Text shown when the server rejects an additional tab. |
| `forbiddenClass` | `text-bg-danger p-3 fs-1` | CSS class list applied to the rejection message. |
| `appId` | `main` | ID of the application element to remove when access is forbidden. |

On receiving `reload`, the client reloads the page. On receiving `forbidden`, it appends the configured message to the document, removes the application element, and closes the socket without reconnecting. On any other socket closure, it tries to reconnect after one second using the same options.

The application imports and calls `connectHeartbeat` during client startup. The server and client must use the same WebSocket path and message strings.
