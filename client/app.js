import { van, Navbar, Icon } from 'vanjs-bootstrap';
import * as vanB from 'vanjs-bootstrap';
import i18n from './i18n.js';
import * as pd from './project-dialog.js';
import appCtrl from './app-ctrl.js';
import fs from './file-service.js'
import DirectoryInput from './directory-input.js';
import pageGallery from './page-gallery.js'

const { t } = i18n;

var mainPage = projectPanel
var appPage = Page();
export default appPage;

appCtrl.on( 'project', () => {
  appPage.replaceChildren(Page());
})
appCtrl.on('session', ()=> {
  updateDarkTheme()
  i18n.setLanguage(appCtrl.session.language)
})

function showProject() {
  mainPage = projectPanel
  appPage.replaceChildren(Page());
}

function showImages() {
  mainPage = pageGallery
  appPage.replaceChildren(Page());
}


function updateDarkTheme() {
  const bsTheme = appCtrl.session.darkTheme ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', bsTheme);
}
function getDarkTheme() {
  return appCtrl.session.darkTheme
}
function setDarkTheme(value) {
  appCtrl.session.darkTheme = value
  updateDarkTheme()
}


// build gallery in backend and show the result in a iframe

async function showGallery() {
  const {a, div, h2, iframe, p} = van.tags;
  const t = i18n.tPath('gallery-page')
  let generatorResult, resultPage;
  try {
    const response = await fetch('api/makegallery', {
      method: 'POST',
      // no data, server take project from session
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    generatorResult = await response.json();
    // console.log(generatorResult);
  } catch (error) {
      console.error(error.message);
      generatorResult = {error: error.message}
  }

  // show error result
  if(!generatorResult || generatorResult.error || !generatorResult?.indexFilePath) {
    mainPage = () => div(
      h2(t('errorHeader')),
      div({class: 'mt-4 p-4 bg-danger text-white fs-3'},
        p('Error: ', generatorResult?.error || ''),
        p('imgDir: ', generatorResult?.imgDir || ''),
        p('indexFilePath: ', generatorResult?.indexFilePath || ''),
      )
    )
    appPage.replaceChildren(Page());
    return;
  }

  // show gallery iframe
  mainPage = () => div(
    // not allowed
    // a({href: 'file:///' + generatorResult.indexFilePath, target:"_blank", rel:"noopener noreferrer"}, t('open in new tab')),
    a({href: fs.getURL(generatorResult.indexFilePath), target:"_blank", rel:"noopener noreferrer"}, t('open in new tab')),
    iframe({
      src: fs.getURL(generatorResult.indexFilePath),  // filename as url
      class: "w-100 border-0 rounded shadow-sm",
      style: "height: 80vh; min-height: 500px;",
      title: "Bildergalerie",
      loading: "lazy",
    }),
  )
  appPage.replaceChildren(Page());
}

i18n.addWords({
  errorHeader: 'Fehler beim Erzeugen der Galerie',
  'open in new tab': 'In einem neuen Browsertab öffnen',

}, 'de', 'gallery-page')
i18n.addWords({
  errorHeader: 'Error creating the gallery',
  'open in new tab': 'Open in a new browser tab',

}, 'en', 'gallery-page')







// application page

function Page() {
  const { div } = van.tags;
  return div({ id: 'app-content' },
    Navbar({
      class: 'p-0',
      menu: appMenu(),
    }),
    div({ class: "container-fluid p-3" },
      mainPage(),
    ),
  );
}





// edit project settings

function projectPanel() {
  const t = i18n.tPath('project-panel');
  const project = appCtrl.session.project || {}
  const values = {...project, projectFile: appCtrl.session.projectFile}
  const fb = vanB.FormBuilder({cols: '2 4', autoRow: true, rowClass: 'mb-2', values})
  .add({name:'title',label:t('Title')})
  .add({name:'name',label:t('Name')})
  .add({name:'directory',label:t('Directory'), input:DirectoryInput, cols: '2 10'})
  .add({name:'projectFile',label:t('Filename'), readonly: true, cols: '2 10'})

  fb.onChange((name,value)=>{
    const {projectFile, ...values} = fb.values;
    appCtrl.session.project = {...appCtrl.session.project, ...values}
    appCtrl.changed('',true)
  })

  return fb.dom
}

i18n.addWords({
  Title: 'Überschrift',
  Name: 'Name',
  Directory: 'Zielverzeichnis',
  Filename: 'Dateiname'
}, 'de', 'project-panel')
i18n.addWords({
  Title: 'Title',
  Name: 'Name',
  Directory: 'Destination Folder',
  Filename: 'File Name'
}, 'en', 'project-panel')








function appMenu() {
  const t = i18n.tPath('appMenu')
  const { h4, span } = van.tags;
  const iconLabel = (icon, label) => span(Icon(icon, { class: 'me-1' }), label);
  const hash = window.location.hash;

  return {
    brand: h4({ class: "nav-brand me-3 my-0 d-flex align-items-center" },
      Icon('LOGO', { class: 'me-2 mt-1' }),
      t('Gallery Maker')
    ),
    items: [
      {
        label: iconLabel('FILE', t('File')), items: [
          { label: iconLabel('SPACE', t('New Project')), onclick: appCtrl.newProject },
          { label: iconLabel('SPACE', t('Open Project')), onclick: appCtrl.openProject },
          { label: iconLabel('SPACE', t('Open Recent Project')), onclick: appCtrl.openRecentProject},
          { label: iconLabel('SPACE', t('Save Project')), onclick: appCtrl.saveProject },
          { label: iconLabel('SPACE', t('Save Project As')), onclick: appCtrl.saveProjectAs },
        ]
      },
      {label: iconLabel('PROJECT',t('Project')), onclick: showProject},
      {label: iconLabel('IMAGELIST',t('Images')), onclick: showImages},
      {label: iconLabel('GALLERY',t('Make')), onclick: showGallery},
      {label: iconLabel('ADDPICT',t('Add Images')), onclick: appCtrl.addImageFiles},
      // {label: iconLabel('OPTIONS',t('Options')), onclick: appCtrl.addImageFiles},
      {label: iconLabel('OPTIONS',t('Options')),
        items: [
          {
            label: appCtrl.session.compactMode ? iconLabel('CHECK',t('compactMode')) : iconLabel('SPACE',t('compactMode')), 
            // active: appCtrl.session.compactMode,
            onclick: ()=>{appCtrl.session.compactMode = !appCtrl.session.compactMode; appCtrl.changed()}
          },
          {
            label: getDarkTheme() ? iconLabel('CHECK',t('darkTheme')) : iconLabel('SPACE',t('darkTheme')), 
            // active: getDarkTheme(),
            onclick: ()=>{
              setDarkTheme(!getDarkTheme())
              appCtrl.changed()
            }
          },
          {
            label: iconLabel('SPACE',t('language')),
            onclick: ()=>{
              i18n.setLanguage( i18n.language === 'en' ? 'de' : 'en' )
              appCtrl.session.language = i18n.language
              appCtrl.changed()
            }
          }
        ]
      }
    ]
  }
}


