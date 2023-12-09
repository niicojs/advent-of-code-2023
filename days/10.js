import { config } from 'dotenv';
import { consola } from 'consola';
import { submit } from '../aoc.js';
import { getCurrentDay, getDataLines } from '../utils.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
consola.log(lines);

consola.warn('part 1', 'now yet');

// await submit({ day, level: 1, answer: '' });

consola.success('Done.');
