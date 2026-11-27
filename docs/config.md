## Quick Start

Um dieses Programm zu installieren müssen Sie das freie [Node.js](https://nodejs.org) installieren.
To install this program, you must install the free [Node.js](https://nodejs.org).

Clone the repository or download it as Zip

```bash
git clone https://github.com
```


Then start the application locally in console

```bash
cd gallery-maker
npm install
npm start
```

You can install it globally using 

```bash
npm install -g
```

### For **Windows** usage:

#### How to create a shortcut with a custom icon

1. **Create the batch file:** *or use the existing `start.bat`*
   * Open your project folder.
   * Right-click an empty space, select **New** > **Text Document**, and name it `start.bat` (make sure to replace the `.txt` extension with `.bat`).
   * Right-click `start.bat`, select **Edit** (or open it with Notepad), paste the following line inside, and save the file:
     ```bat
     call npm start
     ```

2. **Create a shortcut:**
   * Right-click on `start.bat` and select **Create shortcut** (on Windows 11, click **Show more options** first).
   * *(Optional)* Move this new shortcut to your Desktop or wherever you want to launch the app from.

3. **Change the shortcut icon:**
   * Right-click the newly created shortcut and select **Properties**.
   * In the **Shortcut** tab, click the **Change Icon...** button at the bottom.
   * Click **Browse...**, navigate to your project's `public` folder, and select the `favicon.ico` file.
   * Click **Open**, then **OK**, and finally **Apply** / **OK** to save your changes.



### Configure Gallery Maker

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


#### Comment

The configuration "fileRoot = null" is intended to allow access to all drives.
This is an experiment, however, and it is not functioning correctly. 
One issue involves the "static" function in Express. 
Furthermore, it is not yet possible to select drives from within the browser dialogs.

