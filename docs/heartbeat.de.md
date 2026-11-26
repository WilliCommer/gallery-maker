## Heartbeat-Module

Der Heartbeat hält den lokalen Gallery-Maker-Server am Laufen, solange mindestens ein Browser-Tab verbunden ist. Dafür wird eine dauerhafte WebSocket-Verbindung verwendet; es werden keine regelmäßigen Ping-/Pong-Frames gesendet.

### Server: `server/heartbeat-ws.js`

#### `initHeartbeat({ server, maxClient = 1, debugLog = true })`

Initialisiert den Heartbeat auf einem vorhandenen Node.js-HTTP-Server:

- Erstellt einen WebSocket-Server von `ws` im `noServer`-Modus und verarbeitet HTTP-Upgrade-Anfragen, deren URL exakt `/ws-heartbeat` ist.
- Protokolliert Verbindungen und deren Ende, wenn `debugLog` aktiviert ist.
- Erlaubt standardmäßig einen Client. Überschreitet die Anzahl verbundener Clients `maxClient`, sendet der Server der zusätzlichen Verbindung die Nachricht `forbidden`. Der Client ist dafür zuständig, diese Verbindung zu schließen.
- Wenn sich der letzte Client trennt, wird das Beenden des Servers für zwei Sekunden später angesetzt. Verbindet sich währenddessen ein Client erneut, wird das geplante Beenden abgebrochen.
- Wird der Abschalt-Timer erst mehr als vier Sekunden nach seiner Planung ausgeführt (zum Beispiel, weil der Computer im Ruhezustand war), nimmt das Modul eine Rückkehr aus dem Ruhezustand an und wartet weitere zehn Sekunden auf eine erneute Browserverbindung. Kehrt kein Client zurück, wird der Prozess mit Exit-Code `0` beendet.
- Bei `NODE_ENV=development` wird das Verzeichnis `public` rekursiv überwacht. Änderungen werden eine Sekunde lang zusammengefasst, bevor eine Reload-Nachricht an verbundene Clients gesendet wird.

Die Anwendung initialisiert das Modul, nachdem der HTTP-Server auf Anfragen lauscht. Der übergebene Server muss das Ereignis `upgrade` unterstützen.

#### `sendBrowserReload()`

Sendet die Nachricht `reload` an alle verbundenen WebSocket-Clients, deren Verbindung gerade geöffnet ist. Wurde der Heartbeat noch nicht initialisiert, hat die Funktion keine Wirkung. Im Entwicklungsmodus wird sie nach einer Änderung im überwachten `public`-Verzeichnis aufgerufen.

### Client: `client/heartbeat-client.js`

#### `connectHeartbeat(options)`

Öffnet eine WebSocket-Verbindung zum Host der aktuellen Seite unter `/ws-heartbeat`. Bei HTTP-Seiten wird `ws://`, bei HTTPS-Seiten `wss://` verwendet.

Alle Optionen sind optional:

| Option | Standardwert | Zweck |
| --- | --- | --- |
| `debug` | `true` | Aktiviert die Ausgabe von Meldungen in der Browser-Konsole. |
| `forbiddenText` | `Die App ist in einem anderen Tab geöffnet` | Text, der angezeigt wird, wenn der Server einen zusätzlichen Tab ablehnt. |
| `forbiddenClass` | `text-bg-danger p-3 fs-1` | CSS-Klassen für die Ablehnungsmeldung. |
| `appId` | `main` | ID des App-Elements, das bei einer Ablehnung entfernt wird. |

Bei Empfang von `reload` lädt der Client die Seite neu. Bei `forbidden` fügt er die konfigurierte Meldung in das Dokument ein, entfernt das App-Element und schließt den Socket, ohne eine erneute Verbindung zu versuchen. Bei jedem anderen Schließen der Verbindung versucht er nach einer Sekunde mit denselben Optionen, die Verbindung wiederherzustellen.

Die Anwendung importiert `connectHeartbeat` und ruft die Funktion beim Start des Clients auf. Server und Client müssen denselben WebSocket-Pfad und dieselben Nachrichten verwenden.
