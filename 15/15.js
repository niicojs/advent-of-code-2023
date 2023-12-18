import { config } from 'dotenv';
import { consola } from 'consola';
import { enumerate, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
const input = lines[0].split(',');

const hash = (str) => {
  return str.split('').reduce((p, c) => ((p + c.charCodeAt(0)) * 17) % 256, 0);
};

// part 1
let result = 0;
for (const step of input) {
  result += hash(step);
}
consola.warn('result', result);
// await submit({ day, level: 1, answer: result });

// part 2
const map = new Map();
for (const step of input) {
  const txt = step.match(/^\w+/)[0];
  const box = hash(txt);
  if (!map.has(box)) map.set(box, []);
  if (step.includes('=')) {
    // add
    const val = +step.split('=')[1];
    if (map.get(box).some((l) => l.txt === txt)) {
      map.set(
        box,
        map.get(box).map((l) => (l.txt === txt ? { txt, val } : l))
      );
    } else {
      map.get(box).push({ txt, val });
    }
  } else {
    // remove
    map.set(
      box,
      map.get(box).filter((l) => l.txt !== txt)
    );
  }
}


let power = 0;
for (let [box, lenses] of map) {
  for (const [i, lens] of enumerate(lenses)) {
    power += (1 + box) * (i + 1) * lens.val;
  }
}

consola.log('part2', power);
// await submit({ day, level: 1, answer: power });

consola.success('Done.');
