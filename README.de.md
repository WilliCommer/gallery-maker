# Gallery Maker

> Leichtgewichtig Bildergalerien erstellen

Gallery Maker ist ein einfaches Programm, mit dem sich Bildergalerien aus lokalen Dateien zusammenstellen und erzeugen lassen. Das Projekt setzt auf einen bewusst schlanken Ansatz: Statt eine vollständige Desktop-Laufzeit wie Electron mitzuliefern, startet Gallery Maker einen lokalen Node.js-Server und öffnet die Benutzeroberfläche im Browser. So bleibt die Anwendung eine Desktop-Anwendung für den lokalen Gebrauch, ohne einen eigenen Browser-Unterbau zu benötigen.

## Eine Desktop-App ohne Electron

Beim Start richtet Gallery Maker einen lokalen Webserver ein und öffnet die App automatisch im Standardbrowser. Die Oberfläche läuft damit in einem vertrauten Browser-Tab, während der Server im Hintergrund die Galerie-Funktionen und den Zugriff auf Dateien bereitstellt. Die Anwendung benötigt kein Electron-Paket und bringt keinen separaten Browser mit.

Ein WebSocket-Heartbeat verbindet den geöffneten Tab mit dem lokalen Server. Darüber erkennt der Server, wenn der Tab geschlossen wurde, und beendet sich nach einer kurzen Wartezeit. Diese Verzögerung erlaubt es, einen schnellen Seiten-Reload abzufangen, ohne den Server versehentlich herunterzufahren. Gleichzeitig ist die Anwendung auf einen aktiven Tab ausgelegt: Wird sie in einem weiteren Tab geöffnet, zeigt die Oberfläche einen Hinweis an und verhindert die parallele Nutzung dort.

## Lokale Dateien über den File-Service

Webseiten können aus Sicherheitsgründen nicht beliebig auf das Dateisystem des Computers zugreifen. Gallery Maker löst das über einen lokalen File-Service auf der Serverseite. Die Browseroberfläche kommuniziert mit diesem Service über die API des lokalen Servers. Damit kann die Anwendung Dateien und Verzeichnisse anzeigen, Bilder auswählen sowie Galerieprojekte lesen und speichern.

Der File-Service übernimmt so die Verbindung zwischen der browserbasierten Oberfläche und den lokalen Bildern. Die Galerie-Erstellung bleibt dabei auf den eigenen Rechner ausgerichtet: Die App arbeitet mit den ausgewählten Dateien und erzeugt daraus eine nutzbare Galerie.

## Schlanke Oberfläche mit VanJS

Für den Aufbau der Benutzeroberfläche verwendet Gallery Maker VanJS. Die kleine JavaScript-Bibliothek ermöglicht es, Oberflächenelemente direkt und reaktiv im DOM aufzubauen, ohne ein großes UI-Framework samt umfangreicher Laufzeit einzuführen. Das hält die Client-Seite übersichtlich und passt zum Ziel, die Anwendung leichtgewichtig zu halten. Für die Gestaltung und einzelne UI-Bausteine kommen ergänzend Bootstrap und vanjs-bootstrap zum Einsatz.

## Einfacher Entwicklungsstart

Auch die Entwicklung ist auf einen kurzen und komfortablen Ablauf ausgelegt. Mit `npm run dev` startet das Dev-Script den Server im Entwicklungsmodus und überwacht sowohl Server- als auch Client-Code. Änderungen am Client werden mit esbuild neu gebündelt; die Oberfläche kann anschließend automatisch neu geladen werden. Änderungen an überwachten Serverdateien starten den Server neu. Dadurch entfällt ein Großteil des manuellen Neubauens und Neustartens während der Arbeit.

Für den normalen Start genügt `npm start`: Der Server läuft lokal und öffnet die App im Browser. So können Entwicklung und alltägliche Verwendung denselben einfachen Startpunkt nutzen.

## Vom lokalen Bild zum Galerie-Ergebnis

Im Kern konzentriert sich Gallery Maker auf eine überschaubare Aufgabe: Bilder auswählen, ein Galerieprojekt organisieren und daraus eine Bildergalerie erzeugen. Die Bedienung erfolgt über die Browseroberfläche, die Projektdaten und Bilddateien bleiben über den lokalen File-Service zugänglich. Das Ergebnis lässt sich direkt in der App ansehen und bei Bedarf in einem weiteren Browser-Tab öffnen.

Gallery Maker verbindet damit die einfache Erreichbarkeit einer Weboberfläche mit dem lokalen Dateizugriff einer Desktop-Anwendung. Der Verzicht auf Electron, die kompakte VanJS-Oberfläche und die integrierte Entwicklungsumgebung halten den technischen Aufbau bewusst schlank, ohne den direkten Umgang mit den eigenen Bildern aufzugeben.
