import { config } from 'dotenv';
import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  mergeRanges,
} from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const start = new Date().getTime();

const workflows = {};
const ratings = [];

const lines = getDataLines(day, false);

// parse condition
while (lines[0] !== '') {
  const line = lines.shift();
  const [, name, strrules] = line.match(/^(\w+)\{(.+)\}$/);
  const rules = strrules.split(',').map((r) => {
    if (r.includes(':')) {
      const [c, g] = r.split(':');
      const [, a, t, b] = c.match(/(\w+)([\<\>]+)(\w+)/);
      return { condition: [a, t, +b], go: g };
    } else {
      return { go: r };
    }
  });
  workflows[name] = rules;
}

const isInRange = ([a, b], x) => x >= a && x < b;
const splitRange = ([a, b], x) => [
  [a, x],
  [x, b],
];

const triage = (input) => {
  const accepted = [];
  while (input.length > 0) {
    let { step, range } = input.shift();
    for (const { condition, go } of workflows[step]) {
      if (condition) {
        const [a, t, b] = condition;
        if (isInRange(range[a], b)) {
          let [one, two] = [[], []];
          if (t === '>') {
            // send two to go
            // one continue
            [one, two] = splitRange(range[a], b + 1);
          } else if (t === '<') {
            // send one to go
            // two conitnue
            [two, one] = splitRange(range[a], b);
          }
          range = structuredClone(range);
          range[a] = one;
          const newr = structuredClone(range);
          newr[a] = two;
          if (go === 'A') {
            accepted.push(newr);
          } else if (go !== 'R') {
            input.push({ step: go, range: newr });
          }
        }
      } else {
        // send range to go
        if (go === 'A') {
          accepted.push(range);
        } else if (go !== 'R') {
          input.push({ step: go, range });
        }
      }
    }
  }

  return accepted;
};

const max = 4001;
const input = { x: [1, max], m: [1, max], a: [1, max], s: [1, 4001] };

const result = triage([
  {
    step: 'in',
    range: input,
  },
]);

let answer = 0;
for (const range of result) {
  answer +=
    (range.x[1] - range.x[0]) *
    (range.m[1] - range.m[0]) *
    (range.a[1] - range.a[0]) *
    (range.s[1] - range.s[0]);
}

consola.warn('Result:', answer);
consola.warn('Ok', answer === 124615747767410);

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 2, answer: answer });

consola.success('Done.');
