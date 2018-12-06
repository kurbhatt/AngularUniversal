const domino = require('domino');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname, '.', 'dist/browser', 'index.html')).toString();
const win = domino.createWindow(template);
const files = fs.readdirSync(`${process.cwd()}/dist/server`);
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { enableProdMode } from '@angular/core';

import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';
import { ROUTES } from './static.paths';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const mainFiles = files.filter((file) => file.startsWith('main'));
const hash = mainFiles[0].split('.')[1];
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist/server/main.${hash}`);
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
// Load zone.js for the server.

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express Engine

const BROWSER_FOLDER = join(process.cwd(), 'static');

// Load the index.html file containing referances to your application bundle.
const index = readFileSync(join('dist/browser', 'index.html'), 'utf8');

let previousRender = Promise.resolve();

// Iterate each route path
ROUTES.forEach((route) => {
  const fullPath = join(BROWSER_FOLDER, route);

  // Make sure the directory structure is there
  if (!existsSync(fullPath)) {
    let syncpath = BROWSER_FOLDER;
    route.split('/').forEach((element) => {
      syncpath = syncpath + '/' + element;
      mkdirSync(syncpath);
    });
  }

  // Writes rendered HTML to index.html, replacing the file if it already exists.
  previousRender = previousRender
    .then((_) =>
      renderModuleFactory(AppServerModuleNgFactory, {
        document: index,
        url: route,
        extraProviders: [
          provideModuleMap(LAZY_MODULE_MAP),
          {
            provide: REQUEST,
            useValue: null,
          },
          {
            provide: RESPONSE,
            useValue: null,
          },
          {
            provide: 'ORIGIN_URL',
            useValue: 'http://localhost:4000',
          },
        ],
      }),
    )
    .then((html) => writeFileSync(join(fullPath, 'index.html'), html));
});
