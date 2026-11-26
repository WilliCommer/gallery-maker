## File service

The file service lets the browser-based app browse and manage files through an Express API. The client also provides reusable directory/file models and file-selection dialogs.


### Server: `server/file-router.js`

#### Initialization and file-system root

The default export is a router factory:

```js
fileRouter({ root, fileRoot, debug, log })
```

`fileRoot` takes precedence over `root`. The app passes `config.fileRoot` as `root`. When a root is configured, normalized paths outside it are rejected. Routes that request real-path checks also resolve symlinks before proceeding. `root: null` uses the process-wide file system path resolution instead of a configured root; the source marks this mode as experimental.

Directory entries whose names start with `.` are omitted. Each returned entry includes its name, whether it is a directory, its size, and its last-modified time. File-system errors from most routes are passed to Express error handling; `/exists` responds with `false` when the path cannot be resolved or inspected.

#### HTTP API

The routes below are relative to the router mount point (`/api` in this app). JSON request bodies are used for `POST` requests.

| Route | Request | Result |
| --- | --- | --- |
| `GET /dir` | — | Lists the root directory. |
| `GET /dir/*path` | Path in URL segments | Lists the requested directory. |
| `POST /files` | `{ "path": "folder/subfolder" }` or an array of path segments | Lists a directory. |
| `POST /exists` | `{ "path": "folder/file" }` or `{ "filename": "folder/file" }` | File metadata (`path`, `name`, `isDir`, `size`, `time`), or `false`. |
| `POST /mkdir` | `{ "path": "folder/new-folder" }` or a `filename` field | Creates the directory and missing parent directories; responds with `true`. |
| `POST /trash` | `{ "path": "folder/file" }` / `{ "filename": "folder/file" }`, or `{ "directory": "folder", "files": ["a", "b"] }` | Moves the target(s) to the operating system trash; responds with `true`. |
| `POST /open` | `{ "filename": "folder/file" }`, optionally with `"args": [...]` | Opens a path with the default application, or invokes the named application with arguments; responds with `true`. |
| `POST /readtextfile` | `{ "path": "folder/file" }` or a `filename` field | Returns the file contents as `text/plain`. |
| `POST /write` | `{ "path": "folder/file", "content": "..." }` or a `filename` field | Writes the content and responds with `true`. |

Directory-list responses have the shape:

```json
{
  "dir": "folder/subfolder",
  "path": ["folder", "subfolder"],
  "resolvedDir": "/absolute/path/to/folder/subfolder",
  "files": [
    { "name": "photo.jpg", "isDir": false, "size": 1234, "time": "..." }
  ]
}
```

The application also serves files under `/api/get` as static content from `config.staticGet`. This is separate from the router and is used by the client to display file previews.

### Client: `client/file-service/`

`client/file-service.js` re-exports the default object assembled in `client/file-service/index.js`. That object combines the API functions, file tools, dialogs, translations, and path helpers. The app sets the API base URL to `/api` during startup; the API module's standalone default is `/app/file`.

#### API functions

The functions in `file-service-api.js` make requests to the configured API base:

- `setURL(url)` changes the base URL.
- `getURL(filename)` builds a browser URL for a file served from the static `/get` path, primarily for images and previews.
- `getDir(path = '')`, `mkDir(path, newDir)`, `exists(filename)`, `readTextFile(filename)`, `writeFile(filename, content)`, `trashFile(filename)`, `trash(directory, files)`, and `open(filename, args)` call the corresponding server operations.
- `getFileSystemPath(path)` resolves a path through `exists` and returns the resolved path when available.
- `normalizeFilename(filename)` returns the resolved path when available, otherwise a normalized version of the input.

API helpers log request errors to the browser console. The JSON helper and `readTextFile` return `undefined` when a request fails.

#### File and directory models

`file-tools.js` exports:

- `FileItem`, which represents an entry and exposes its parent directory, extension, relative `pathName`, and absolute `filePath`.
- `Directory`, which stores the current path and entries. Its `getDir(path)` loads entries via the API, applies its optional filter and sort functions, and returns whether loading succeeded. The default sort puts directories before files, then sorts by name.
- `isValidFilename(name)` and `isValidDirectoryName(name)`, which check common filename restrictions, including forbidden characters, trailing dots/spaces, and reserved Windows device names.
- `fileExtension`, `FileIcon`, `MIME_GROUPS`, and `fileIsMime` for extension lookup, file icons, and file-type filtering.

#### Dialogs and UI helpers

`file-dialog.js` provides `SelectController` for directory navigation, selection state, and selection events; reusable buttons and dialog components; and higher-level dialogs:

- `selectImageFilesDlg({ dir, header, multiple = true })` selects image files and can show previews.
- `selectFileDialog({ dir, header, mime, filter, multiple = false, event })` selects files, optionally filtered by a MIME group or custom filter.
- `selectSingleFileDialog({ dir, fileName, header, mime, filter })` selects one file and returns its path.
- `selectDirectoryDlg({ dir, header, event })` opens a directory-selection dialog.
- `selectFolderDialog({ dir, header, event })` selects the current or a selected folder and returns its path.

The returned selection from the multi-file dialog is a `Directory` model containing the selected `FileItem` entries. Dialogs also support directory creation, deletion to trash, and opening the current location in the operating-system file browser where those controls are included.

The remaining modules provide the `<flexible-select>` custom element, English/German UI strings, path normalization (`joinPaths`), cross-platform path parsing (`parsePath`), sorting helpers, and a small event emitter.
