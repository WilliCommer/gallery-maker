**English** | [Deutsch](README.de.md)

# Gallery Maker

> Create lightweight photo galleries

Gallery Maker is a simple tool for organizing and generating photo galleries from local files. Instead of bundling a heavy desktop runtime like Electron, it takes a deliberately lightweight approach: Gallery Maker spins up a local Node.js server and opens its user interface right in your default browser. This gives you a local desktop-like experience without shipping an embedded browser.

## Quick Start

Clone the repository and start the application locally:

```bash
git clone https://github.com
cd gallery-maker
npm install
npm start
```

If you would like to use the program as a desktop app, you can install it globally using `npm install -g`. Alternatively, on Windows, you can create a shortcut to `start.bat` and use the `favicon.ico` file located in the `public` folder as its icon.


## A Desktop App Without Electron

On startup, Gallery Maker launches a local web server and automatically opens the app in your default browser. The UI runs in a familiar browser tab while the backend handles gallery generation and file system access—no Electron or separate browser runtime required.

A WebSocket heartbeat keeps the open tab connected to the local server. If you close the tab, the server detects the disconnect and automatically shuts down after a brief grace period (allowing quick page reloads without accidentally killing the process). To prevent state conflicts, the app is designed for a single active session: opening it in a second tab displays a notice and prevents concurrent usage.

## Local File Access via File Service

For security reasons, web pages cannot directly access your computer's file system. Gallery Maker solves this with a server-side local file service. The browser UI communicates with this service through the local server's API to browse directories, select images, and read or save gallery projects.

This file service acts as the bridge between the browser interface and your local photos. Everything stays completely local on your machine: the app works directly with your selected files to generate a ready-to-use gallery.

## Lightweight UI with VanJS

Gallery Maker builds its user interface using [VanJS](https://vanjs.org). This ultra-lightweight JavaScript library enables direct, reactive DOM manipulation without the overhead of a large UI framework or heavy runtime. Combined with Bootstrap and `vanjs-bootstrap` for styling and UI components, the client side stays clean, fast, and minimal.

## Smooth Development Workflow

The development setup is built for fast iteration:

* **`npm run dev`**: Starts the server in development mode and watches both server and client files. Client changes are automatically rebundled with `esbuild` (supporting live reload), while changes to server files trigger an automatic server restart.
* **`npm start`**: Starts the local server for normal usage and opens the app in your browser.

## From Local Photos to Ready-to-Use Galleries

At its core, Gallery Maker focuses on a clear workflow: pick your images, organize them into a gallery project, and generate the final photo gallery. You can preview the result directly inside the app or open it in a separate browser tab.

By combining the accessibility of a web UI with local file system access—and skipping Electron in favor of VanJS—Gallery Maker keeps its architecture lean while giving you direct control over your own photos.

## License

[ISC](LICENSE) © 2026 Willi Commer
