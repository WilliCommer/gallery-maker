## Quick Start

Clone the repository and start the application locally:

```bash
git clone https://github.com
cd gallery-maker
npm install
npm start
```

If you would like to use the program as a desktop app, you can install it globally using `npm install -g`. Alternatively, on Windows, you can create a shortcut to `start.bat` and use the `favicon.ico` file located in the `public` folder as its icon.



## Configure Gallery Maker

Edit `config.json` for configuration.

- "port": 3007  
  the port for web server

- "fileRoot": "/"  
  This is thee root path for file access in browser.  
  Use `{HOMEDIR}` to set the root to user home  
  It is the Node os.homedir() (`C:\Users\username\` for Windows)  

- "projectDir": "{HOMEDIR}/Documents"  
  Set the fallback directory for the directory and file dialogs  

- "sessionDataDir": "./data"  
  Where the server stores it's session data  
    
- "debug": true
- "debugHeartbeat": true
- "debugFileservice": true  
  Enable / disable debug logs to backend console  


### Comment

The configuration "fileRoot = null" is intended to allow access to all drives.
This is an experiment, however, and it is not functioning correctly. 
One issue involves the "static" function in Express. 
Furthermore, it is not yet possible to select drives from within the browser dialogs.

