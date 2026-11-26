## File-Service

Der File-Service ermöglicht der browserbasierten Anwendung, Dateien über eine Express-API zu durchsuchen und zu verwalten. Der Client stellt außerdem wiederverwendbare Datei- und Verzeichnismodelle sowie Auswahl-Dialoge bereit.

### Server: `server/file-router.js`

#### Initialisierung und Dateisystem-Wurzel

Der Default-Export ist eine Router-Fabrik:

```js
fileRouter({ root, fileRoot, debug, log })
```

`fileRoot` hat Vorrang vor `root`. Die Anwendung übergibt `config.fileRoot` als `root`. Ist eine Wurzel konfiguriert, werden normalisierte Pfade außerhalb dieser Wurzel abgewiesen. Routen, die eine Prüfung des realen Pfads anfordern, lösen außerdem symbolische Links auf, bevor sie fortfahren. Mit `root: null` werden Pfade relativ zum gesamten Dateisystem des Prozesses statt zu einer konfigurierten Wurzel aufgelöst. Dieser Modus ist im Quellcode als experimentell gekennzeichnet.

Verzeichniseinträge, deren Namen mit `.` beginnen, werden ausgelassen. Jeder zurückgegebene Eintrag enthält Name, Verzeichniskennzeichen, Größe und Änderungszeit. Dateisystemfehler der meisten Routen werden an die Express-Fehlerbehandlung weitergegeben; `/exists` antwortet mit `false`, wenn der Pfad nicht aufgelöst oder untersucht werden kann.

#### HTTP-API

Die folgenden Pfade gelten relativ zum Mount-Punkt des Routers (in dieser Anwendung `/api`). `POST`-Anfragen verwenden JSON im Request-Body.

| Route | Anfrage | Ergebnis |
| --- | --- | --- |
| `GET /dir` | — | Listet das Wurzelverzeichnis auf. |
| `GET /dir/*path` | Pfad als URL-Segmente | Listet das angegebene Verzeichnis auf. |
| `POST /files` | `{ "path": "ordner/unterordner" }` oder ein Array aus Pfadsegmenten | Listet ein Verzeichnis auf. |
| `POST /exists` | `{ "path": "ordner/datei" }` oder `{ "filename": "ordner/datei" }` | Dateimetadaten (`path`, `name`, `isDir`, `size`, `time`) oder `false`. |
| `POST /mkdir` | `{ "path": "ordner/neuer-ordner" }` oder ein `filename`-Feld | Erstellt das Verzeichnis einschließlich fehlender Elternverzeichnisse; antwortet mit `true`. |
| `POST /trash` | `{ "path": "ordner/datei" }` / `{ "filename": "ordner/datei" }` oder `{ "directory": "ordner", "files": ["a", "b"] }` | Verschiebt das Ziel in den Papierkorb des Betriebssystems; antwortet mit `true`. |
| `POST /open` | `{ "filename": "ordner/datei" }`, optional mit `"args": [...]` | Öffnet einen Pfad mit der Standardanwendung oder startet die angegebene Anwendung mit Argumenten; antwortet mit `true`. |
| `POST /readtextfile` | `{ "path": "ordner/datei" }` oder ein `filename`-Feld | Gibt den Dateiinhalt als `text/plain` zurück. |
| `POST /write` | `{ "path": "ordner/datei", "content": "..." }` oder ein `filename`-Feld | Schreibt den Inhalt und antwortet mit `true`. |

Antworten zum Auflisten eines Verzeichnisses haben folgende Struktur:

```json
{
  "dir": "ordner/unterordner",
  "path": ["ordner", "unterordner"],
  "resolvedDir": "/absoluter/pfad/zu/ordner/unterordner",
  "files": [
    { "name": "foto.jpg", "isDir": false, "size": 1234, "time": "..." }
  ]
}
```

Zusätzlich stellt die Anwendung Dateien unter `/api/get` als statische Inhalte aus `config.staticGet` bereit. Dieser Pfad ist von den Router-Endpunkten getrennt und wird vom Client für Dateivorschauen verwendet.

### Client: `client/file-service/`

