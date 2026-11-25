import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import './icons.js';
import { van, Navbar } from 'vanjs-bootstrap';
import appCtrl from './app-ctrl.js';
import fd from './file-service.js'
import connectHeartbeat from './heartbeat-client.js';
import i18n from './i18n.js';
import appPage from './app.js';

const appId = 'main';       // html id

// check language and init translation
var userLang = navigator.language || navigator.userLanguage;
if (typeof userLang !== 'string') userLang = 'en'; else userLang = userLang.slice(0, 2).toLowerCase();
const forbiddenText = userLang === 'de' 
  ? 'Die App ist in einem anderen Tab geöffnet'
  : 'The app is open in another tab'

// start hart beat connection
connectHeartbeat({ forbiddenText, appId })
fd.setURL('/api');	// same as backend

van.add(document.getElementById(appId), appPage);
appCtrl.debugLog()
appCtrl.init();
