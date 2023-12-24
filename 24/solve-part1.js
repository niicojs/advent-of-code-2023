import { config } from 'dotenv';
import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
} from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day).map((l) =>
  l.split(' @ ').map((p) => p.split(', ').map((n) => +n))
);

const pente = ([, [dx1, dy1]]) => dy1 / dx1;

const intersect = (d1, d2) => {
  // x = x1 + dx1 * t
  // y = y1 + dy1 * t
  // t = (x - x1) / dx1
  // (y - y1) = dy1 * (x - x1) / dx1
  // y = dy1 / dx1 * x - dy1 * x1 / dx1 + y1

  // p1 * x - dy1 * x1 / dx1 + y1 = p2 * x - dy2 * x2 / dx2 + y2
  // (p1 - p2) * x = dy1 * x1 / dx1 - dy2 * x2 / dx2 + (y2 - y1)

  const p1 = pente(d1);
  const p2 = pente(d2);
  const [[x1, y1], [dx1, dy1]] = d1;
  const [[x2, y2], [dx2, dy2]] = d2;

  if (p1 === p2) {
    return null;
  } else {
    const x = ((dy1 * x1) / dx1 - (dy2 * x2) / dx2 + (y2 - y1)) / (p1 - p2);
    const y = (dy1 / dx1) * x - (dy1 * x1) / dx1 + y1;
    const t1 = (x - x1) / dx1;
    const t2 = (x - x2) / dx2;

    return t1 >= 0 && t2 >= 0 ? [x, y] : null;
  }
};

let answer = 0;
// const [min, max] = [7, 27];
const [min, max] = [200000000000000, 400000000000000];
for (let i = 0; i < lines.length; i++) {
  for (let j = i + 1; j < lines.length; j++) {
    const [d1, d2] = [lines[i], lines[j]];
    const cross = intersect(d1, d2);
    if (cross) {
      const [x, y] = cross;
      if (x >= min && x <= max && y >= min && y <= max) {
        answer++;
      }
    }
  }
}

consola.warn('Result:', answer);

consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// await submit({ day, level: 1, answer: answer });

consola.success('Done.');
