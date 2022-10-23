import { readFile, writeFile } from 'fs/promises';
import * as core from '@actions/core';
import * as io from '@actions/io';
import { compile } from 'tempura';
import path from 'path';
import fs from 'fs';

async function run() {
  try {

    const input = path.resolve('template/index.hbs');
    core.info('input path' + input)
    const output = 'docs/index.html';
    core.info('output path' + output);
    const defaultDoc1 = fs.existsSync('docs/readme.md');
    const defaultDoc2 = fs.existsSync('docs/README.md');
    core.info('default doc' + defaultDoc1 + defaultDoc2);
    const fallbackDoc1 = fs.existsSync('readme.md');
    const fallbackDoc2 = fs.existsSync('README.md');
    core.info('fallback doc' + fallbackDoc1 + fallbackDoc2);

    await io.mkdirP('docs');


    if(!defaultDoc1 && !defaultDoc2){
      core.info('Please place your readme in your \'docs\' folder');
      if(fallbackDoc1){
        core.info('exist fallback1');
        io.cp('readme.md', 'docs/readme.md')
      } else if (fallbackDoc2) {
        core.info('exist fallback2');
        io.cp('README.md', 'docs/readme.md')
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
