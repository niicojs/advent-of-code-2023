import { config } from 'dotenv';
import { consola } from 'consola';
import {
  enumerate,
  getCurrentDay,
  getDataLines,
  memoize,
  sum,
} from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day)
  .map((line) => line.split(' '))
  .map(([one, two]) => [one, two.split(',').map((n) => +n)]);

const getCombinations = memoize((str, rules) => {
  if (str.length === 0) {
    return rules.length === 0 || (rules.length === 1 && rules[0] === 0) ? 1 : 0;
  }

  const first = str.at(0);
  const rest = str.slice(1);
  if (first === '.') {
    const newrules = rules[0] === 0 ? rules.slice(1) : rules;
    return getCombinations(rest, newrules);
  } else if (first === '#') {
    if (rules[0] > 0 && sum(rules) - 1 <= rest.length) {
      if (!str.slice(0, rules[0]).includes('.')) {
        return getCombinations(str.slice(rules[0]), [0, ...rules.slice(1)]);
      }
    }
    return 0;
  } else if (first === '?') {
    return (
      getCombinations('.' + rest, rules) + getCombinations('#' + rest, rules)
    );
  }
});

const repeat = 5;

let count = 0;
for (let [i, [blocks, rules]] of enumerate(lines)) {
  blocks = (blocks + '?').repeat(repeat).slice(0, -1);
  rules = Array(repeat).fill(rules).flat();

  count += getCombinations(blocks, rules);
}

consola.warn('result', count);

// await submit({ day, level: 1, answer: count });
// await submit({ day, level: 2, answer: count });

consola.success('Done.');
