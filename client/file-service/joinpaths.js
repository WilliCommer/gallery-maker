/* @module joinpaths */

/**
 * Like node path.join(). Change backslashes to slash. Resolves '.' and '..'. Returns '' for empty path (not '.') 
 * 
 * @param {string} paths - list of file path segments
 * @returns {string}
 * 
 */
export default function joinPaths(...paths) {
  // join all parts using '/' and replace backslashes directly with '/'
  const raw = paths
    .filter(p => typeof p === 'string' && p.length > 0)
    .join('/')
    .replace(/\\/g, '/');

  if (!raw) return '';

  const isAbsolute = raw.startsWith('/');
  const hasTrailingSlash = raw.endsWith('/') && raw.length > 1;
  const parts = raw.split('/');
  const stack = [];

  // Normalize path segments (ignore '.', resolve '..')
  for (const part of parts) {
    if (!part || part === '.') continue;
    
    if (part === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop();
      } else if (!isAbsolute) {
        stack.push('..');
      }
    } else {
      stack.push(part);
    }
  }

  // assemble the result
  let result = (isAbsolute ? '/' : '') + stack.join('/');
  
  if (hasTrailingSlash && result !== '/') {
    result += '/';
  }

  return result === '.' ? '' : result;
}

/*
assert.equal( joinPaths(), '');
assert.equal( joinPaths('/'), '/');
assert.equal( joinPaths('/','/'), '/');
assert.equal( joinPaths('/','/','/','/'), '/');
assert.equal( joinPaths('a', '/b', 'c/'), 'a/b/c/');
assert.equal( joinPaths('/a', '/b/', 'c'), '/a/b/c');
assert.equal( joinPaths('\\a', '\\b\\', 'c'), '/a/b/c');
assert.equal( joinPaths('ordner\\unterordner', 'datei.txt'), 'ordner/unterordner/datei.txt')
assert.equal( joinPaths('/basis\\pfad/', '..\\ziel/'), '/basis/ziel/')
assert.equal( joinPaths('a', 'b', '..', '..'), '') // (statt '.')
assert.equal( joinPaths('', '.', '\\'),'/') //5 (behält den Root-Slash, wenn einer übergeben wurde)
assert.equal( joinPaths('', '.'), '')
*/
