/**
 * application controller
 */


import EventEmitter from './event-emitter.js';
import fd from './file-service.js'
import * as pd from './project-dialog.js';

const emitter = new EventEmitter()

const appCtrl = {

    on(event, listener)     {return emitter.on(event, listener) },
    off(event, listener)    {return emitter.off(event, listener) },
    once(event, listener)   {return emitter.once(event, listener) },
    emit(event, ...args)    {return emitter.emit(event, ...args) },

    session: {                  // global backend data
        projectDir: '',         // recent project dir
        imageDir: '',           // recent image dir
        recentProjects: [],     // list of last project files
        projectFile: '',        // current project file path
        project: {},            // current file content
    },

    // onChange( func ) { return emitter.on( 'change', func ) },
    // change() { emitter.emit( 'change' )},

    async init() {
        await appCtrl.fetchSession()
    },

    debugLog() {
        appCtrl.on('session', () => {
            console.log('session change', appCtrl.session)
        })
        appCtrl.on('project', () => {
            console.log('project change', appCtrl.session.project)
        })
    },

    async fetchSession() {
        try {
            const response = await fetch('api/session')
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
            const result = await response.json();
            appCtrl.session = result;
        } catch (error) {
            console.error(error.message);
        }
        appCtrl.emit('session')
        appCtrl.emit('project')
    },

    async postSession() {
        try {
            const response = await fetch('api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appCtrl.session)
            });
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
        } catch (error) {
            console.error(error.message);
        }
    },

    async postFile() {
        if(!appCtrl.session.projectFile) return;
        const text = JSON.stringify(appCtrl.session.project,null,2)
        return  await fd.writeFile( appCtrl.session.projectFile, text )
    },

    // report changes for auto save and browser refresh
    // what: undefined or 'all' || 'session' = save to backend || 'project' = save to file
    changed( what, silent ) {
        const toBackend = debounce( appCtrl.postSession, 500 )
        const toFile = debounce( appCtrl.postFile, 500 )
        const toApp = debounce( ()=> {
            appCtrl.emit('session')
            appCtrl.emit('project')
        }, 80 );
        if(!silent) toApp()
        if(!what || what === 'project') toFile();
        if(!what || what === 'session') toBackend();
    },

    async newProject() {
        const filename = await pd.newProjectDlg()
        if(!filename) return;
        const parsed = fd.parsePath(filename)
        const project = {
            name:       parsed.name,
            title:      parsed.name,
            directory:  parsed.dir,
            images: [],
        }
        appCtrl.session.projectFile = filename
        appCtrl.session.project = project
        await fd.writeFile( filename, JSON.stringify(project,2) )
        handleRecentProject( filename )
        await appCtrl.postSession()
        appCtrl.emit('session')
        appCtrl.emit('project')
    },

    async saveProject() {
        if(!appCtrl.session.projectFile) return;
        const text = JSON.stringify(appCtrl.session.project,null,2)
        const ok = await fd.writeFile( appCtrl.session.projectFile, text )
        // if(!ok) {  // maybe directory was deleted
        //     await pd.saveProjectAsDlg()
        // }
    },

    async openProjectFile(filename) {
        if(!filename) return;
        try {
            const txt = await fd.readTextFile(filename);
            if(! txt) {
                throw new Error(`${filename} not found`)
            }
            appCtrl.session.projectFile = filename;
            appCtrl.session.project = JSON.parse(txt)
            handleRecentProject(filename)
            appCtrl.changed('session')
        } catch(err) {
            console.error(err.message)
            handleRecentProject(filename, true)
            appCtrl.changed('session',true)
        }
    },

    async openProject() {
        const filename = await pd.openProjectDlg();
        if(!filename) return;
        // const txt = await fd.readTextFile(filename);
        // console.log('txt',txt);
        appCtrl.openProjectFile(filename);
    },


    async saveProjectAs() {
        const filename = await pd.saveProjectAsDlg();
        if(!filename) return;
        // console.log('Save As',filename);
        appCtrl.session.projectFile = filename;
        handleRecentProject(appCtrl.session.projectFile);
        appCtrl.changed();
    },

    async openRecentProject() {
        pd.openRecentProjectDlg()
    },

    addImageFiles,
};


function handleRecentProject( filename, remove ) {
    let list = appCtrl.session.recentProjects || [];
    if(remove) {
        list = list.filter(f=>f !== filename)
    } else {
        let index = list.indexOf(filename);
        if (index !== -1) list.splice(index, 1);
        list.unshift(filename);
    }
    appCtrl.session.recentProjects = list
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}


async function addImageFiles() {
    const recentDir = appCtrl.session.imageDir || appCtrl.session.projectDir;
    const selection = await fd.selectImageFilesDlg({ dir: recentDir, header: 'Bilder wählen' })
    if(!selection || !selection.files.length) return

    const images = appCtrl.session.project.images || [];
    const newImages = [];
    appCtrl.session.imageDir = selection.resolvedDir;
    for (let file of selection.files) {
        // skip duplicate
        if(images.some( i => i.img === file.filePath)) continue;
        let title = file.name.split('.').slice(0, -1).join('.');
        newImages.push({
            img: file.filePath,
            title,
            comment: '',
            rotate: 0
        })
    }
    appCtrl.session.project.images = [...images, ...newImages]
    appCtrl.changed()
}


export default appCtrl;

