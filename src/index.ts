import { readFile, writeFile } from 'fs/promises';
import * as core from '@actions/core';
import * as io from '@actions/io';
import { compile } from 'tempura';
import path from 'path';

async function run() {
  try {
    const input = path.resolve('template/index.hbs');
    core.debug('input path' + input)
 
    io.mkdirP(path.resolve('docs'));
    core.debug('mkdir file ' + path.resolve('docs'));

    const output = path.resolve('docs', 'index.html');
    core.debug('output path' + output);

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

    core.setOutput('output', output);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
