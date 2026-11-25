import nodemon from 'nodemon';
import * as esbuild from 'esbuild';
import path from 'node:path';

const root        = process.cwd();
const startScript = path.join(root, 'index.js');
const clientDir   = path.join(root, 'client');
const publicDir   = path.join(root, 'public');
const outDir      = path.join(root, 'public/assets');


/*
  start nodemon
*/

nodemon({
  script: startScript,
  ignore: [clientDir, publicDir],
  ext: 'js md'
});

nodemon.on('start', function () {
  console.log('App has started');
}).on('quit', function () {
  console.log('App has quit');
  process.exit();
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});


/*
  start esbuild
*/


const watchLoggerPlugin = {
  name: 'watch-logger',
  setup(build) {
    build.onEnd((result) => {
      console.log(`Build beendet mit ${result.errors.length} Fehlern und ${result.warnings.length} Warnungen.`);
      if (result.errors.length > 0) {
        console.error('Details:', result.errors);
      }
    });
  },
};


let ctx = await esbuild.context({
  entryPoints: [clientDir],
  bundle: true,
  outdir: outDir,
  sourcemap: true,
  format: 'esm',
  logLevel: 'debug',
  plugins: [
    // watchLoggerPlugin
  ],
  preserveSymlinks: false,

  // Zwingt esbuild, immer die exakt selben ESM-Dateien zu nutzen:
  // alias: {
  //   // Zwingt Bootstrap immer auf das Hauptprojekt
  //   'bootstrap': path.resolve('./node_modules/bootstrap'),
  //   // Fängt alle Sub-Pfade (wie /i18n, /drag-sort) ab und leitet sie sauber weiter
  //   'vanjs-bootstrap/*': path.resolve('./node_modules/vanjs-bootstrap/dist')+'/*',
  // },

})

await ctx.watch()
console.log('esbuild watching...')

