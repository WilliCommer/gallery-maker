import i18n from 'vanjs-bootstrap/i18n';

/**
 * translation tool
 */
const I18n = i18n();

export default I18n;

const addEnDe = ( key, ten, tde ) => I18n.addWords({en: {[key]: ten}, de: {[key]: tde}})

addEnDe( 'Cancel', 'Cancel', 'Abbrechen' );

// buttons
addEnDe( 'ButtonCancel', 'Cancel', 'Abbrechen' );
addEnDe( 'ButtonOpen', 'Open', 'Öffnen' );
addEnDe( 'ButtonSave', 'Save', 'Speichern' );
addEnDe( 'ButtonSelectFolder', 'Open', 'Öffnen' );
addEnDe( 'ButtonNewFolder', 'New Folder', 'Neu Ordner' );
addEnDe( 'ButtonDeleteSelection', 'Delete', 'Löschen' );
addEnDe( 'ButtonExplorer', 'Explorer', 'Explorer' );

// dialogs
addEnDe( 'addDirectory-header', 'New Folder', 'Neuer Ordner' );
addEnDe( 'AreYouSure-header', 'Confirmation', 'Bestätigung' );
addEnDe( 'AreYouSure-yes', 'Yes', 'Ja' );
addEnDe( 'AreYouSure-no', 'No', 'Nein' );
addEnDe( 'ButtonExplorer', 'Explorer', 'Explorer' );
addEnDe( 'ButtonExplorer', 'Explorer', 'Explorer' );


I18n.addWords({
    de: {
        'FilesToTrash': 'Dateien in den Papierkorb ?',
    },
    en: {
        'FilesToTrash': 'Files to Recycle Bin ?',
    },
    
})

I18n.addWords({
    de: {
        'image-files': 'Bild Dateien',
        'audio-files': 'Audio Dateien',
        'video-files': 'Video Dateien',
        'word-files': 'MS-Word Dateien',
        'exel-files': 'Excel Dateien',
        'pdf-files': 'PDF Dateien',
        'md-files': 'Markdown Dateien',
        'svg-files': 'SVG Dateien'
    },
    en: {
        'image-files': 'Image Files',
        'audio-files': 'Audio Files',
        'video-files': 'Video Files',
        'word-files': 'MS-Word Files',
        'exel-files': 'Excel Files',
        'pdf-files': 'PDF Files',
        'md-files': 'Markdown Files',
        'svg-files': 'SVG Files'
    },
})
