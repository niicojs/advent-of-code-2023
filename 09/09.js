import { config } from 'dotenv';
import { consola } from 'consola';
import { submit } from '../aoc.js';
import { getCurrentDay, getDataLines, sum } from '../utils.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day).map((l) => l.match(/-?\d+/g).map((d) => +d));

let result1 = 0;
let result2 = 0;
for (const seq of lines) {
  let input = seq;
  let lasts = [];
  let first = [];
  while (input.some((n) => n !== 0)) {
    lasts.push(input.at(-1));
    first.push(input.at(0));
    const diff = [];
    for (let i = 1; i < input.length; i++) {
      diff.push(input[i] - input[i - 1]);
    }
    input = diff;
  }

  // part 1
  {
    const res = [0];
    lasts = lasts.reverse();
    for (let x = 0; x < lasts.length; x++) {
      res.push(lasts[x] + res[x]);
    }

    result1 += res.at(-1);
  }

  // part 2
  {
    const res = [0];
    first = first.reverse();
    for (let x = 0; x < first.length; x++) {
      res.push(first[x] - res[x]);
    }

    result2 += res.at(-1);
  }
}

consola.warn('part 1', result1);
consola.warn('part 2', result2);

// await submit({ day, level: 1, answer: result1 });
// await submit({ day, level: 2, answer: result2 });

consola.success('Done.');
