import './file-dialog.css';  // ! todo 
import { van, Button, Input } from 'vanjs-bootstrap';
import { Modal } from 'vanjs-bootstrap/modal';
import * as ft from './file-tools';
import * as fs from './file-service-api.js';
import joinPaths from './joinpaths.js';
import parsePath from './parse-path.js'
import EventEmitter from './event-emitter.js'
import i18n from './i18n.js';

const { t } = i18n;
const { div, img } = van.tags;
const isImageFile = file => ft.fileIsMime(file, 'image')
const selectFileBoxId = 'select-file-box';



/**
 * Events:
 * - init
 * - directoryChange
 * - fileItemClick(file)
 * - fileItemDblClick(file)
 * - selectionChange
 * - fileNameChange
 * 
 * @param {object} opt 
 * @param {string} opt.initialDir - directory path to start directory
 * @param {string} opt.initialFileName - file name to start directory alternatively to initialDir. Also sets 'fileName'
 * @param {string} opt.mode - 'file', 'image', 'dir'
 * @param {function} opt.filter -
 * @param {function} opt.sort -
 * @param {boolean} opt.multiple - enable multiple file select
 * @property {Directory} directory - actual directory
 * @property {Directory} selection - actual selection
 * @property {boolean} anySelected - van.state
 * @property {function} loadDirectoryFiles - async loadDirectoryFiles(path)
 * @property {function} updateSelection - updateSelection( selectValue ) internal
 * @returns {object} - the controller
 */
export function SelectController(opt = {}) {

    var { 
        initialDir, initialFileName, 
        fallbackDir = '',
        mode, filter, sort,
        multiple, widthDirectoryUp, useSelection 
    } = opt;
    var directory = new ft.Directory({ filter, sort });
    var selection = new ft.Directory();
    const anySelected = van.state(false);
    const emitter = new EventEmitter();

    const self = {
        returnRelativePath: false,
        ...opt,
        directory,
        selection,
        anySelected,
        selectedFile: null,
        fileName: '',
        updateSelection,    // updateSelection( selectValue )
        fileItemView: simpleFileItem,

        get path() {
            return directory.path
        },

        isSelectedFile(file) {
            return !!(useSelection && selection.files.find(f => f.name === file.name));
        },

        init() {
            // split initialFileName to 'initialDir' and 'fileName'
            if(initialFileName) {
                const parsed = parsePath(initialFileName)
                // get file name with extension
                self.fileName = parsed.base; 
                initialDir = parsed.dir; 
            }
            emitter.on('fileItemDblClick', file => self.getDirByFile(file) )
            emitter.emit('init');
            self.loadDirectoryFiles(initialDir)
        },

        async loadDirectoryFiles(path) {
            // console.log('loadDirectoryFiles', path)
            anySelected.val = false;

            // load directory content
            if (!(await directory.getDir(path))) {
                // directory does not exits ? try root
                console.log('directory not exists', path)
                if (!(await directory.getDir(fallbackDir))) {
                    console.error('can not access directory')
                    return false;
                }
            }

            // add a 'directory up' file (deprecated)
            if (widthDirectoryUp) {
                let file = {
                    name: '..',
                    isDir: true
                }
                directory.files.unshift(file);
            }

            // crete a fresh selection
            selection = new ft.Directory({ path: directory.path })
            selection.resolvedDir = directory.resolvedDir
            self.selection = selection;
            if(useSelection && self.fileName) {
                const file = directory.fileByName(self.fileName);
                if(file) {
                    selection.addFile(file);
                    anySelected.val = true;
                }
            }

            if (mode === 'dir') anySelected.val = true;

            emitter.emit('directoryChange');
            return true;
        },

        async getDirByFile(file) {
            if (file?.isDir && await self.loadDirectoryFiles([...self.path, file.name]))
                return true
        },

        async dirUp() {
            let path = [...self.path];
            path.pop();
            if (await self.loadDirectoryFiles(path))
                return true;
        },


        isValidExtension(ext) {
            if(!Array.isArray(self.validExtensions)) return true;
            return self.validExtensions.includes(ext)
        },

        on(event, listener)     {return emitter.on(event, listener) },
        off(event, listener)    {return emitter.off(event, listener) },
        once(event, listener)   {return emitter.once(event, listener) },
        emit(event, ...args)    {return emitter.emit(event, ...args) },

    }

    function updateSelection(selectValue) {
        // handle difference of multple value
        if (!selectValue) selectValue = [];
        if (!Array.isArray(selectValue)) selectValue = [selectValue];

        // clear selection
        selection.files = [];

        // collect selected files into 'selection'
        for (let name of selectValue) {
            let file = directory.fileByName(name);
            if (file) selection.addFile(file);
        }

        // set the shared van state
        anySelected.val = (mode === 'dir') || selection.files[0];

        // first selected file will get 'fileName'
        self.selectedFile = selection.files.find(o => !o.isDir);
        if (self.selectedFile) {
            self.fileName = self.selectedFile.name;
        }

        // notify subscribers
        emitter.emit('selectionChange');
    }


    return self;

}




