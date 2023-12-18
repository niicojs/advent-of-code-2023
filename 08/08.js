import { config } from 'dotenv';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);

const rl = lines[0];
const rules = lines
  .slice(1)
  .map((l) => l.match(/(\w+) \= \((\w+), (\w+)\)/))
  .map((arr) => ({ input: arr[1], L: arr[2], R: arr[3] }));

const rulesmap = {};
for (const rule of rules) {
  rulesmap[rule.input] = { L: rule.L, R: rule.R };
}

// part 1
{
  let step = 0;
  let current = 'AAA';
  let idx = 0;
  while (current !== 'ZZZ') {
    const instr = rules.find((r) => r.input === current);
    current = instr[rl[idx]];
    idx = (idx + 1) % rl.length;
    step++;
  }

  consola.warn('part 1', step);
}

// part 2
{
  const answer = (input) => {
    let step = 0;
    let idx = 0;
    let c = input;

    while (!c.endsWith('Z')) {
      c = rulesmap[c][rl[idx]];
      idx = (idx + 1) % rl.length;
      step++;
    }

    return step;
  };

  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  const lcm = (arr) => {
    return arr.reduce((a, b) => _lcm(a, b));
  };

  let current = rules.filter((r) => r.input.endsWith('A')).map((r) => r.input);
  let first = current.map((c) => answer(c));

  consola.warn('part 2', lcm(first));
}

consola.success('Done.');
