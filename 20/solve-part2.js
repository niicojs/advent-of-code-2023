import { config } from 'dotenv';
import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  lcm,
} from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const start = new Date().getTime();

const lines = getDataLines(day)
  .map((l) => l.split(' -> '))
  .map(([mod, out]) => [
    mod[0] === 'b' ? mod : mod.slice(1),
    { type: mod[0], to: out.split(', ') },
  ]);

const modules = Object.fromEntries(lines);

// init memory
for (const name in modules) {
  if (modules[name].type === '%') {
    modules[name].on = false;
  }
  for (const to of modules[name].to) {
    if (modules[to]?.type === '&') {
      modules[to].memory = modules[to].memory || {};
      modules[to].memory[name] = 'low';
    }
  }
}

// find path to rx
const from = new Map();
for (const name in modules) {
  for (const to of modules[name].to) {
    from[to] = [...(from[to] || []), name];
  }
}

consola.log('before rx', from['rx']);
consola.log('before the inv', from[from['rx']]);

const watch = from['rx'][0];
const high = {};

const pulse = (idx) => {
  const todo = [['broadcaster', 'low']];
  while (todo.length > 0) {
    const [name, freq, from] = todo.shift();
    const mod = modules[name];
    // consola.log(from, freq, name, '->', mod?.to);
    if (mod) {
      if (mod.type === 'b') {
        mod.to.forEach((n) => todo.push([n, freq, name]));
      } else if (mod.type === '%') {
        if (freq === 'low') {
          mod.to.forEach((n) => todo.push([n, mod.on ? 'low' : 'high', name]));
          mod.on = !mod.on;
        }
      } else if (mod.type === '&') {
        mod.memory[from] = freq;
        const hasLow = Object.values(mod.memory).some((v) => v === 'low');
        mod.to.forEach((n) => todo.push([n, hasLow ? 'high' : 'low', name]));
        if (name === watch && hasLow) {
          for (const i in mod.memory) {
            if (mod.memory[i] === 'high') {
              high[i] = idx;
            }
          }
          if (Object.keys(mod.memory).length === Object.keys(high).length) {
            // we have all that we need
            return true;
          }
        }
      }
    }
  }
  return false;
};

let idx = 1;
while (!pulse(idx++)) {}

const answer = lcm(Object.values(high));

consola.warn('Result:', answer);

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 2, answer: answer.low * answer.high });

consola.success('Done.');
