import i18n from 'vanjs-bootstrap/i18n';
import fd from './file-service.js'

const I18n = i18n();
export default I18n;

const back = I18n.setLanguage
I18n.setLanguage = value => {
    back(value)
    fd.i18n.setLanguage(value)
}

const {addWords} = I18n;


addWords({
    'File': 'Datei',
    'New Project': 'Neu',
    'Open Project': 'Öffnen',
    'Open Recent Project': 'Zuletzt benutzt..',
    'Save Project': 'Speichern',
    'Save Project As': 'Speichern unter..',

    'Project': 'Projekt',
    'Images': 'Bilder',
    'Make': 'Galerie',
    'Add Images': 'Bilder hinzufügen',
    'Options': 'Optionen',
      'compactMode': 'Kompakte Liste zum Veschieben',
      'darkTheme':   'Dunkelmodus',
      'language':    'English Language',
}, 'de', 'appMenu')

addWords({
    'File': 'File',
    'New Project': 'New',
    'Open Project': 'Open',
    'Open Recent Project': 'Open Recent Project..',
    'Save Project': 'Save',
    'Save Project As': 'Save as..',

    'Project': 'Project',
    'Images': 'Images',
    'Make': 'Gallery',
    'Add Images': 'Add Images',
    'Options': 'Options',
      'compactMode': 'Compact Mode For Moving',
      'darkTheme':   'Dark Theme',
      'language':    'Deutsche Sprache',
    
}, 'en', 'appMenu')

