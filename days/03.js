import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
consola.log(lines);

consola.warn('part 1', 'now yet');

consola.success('Done.');
