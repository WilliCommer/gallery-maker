import { van, Button, Icon, FormBuilder, Input } from 'vanjs-bootstrap';
import { PopupMenu, Modal } from 'vanjs-bootstrap/modal';
import appCtrl from './app-ctrl.js';
import fd from './file-service.js'
import i18n from './i18n.js';

const t = i18n.tPath('project-dialog');
const projectExtension = 'gmp';
const projectFileFilter = (files) => files.filter(item => (item.isDir || fd.fileExtension(item) === projectExtension));
const getRecentDir = ()=>appCtrl.session.projectDir;
const setRecentDir = (dir)=>{appCtrl.session.projectDir = dir};


export async function newProjectDlg() {
    const initialFileName = fd.joinPaths( getRecentDir(), t('New Gallery') ) //  )
    let newFilename = await saveFileDialog({ 
        initialFileName, 
        header: t('Save New Project'),
        filter: projectFileFilter,
        extension: projectExtension,
    });
    if (!newFilename) return;
    newFilename = forceExtension( newFilename, projectExtension );
    let ok = ! await fd.exists( newFilename );
    if(!ok) ok = await AreYouSure('Vorhandenes Projekt überschreiben')
    if(ok) return newFilename;
};

async function AreYouSure(text = '') {
    const dlg = Modal({
        color: "text-bg-danger",
        header: t('Bestätigung'),
        body: text,
        footer: [
            Button({ onclick: () => dlg.close(true) }, t('Ja')),
            Button({ onclick: () => dlg.close(false) }, t('Nein'))
        ],
    });
    return await dlg.asyncOpen();
};

function forceExtension( filename, ext ) {
    const parsed = fd.parsePath(filename)
    return fd.joinPaths(parsed.dir, parsed.name + '.' + ext);
}

export async function saveProjectAsDlg() {
    var newFilename = await saveFileDialog({
        initialFileName: appCtrl.session.projectFile,
        fallbackDir: getRecentDir(),
        header: t('Save Project As'),
        filter: projectFileFilter,
        extension: projectExtension,
    })
    if (!newFilename) return;
    newFilename = forceExtension( newFilename, projectExtension );
    let ok = ! await fd.exists( newFilename );
    if(!ok) ok = await AreYouSure('Vorhandenes Projekt überschreiben')
    if(ok) return newFilename;
}

export async function saveFileDialog({ 
        initialFileName, 
        header = '',
        filter,
        extension,
    }) {

    const controller = fd.SelectController({
        initialFileName,
        fallbackDir: getRecentDir(),
        multiple: false,
        filter,
        mode: 'file',
        useSelection: true,
    });
    const buttonProps = {class: 'btn-sm me-2', controller}
    const selectedFile = await fd.FileDialogInput({
        controller,
        header,
        buttons: [fd.ButtonSave(buttonProps), fd.ButtonNewFolder(buttonProps), fd.ButtonCancel(buttonProps)],
    })
    return selectedFile;
}


export async function openProjectDlg() {
    const res = await fd.selectFileDialog({ 
        dir: getRecentDir(), 
        header: t('Open Project'), 
        filter: projectFileFilter,
        multiple: false,
    });
    const ok = res && res.files.length;
    if(!ok) return;
    const filename = res.files[0].filePath;
    setRecentDir(fd.parsePath(filename).dir)
    return filename;
}


export async function selectDistFolderDialog({dir}) {
    dir = dir || getRecentDir();
    const controller = fd.SelectController({
        initialDir: dir,
        fallbackDir: getRecentDir(),
        multiple: false,
        mode: 'dir',
        filter: files => files.filter(item => item.isDir),
    });
    const buttonProps = {class: 'me-2', controller}
    const selectedDir = await fd.FileDialog({
        controller,
        header: t('selectDistDirHeader'), 
        buttons: [
            fd.ButtonSelectFolder({
                ...buttonProps,
                label: t('selectDistDir'),
            }), 
            fd.ButtonCancel(buttonProps)
        ],
    })
    return selectedDir;
}    


export async function openRecentProjectDlg() {
    let items = appCtrl.session.recentProjects || [];
    if(! items.length ) return;
    items = items.map( file => ({
        label: file, onclick: ()=>appCtrl.openProjectFile(file)
    }));
    PopupMenu(...items).open();
}

i18n.addWords({
    'New Gallery': 'Neue Galerie',
    'Save New Project': 'Neue Galerie anlegen',
    'Save Project As': 'Projekt speichern unter',
    'Open Project': 'Projektdatei öffnen',
    'selectDistDirHeader': 'Ausgabeverzeichnis wählen',
    'selectDistDir': 'Ok',
},'de','project-dialog')
i18n.addWords({
    // 'New Gallery': 'Neue Galerie',
    // 'Save New Project': 'Neue Galerie anlegen',
    // 'Save Project As': 'Projekt speichern unter',
    // 'Open Project': 'Projektdatei öffnen',
    'selectDistDirHeader': 'Select output directory',
    'selectDistDir': 'Ok',
},'en','project-dialog')