function simpleFileItem({ file, controller }) {

    const icon = controller.previewImage && isImageFile(file)
        ? img({
            src: fs.getURL(file.pathName),
            class: 'thumb-item me-2',
        })
        : ft.FileIcon({ file, class: "me-2" })

    const sel = controller.isSelectedFile(file) ? {selected: true} : {}

    return div(
        {
            class: 'filebox-item',
            ...sel,
            value: file.name,
            onclick: () => controller.emit('fileItemClick', file),
            ondblclick: () => controller.emit('fileItemDblClick', file),
        },
        div({ title: file.name }, icon, file.name)
    )
}



/**
 * SelectFileBox is a HTML `<select>` element. It shows the files from `fileData`
 * a van component display multi select box
 * 
 * @param {object} param0 
 * @param {object} param0.controller 
 * @returns {HTMLElement}
 */

export function SelectFileBox({
    controller,
    onclick = () => { },
    style, class: clas
} = {}) {

    const { multiple } = controller;
    // return an array of "option" elements each display file name and icon and value=file.name
    const options = controller.directory.files.map(file => controller.fileItemView({ file, controller }));

    const select = van.tags["flexible-select"](
        {
            id: selectFileBoxId,
            multiple,
            class: "filebox overflow-y-auto" + (clas ? " " + clas : ""),
            style: `user-select: none;${style ? ' ' + style : ''}`,
            onclick,
            onchange: event => controller.updateSelection(event.target.value),
        },
        ...options,
    )
    return select;
}



/**
 * 
 * @param {Array<string>} directoryPath 
 * @param {function} getDir - open clicked directory
 * @returns {HTMLElement}
 */
export function DirectoryBreadCrumb(directoryPath, getDir) {

    const {nav,a,li,ol} = van.tags;
    const click = link => event => {event.preventDefault(); getDir(link);}

    const Item = (label, active, link) => {
        if (active) {
            return li({ class: 'breadcrumb-item directory active' }, label);
        } else {
            return li({ class: 'breadcrumb-item directory' },
                a({ href: '#', role: 'button', onclick: click(link) }, label)
            );
        }
    }

    const itemList = () => {
        const items = [];
        if (directoryPath.length === 0) {
            items.push(Item('🗀'));
        } else {
            items.push(Item('🗁', false, []));
            for (let i = 0; i < directoryPath.length - 1; i++)
                items.push(Item(directoryPath[i], false, directoryPath.slice(0, i + 1)));
            items.push(Item(directoryPath[directoryPath.length - 1], true));
        }
        return items;
    }

    return nav({ class: 'bg-body-tertiary', 'aria-label': 'breadcrumb' },
        ol({ class: 'breadcrumb mb-1' },
            ...itemList()
        )
    )
}









