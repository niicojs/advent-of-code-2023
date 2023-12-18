import { config } from 'dotenv';
import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  lacet,
} from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const start = new Date().getTime();

const lines = getDataLines(day)
  .map((l) => l.split(' '))
  .map(([a, b, c]) => [a, +b, c.slice(2, -1)]);

const dirmap = {
  3: [0, -1],
  1: [0, 1],
  2: [-1, 0],
  0: [1, 0],
};

const dig = () => {
  let path = [[0, 0]];
  let [x, y] = [0, 0];
  let cnt = 0;

  // dig
  for (const [, , color] of lines) {
    const nb = parseInt(color.slice(0, 5), 16);
    const dir = dirmap[color[5]];
    [x, y] = [x + nb * dir[0], y + nb * dir[1]];
    path.push([x, y]);
    cnt += nb;
  }

  return { path, cnt };
};

const { path, cnt } = dig();

const air = lacet(path);
const points = air - cnt / 2 + 1; // pick theorem

const result = points + cnt;

consola.warn('result', result);

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 2, answer: result });

consola.success('Done.');
