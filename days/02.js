import { consola } from 'consola';
import { getDataLines } from '../utils.js';

const day = '01';

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
consola.log(lines);


consola.warn('result', 'not yet');

consola.success('Done.');
