import { config } from 'dotenv';
import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
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

// parse ratings
for (const line of lines.slice(1)) {
  ratings.push(
    Object.fromEntries(
      line
        .slice(1, -1)
        .split(',')
        .map((l) => l.split('='))
        .map(([a, b]) => [a, +b])
    )
  );
}

const test = (rating, workflow) => {
  let match = true;
  for (const [a, t, b] of workflow.rules) {
    if (t === '<') {
      if (rating[a] >= b) {
        match = false;
      }
    } else if (t === '>') {
      if (rating[a] >= b) {
        match = false;
      }
    } else {
      ''.toString();
    }
  }
  return match;
};

const triage = (rating) => {
  consola.log('triage', rating);
  let name = 'in';
  while (true) {
    if (name === 'A') return true;
    if (name === 'R') return false;
    consola.log(name);
    const w = workflows[name];
    for (const { condition, go } of w) {
      if (condition) {
        const [a, t, b] = condition;
        if (t === '>') {
          if (rating[a] > b) {
            name = go;
            break;
          }
        } else if (t === '<') {
          if (rating[a] < b) {
            name = go;
            break;
          }
        } else {
          t.toString();
        }
      } else {
        name = go;
        break;
      }
    }
  }
};

let answer = 0;
for (const rating of ratings) {
  if (triage(rating)) {
    answer += rating['a'] + rating['x'] + rating['m'] + rating['s'];
  }
}

consola.warn('Result:', answer);

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

await submit({ day, level: 1, answer: answer });

consola.success('Done.');
