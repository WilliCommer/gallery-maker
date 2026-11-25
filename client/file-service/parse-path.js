/* @module parse-path */

/**
 * Function like Node's path.parse but with extra property 'path' in result, the 'dir' without 'root' part.
 * 
 * returns `{root, dir, path, base, name, ext}`
 *
 * @param {string} pathString - file path. Windows or Unix
 * @returns {object}
 * 
 * @example
 * | pathString        | root | dir      | path     | base       | name   | ext    |
 * | ---               | ---  | ---      | ---      | ---        | ---    | ---    |
 * | 'c:\dir\file.ext' | 'c:' | 'c:/dir' | '/dir'   | 'file.ext' | 'file' | '.ext' |
 * | 'c:/dir/file.ext' | 'c:' | 'c:/dir' | '/dir'   | 'file.ext' | 'file' | '.ext' |
 * | '/dir/file.ext'   | ''   | '/dir'   | '/dir'   | 'file.ext' | 'file' | '.ext' |
 * | 'dir/file.ext'    | ''   | 'dir'    | 'dir'    | 'file.ext' | 'file' | '.ext' |
 */
function parsePath(pathString) {
    // 1. Alle Backslashes vereinheitlichen
    const normalized = pathString.replace(/\\/g, '/');
    
    // 2. Root/Laufwerk bestimmen (inklusive des folgenden Slashes)
    let root = '';
    const driveMatch = normalized.match(/^([a-zA-Z]:)/);
    
    if (driveMatch) {
        // Wenn ein Laufwerksbuchstabe da ist, gehört der Slash zum Root (z.B. "c:/")
        // Falls kein Slash folgt (z.B. "c:file.ext"), bleibt es bei "c:"
        root = normalized[2] === '/' ? driveMatch[1] + '/' : driveMatch[1];
    } else if (normalized.startsWith('/')) {
        root = '/';
    }
    
    // 3. Verzeichnis (dir) und Basis-Dateiname (base) trennen
    const lastSlashIndex = normalized.lastIndexOf('/');
    let dir = '';
    let base = normalized;
    
    if (lastSlashIndex !== -1) {
        base = normalized.slice(lastSlashIndex + 1);
        dir = normalized.slice(0, lastSlashIndex);
        
        // Sonderfälle für Dateien direkt im Root korrigieren
        if (dir === '/' || dir === driveMatch?.[1]) {
            dir = root;
        }
    } else if (driveMatch && root === driveMatch[1]) {
        // Sonderfall ohne Slashes: "c:file.ext"
        dir = root;
    }
    
    // 4. Relativen Pfad ("path") zur Dateisystem-Wurzel berechnen
    let path = '';
    if (dir && dir !== root) {
        path = dir.slice(root.length);
        // Führende Slashes entfernen, falls vorhanden
        if (path.startsWith('/')) {
            path = path.slice(1);
        }
    }
    
    // 5. Dateiname (name) und Endung (ext) trennen
    const lastDotIndex = base.lastIndexOf('.');
    let name = base;
    let ext = '';
     
    if (lastDotIndex > 0) {
        name = base.slice(0, lastDotIndex);
        ext = base.slice(lastDotIndex);
    }
    
    return { root, dir, path, base, name, ext };
}


export default parsePath