`client/file-service.js` exportiert das Default-Objekt aus `client/file-service/index.js` erneut. Dieses Objekt fasst API-Funktionen, Dateiwerkzeuge, Dialoge, Übersetzungen und Pfadhelfer zusammen. Die Anwendung setzt die API-Basis-URL beim Start auf `/api`; der Standardwert im API-Modul ist `/app/file`.

#### API-Funktionen

Die Funktionen in `file-service-api.js` senden Anfragen an die konfigurierte API-Basis:

- `setURL(url)` ändert die Basis-URL.
- `getURL(filename)` erstellt eine Browser-URL für eine Datei unter dem statischen `/get`-Pfad, insbesondere für Bilder und Vorschauen.
- `getDir(path = '')`, `mkDir(path, newDir)`, `exists(filename)`, `readTextFile(filename)`, `writeFile(filename, content)`, `trashFile(filename)`, `trash(directory, files)` und `open(filename, args)` rufen die entsprechenden Serverfunktionen auf.
- `getFileSystemPath(path)` löst einen Pfad über `exists` auf und gibt, falls verfügbar, den aufgelösten Pfad zurück.
- `normalizeFilename(filename)` gibt den aufgelösten Pfad zurück, sofern verfügbar, andernfalls eine normalisierte Form der Eingabe.

API-Hilfsfunktionen schreiben Request-Fehler in die Browser-Konsole. Die JSON-Hilfsfunktion und `readTextFile` geben bei einem fehlgeschlagenen Request `undefined` zurück.

#### Datei- und Verzeichnismodelle

`file-tools.js` exportiert:

- `FileItem` repräsentiert einen Eintrag und stellt übergeordnetes Verzeichnis, Dateiendung, relativen `pathName` und absoluten `filePath` bereit.
- `Directory` speichert den aktuellen Pfad und die Einträge. `getDir(path)` lädt Einträge über die API, wendet optionale Filter- und Sortierfunktionen an und gibt zurück, ob das Laden erfolgreich war. Standardmäßig stehen Verzeichnisse vor Dateien; anschließend wird nach Namen sortiert.
- `isValidFilename(name)` und `isValidDirectoryName(name)` prüfen übliche Einschränkungen, darunter unzulässige Zeichen, abschließende Punkte/Leerzeichen und reservierte Windows-Gerätenamen.
- `fileExtension`, `FileIcon`, `MIME_GROUPS` und `fileIsMime` dienen der Ermittlung von Dateiendungen, Datei-Icons und Dateitypfiltern.

#### Dialoge und UI-Hilfen

`file-dialog.js` stellt mit `SelectController` Navigation, Auswahlstatus und Auswahlereignisse bereit. Außerdem enthält es wiederverwendbare Schaltflächen und Dialogkomponenten sowie höherstufige Auswahl-Dialoge:

- `selectImageFilesDlg({ dir, header, multiple = true })` wählt Bilddateien aus und kann Vorschauen anzeigen.
- `selectFileDialog({ dir, header, mime, filter, multiple = false, event })` wählt Dateien aus, optional gefiltert nach MIME-Gruppe oder eigener Filterfunktion.
- `selectSingleFileDialog({ dir, fileName, header, mime, filter })` wählt eine einzelne Datei aus und gibt deren Pfad zurück.
- `selectDirectoryDlg({ dir, header, event })` öffnet einen Dialog zur Verzeichnisauswahl.
- `selectFolderDialog({ dir, header, event })` wählt den aktuellen oder einen ausgewählten Ordner aus und gibt dessen Pfad zurück.

Die Mehrfachauswahl liefert ein `Directory`-Modell mit den ausgewählten `FileItem`-Einträgen. Die Dialoge unterstützen außerdem das Erstellen von Verzeichnissen, das Verschieben ausgewählter Einträge in den Papierkorb und – sofern die entsprechende Schaltfläche angezeigt wird – das Öffnen des aktuellen Ortes im Dateibrowser des Betriebssystems.

Die übrigen Module stellen das Custom Element `<flexible-select>`, englische/deutsche UI-Texte, Pfadnormalisierung (`joinPaths`), plattformübergreifendes Parsen von Pfaden (`parsePath`), Sortierfunktionen und einen einfachen Event-Emitter bereit.
