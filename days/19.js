import { config } from 'dotenv';
import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const start = new Date().getTime();

const lines = getDataLines(day);
consola.log(lines);

consola.warn('result', 'now yet');

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 1, answer: '' });

consola.success('Done.');