/**
 * 
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonCancel(args) {
    const { controller, label = t('ButtonCancel'), ...props } = args;
    return Button({
        onclick: () => controller.dlgClose(false),
        ...props
    }, label)
}

/**
 * return selction object
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonOpen(args) {
    const { controller, label = t('ButtonOpen'), ...props } = args;

    function onclick() {
        const selectedDir = controller.selection.files.find(o => o.isDir);
        if (selectedDir) {
            controller.getDirByFile(selectedDir);
            return;
        }
        controller.dlgClose(controller.selection)
    };

    controller.on('fileItemDblClick', file => {
        if (file.isDir) {
            // controller.getDirByFile(file);
        } else {
            controller.dlgClose(controller.selection)
        }
    });


    return Button({
        disabled: () => !controller.anySelected.val,
        onclick,
        ...props,
    }, label)
    
}


/**
 * return selected file path
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonOpenSingle(args) {
    const { controller, label = t('ButtonOpen'), ...props } = args;

    function onclick() {
        let file = controller.selection.files.find(o => o.isDir);
        if (file) {
            controller.getDirByFile(file);
            return;
        }
        file = controller.selection.files[0];
        if(file) {
            const result = controller.returnRelativePath ? file.pathName : file.filePath
            controller.dlgClose(result)
            return;
        }
        console.error('problem in ButtonOpenSingle')
    };

    controller.on('fileItemDblClick', file => {
        if (file.isDir) {
            // controller.getDirByFile(file);
        } else {
            const result = controller.returnRelativePath ? file.pathName : file.filePath
            controller.dlgClose(result)
        }
    });


    return Button({
        disabled: () => !controller.anySelected.val,
        onclick,
        ...props,
    }, label)
    
}


/**
 * return user edit input as file path
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonSave(args) {
    const { controller, label = t('ButtonSave'), ...props } = args;

    const fileOk = van.state(false);
    const checkName = () => {
        const {name, ext} = parsePath(controller.fileName);
        fileOk.val = ft.isValidFilename(name) && controller.isValidExtension(ext)
    }
    controller.on('fileNameChange', checkName );
    controller.on('selectionChange', checkName );
    controller.on('directoryChange', checkName );
    
    function onclick() {
        const dir = controller.returnRelativePath ? controller.directory.dir : controller.directory.resolvedDir
        const filePath = joinPaths( dir, controller.fileName );
        controller.dlgClose(filePath)
    };

    return Button({
        disabled: () => !fileOk.val,
        onclick,
       ...props
    }, label )
}



/**
 * return selected directory path
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonSelectFolder(args) {
    const { controller, label = t('ButtonSelectFolder'), ...props } = args;

    function onclick() {
        const selected = controller.selection.files[0];
        if (selected) {
            const result = controller.returnRelativePath ? selected.pathName : selected.filePath
            controller.dlgClose(result)
        }
        const dir = controller.returnRelativePath ? controller.directory.dir : controller.directory.resolvedDir
        controller.dlgClose(dir);
    };

    return Button({
        onclick,
        ...props,
    }, label )
}


/**
 * 
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonNewFolder(args) {
    const { controller, label = t('ButtonNewFolder'), ...props } = args;
    return Button({
        onclick: () => addDirectory({controller}),
        ...props,
    }, label )
}

/**
 * 
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonDeleteSelection(args) {
    const { controller, label = t('ButtonDeleteSelection'), ...props } = args;
    return Button({
        disabled: () => !controller.anySelected.val,
        onclick: () => deleteSelection(controller),
       ...props,
    }, label )
}

/**
 * 
 * @param {object} controller 
 * @returns {HTMLElement}
 */
export function ButtonExplorer(args) {
    const { controller, label = t('ButtonExplorer'), ...props } = args;
    return Button({
        onclick: () => openExplorer(controller),
        ...props,
    }, label )
}


function openExplorer(controller) {
    // fs.open('powershell.exe', ["-Command", `"start \\"c:/${controller.directory.dir}\\"`])
    fs.open('powershell.exe', ["-Command", `"start \\"${controller.directory.resolvedDir}\\"`])
}


async function addDirectory(args) {
    const { controller, label = t('Cancel'), ...props } = args;
    const validate = name => {
        // console.log('validate name', name, ft.isValidDirectoryName(name), controller.directory.fileByName(name) )
        if (!ft.isValidDirectoryName(name)) return false;
        if (controller.directory.files.find(f => f.name.localeCompare(name, undefined, { sensitivity: 'base' }) === 0))
            return false;
        return true;
    }
    console.log('addDirectory',controller.directory)
    let name = await AskName({
        header: t('addDirectory-header'),
        label: 'Name',
        validate
    });
    if (!name) return;
    console.log('addDirectory',controller.directory.path, name)
    await fs.mkDir(controller.directory.path, name)
    await controller.loadDirectoryFiles(controller.directory.path);
}

