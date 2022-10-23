import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';
import * as core from '@actions/core';
import * as io from '@actions/io';
import { compile } from 'tempura';
import path from 'path';

async function run() {
  try {

    const input = path.resolve('template/index.hbs');
    core.info('input path' + input)
    const outputDir = path.resolve(__dirname, 'docs');
    core.info('output dir' + outputDir);
    const output = path.resolve(__dirname, 'docs/index.html');
    core.info('output path' + output);
    const defaultDoc = path.resolve(__dirname, 'docs/readme.md');
    core.info('default doc' + defaultDoc);
    const fallbackDoc = path.resolve(__dirname, 'readme.md');
    core.info('fallback doc' + fallbackDoc);

    io.mkdirP(outputDir);

  

    if(!fs.existsSync(defaultDoc)){
      core.info('Please place your readme in your \'docs\' folder');
      if(fs.existsSync(fallbackDoc)){
        core.info('exist fallback');
        io.cp(fallbackDoc, defaultDoc)
      } else {
        core.info('Please place your readme in your project root');
      }
    }

    const template = await readFile(input, 'utf8');
    const render = compile(template);
    const html = await render({
      title: 'Reminders',
      items: [
        { id: 1, text: 'Feed the doggo' },
        { id: 2, text: 'Buy groceries' },
        { id: 3, text: 'Exercise, ok' },
      ]
    });

    writeFile(output, html, {encoding: 'utf-8'});
    core.info('html ' + html);
    
    core.setOutput('output', output);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
