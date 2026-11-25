export default function connectHeartbeat(options) {

    const {
        debug = true,
        forbiddenText = 'Die App ist in einem anderen Tab geöffnet',
        forbiddenClass = 'text-bg-danger p-3 fs-1',
        appId = 'main'
    } = options || {}

    const log = debug ? console.log : ()=>{};
    log('connectHeartbeat')
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const socket = new WebSocket(protocol + window.location.host + '/ws-heartbeat');

    socket.onmessage = (event) => {
        if (event.data === 'reload') {
            log('heartbeat got reload')
            window.location.reload();
            return;
        }
        if (event.data === 'forbidden') {
            log('server send forbidden');
            const el = document.createElement('div');
            el.textContent = forbiddenText;
            el.className = forbiddenClass;
            document.body.appendChild(el);
            document.getElementById(appId).remove();
            socket.onclose = null;
            socket.close();
            return;
        }
    };

    // Falls der Server mal neustartet, verbindet sich der Browser automatisch neu
    socket.onclose = () => {
        setTimeout(()=>connectHeartbeat(options), 1000);
    };
}

// Starten, sobald die Seite geladen ist
// connectHeartbeat();