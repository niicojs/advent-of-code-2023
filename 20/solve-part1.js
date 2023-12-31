import { config } from 'dotenv';
import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
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

const pulse = () => {
  let cnt = { low: 0, high: 0 };
  const todo = [['broadcaster', 'low']];
  while (todo.length > 0) {
    const [name, freq, from] = todo.shift();
    cnt[freq]++;
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
      }
    }
  }
  return cnt;
};

let answer = { low: 0, high: 0 };
for (let i = 0; i < 1000; i++) {
  const { low, high } = pulse();
  answer.low += low;
  answer.high += high;
}

consola.warn('Result:', answer.low * answer.high);

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 1, answer: answer.low * answer.high });

consola.success('Done.');