async function deleteSelection(controller) {
    const files = controller.selection.files.map(f => f.name);
    if (!files.length) return;
    if (! await AreYouSure(`${files.length} ${t('FilesToTrash')}`)) return;
    await fs.trash(controller.directory.path, files)
    await controller.loadDirectoryFiles(controller.directory.path);
}


async function AskName({ header, label, validate, aname = '' }) {
    const id = 'ask-name-input';
    const name = van.state(aname);
    const isvalid = van.state(validate(aname));
    const oninput = event => {
        name.val = event.target.value;
        isvalid.val = validate(event.target.value)
    }
    const dlg = Modal({
        header,
        body: Input({ id, value: name.val, oninput, isvalid }),
        footer: [
            Button({ onclick: () => dlg.close(true), disabled: () => !isvalid.val }, 'Ok'),
            Button({ onclick: () => dlg.close(false) }, t('Cancel'))
        ],
        onkeydown: event => { if (event.key === 'Enter' && isvalid.val) dlg.close(true) },
    });
    dlg.onShown = () => { document.getElementById(id).focus() };
    var res = await dlg.asyncOpen();
    if (res) return name.val;
    return false;
};



async function AreYouSure(text = '') {
    const dlg = Modal({
        color: "text-bg-danger",
        header: t('AreYouSure-header'),
        body: text,
        footer: [
            Button({ onclick: () => dlg.close(true) }, t('AreYouSure-yes')),
            Button({ onclick: () => dlg.close(false) }, t('AreYouSure-no'))
        ],
    });
    return await dlg.asyncOpen();
};


/**
 * Generic File Dialog
 * 
 * @param {object} param0 
 * @param {object} param0.controller 
 * @param {Arrray<function>} param0.buttons 
 * @param {string} param0.header 
 * @param {string} param0.fileBoxStyle 
 * @param {object} param0.modalProps 
 * @returns {HTMLElement}
 */

export async function FileDialog({
    controller,
    buttons,
    header,
    fileBoxStyle = 'max-height: 300px;',
    modalProps = {},
    event,  // benutzt die popup Position des Dialogs zu berechnen 
}) {

    const { class: modalClass, ...modalOptions } = modalProps;
    // buttons = buttons.map(b => b(controller))
    const dlg = Modal({
        header,
        body: div({ id: 'select-file-body' }),
        footer: buttons,
        // onkeydown: handleKeyDown,
        ...modalOptions,
        class: modalClass
    });


    controller.dlgClose = dlg.close;
    controller.on('directoryChange',  () => {
        document.getElementById('select-file-body').replaceChildren(
            DirectoryBreadCrumb(controller.path, controller.loadDirectoryFiles),
            SelectFileBox({ controller, style: fileBoxStyle })
        )
    })

    controller.init();

    let res = await dlg.asyncOpen(event);
    return res;
};




export function FileInput({
    controller,
}) {

    const oninput = event => {
        controller.fileName = event.target.value;
        controller.emit('fileNameChange')
    }

    const input = Input({
        value: controller.fileName, 
        id: 'file-dialog-input', 
        oninput,
        style: 'margin-top: 0.5em;'
    })

    controller.on('selectionChange', ()=>{
        if(controller.selectedFile) {
            const newValue = controller.fileName;
            // console.log('newValue', newValue)
            input.value = newValue;
        }
    })

    return input;
}



export async function FileDialogInput({
    controller,
    buttons,
    header,
    fileBoxStyle = 'max-height: 300px;',
    modalProps = {},
}) {

    const { class: modalClass, ...modalOptions } = modalProps;
    // buttons = buttons.map(b => b(controller))
    const dlg = Modal({
        header,
        body: div({ id: 'select-file-body' }),
        footer: buttons,
        // onkeydown: handleKeyDown,
        ...modalOptions,
        class: modalClass
    });


    controller.dlgClose = dlg.close;
    controller.on('directoryChange', () => {
        document.getElementById('select-file-body').replaceChildren(
            DirectoryBreadCrumb(controller.path, controller.loadDirectoryFiles),
            SelectFileBox({ controller, style: fileBoxStyle }),
            FileInput({ controller }),
        )
    })

    controller.init();

    let res = await dlg.asyncOpen(event);
    return res;


};







/**
 * Image file dialog with image preview
 * 
 * @param {object} param0 
 * @param {string} param0.dir - initial directory 
 * @param {string} param0.header - dialog caption
 * @param {boolean} param0.multiple -  
 * @returns {Directory} - selection
 */
export async function selectImageFilesDlg({ dir, header, multiple = true }) {

    const mime = ft.MIME_GROUPS['image'];
    const filter = (files) => files.filter(item => (item.isDir || ft.fileIsMime(item, 'image')));
    header = header || mime.title

    const controller = SelectController({
        initialDir: dir,
        multiple,
        previewImage: true,
        mode: 'image',
        filter,
    });
    const buttonProps = {class: 'me-2', controller}
    const res = await FileDialog({
        controller,
        header,
        // fileBoxStyle: 'height: 100%;',
        fileBoxStyle: 'height: 70vh;',
        modalProps: { class: 'modal-fullscreen' },
        buttons: [
            ButtonOpen(buttonProps), 
            ButtonNewFolder(buttonProps), 
            ButtonDeleteSelection(buttonProps), 
            ButtonExplorer(buttonProps), 
            ButtonCancel(buttonProps)
        ],
    })
    return res;
}


/**
 * Image file dialog with image preview
 * 
 * @param {object} param0 
 * @param {string} param0.dir - initial directory 
 * @param {string} param0.header - dialog caption
 * @param {boolean} param0.multiple -  
 * @returns {Directory} - selection
 */

export async function selectDirectoryDlg({ dir, header, event }) {
    return selectFilesDlg({ dir, header, mode: 'dir', multiple: false, event })
}


/**
 * Open file dialog
 * 
 * @param {object} param0 
 * @param {string} param0.dir - initial directory 
 * @param {string} param0.header - dialog caption
 * @param {boolean} param0.multiple -  
 * @param {string} param0.mime -  
 * @param {function} param0.filter -  
 * @returns {Directory} - selection
 */

export async function selectFileDialog({ dir, header, mime, filter, multiple = false, event }) {

    if (mime && ft.MIME_GROUPS[mime]) {
        filter = (files) => files.filter(item => (item.isDir || ft.fileIsMime(item, mime)));
        header = header || ft.MIME_GROUPS[mime].title
    }

    const controller = SelectController({
        initialDir: dir,
        multiple,
        filter,
        mode: 'file',
    });
    const buttonProps = {class: 'me-2', controller}
    const res = await FileDialog({
        controller,
        header,
        buttons: [ButtonOpen(buttonProps), ButtonCancel(buttonProps)],
        event,  // benutzt die popup Position des Dialogs zu berechnen 
    })
    return res;
}



/**
 * Open file name dialog. Return selected file path
 * 
 * @param {object} param0 
 * @param {string} param0.dir - initial directory 
 * @param {string} param0.header - dialog caption
 * @param {boolean} param0.multiple -  
 * @param {string} param0.mime -  
 * @param {function} param0.filter -  
 * @returns {Directory} - selection
 */

export async function selectSingleFileDialog({ dir, fileName, header, mime, filter }) {

    if (mime && ft.MIME_GROUPS[mime]) {
        filter = (files) => files.filter(item => (item.isDir || ft.fileIsMime(item, mime)));
        header = header || ft.MIME_GROUPS[mime].title
    }

    const controller = SelectController({
        initialDir: dir,
        initialFileName: fileName,
        multiple: false,
        filter,
        mode: 'file',
    });
    const buttonProps = {class: 'me-2', controller}
    const res = await FileDialog({
        controller,
        header,
        buttons: [ButtonOpenSingle(buttonProps), ButtonCancel(buttonProps)],
    })
    return res;
}


/**
 * Select folder dialog
 * 
 * @param {object} param0 
 * @param {string} param0.dir - initial directory 
 * @param {string} param0.header - dialog caption
 * @returns {string} - selected directory path
 */

export async function selectFolderDialog({ dir, header, event }) {
    const controller = SelectController({
        initialDir: dir,
        multiple: false,
        mode: 'dir',
        filter: files => files.filter(item => item.isDir),
    });
    const buttonProps = {class: 'me-2', controller}
    const res = await FileDialog({
        controller,
        header,
        buttons: [ButtonSelectFolder(buttonProps), ButtonCancel(buttonProps)],
        event,  // benutzt die popup Position des Dialogs zu berechnen 
    })
    return res;

}
