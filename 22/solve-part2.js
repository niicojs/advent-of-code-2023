import { config } from 'dotenv';
import { consola } from 'consola';
import Heap from 'heap';
import {
  enumerate,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
} from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const start = new Date().getTime();

const lines = getDataLines(day);
const bricks = lines.map((l) =>
  l.split('~').map((b) => b.split(',').map((n) => +n))
);
// consola.log(bricks);

const findBricksAt = ([x, y], not) => {
  const result = [];
  for (const [idx, brick] of enumerate(bricks)) {
    if (idx !== not) {
      let ok =
        x >= brick[0][0] &&
        x <= brick[1][0] &&
        y >= brick[0][1] &&
        y <= brick[1][1];
      if (ok) result.push(brick);
    }
  }
  return result.sort(
    (a, b) => Math.max(b[0][2], b[1][2]) - Math.max(a[0][2], a[1][2])
  );
};

const findGround = ([x, y, z], not) => {
  for (let idx = bricks.length - 1; idx >= 0; idx--) {
    const brick = bricks[idx];
    const bz = Math.max(brick[0][2], brick[1][2]);
    if (idx !== not) {
      let ok =
        x >= brick[0][0] &&
        x <= brick[1][0] &&
        y >= brick[0][1] &&
        y <= brick[1][1] &&
        bz < z;
      if (ok) return bz + 1;
    }
  }

  return 1;
};

const findBrickOverAt = ([x, y, z], not) => {
  const result = [];
  for (const [idx, brick] of enumerate(bricks)) {
    if (idx !== not) {
      let ok =
        x >= brick[0][0] &&
        x <= brick[1][0] &&
        y >= brick[0][1] &&
        y <= brick[1][1] &&
        Math.min(brick[0][2], brick[1][2]) === z + 1;
      if (ok) result.push(idx);
    }
  }
  result.sort(
    (a, b) =>
      Math.max(bricks[b][0][2], bricks[b][1][2]) -
      Math.max(bricks[a][0][2], bricks[a][1][2])
  );

  return result.at(-1);
};

// fall
bricks.sort((a, b) => Math.min(a[0][2], a[1][2]) - Math.min(b[0][2], b[1][2]));
for (const [idx, brick] of enumerate(bricks)) {
  const z = Math.min(brick[0][2], brick[1][2]);
  let dest = 1;
  for (let i = brick[0][0]; i <= brick[1][0]; i++) {
    for (let j = brick[0][1]; j <= brick[1][1]; j++) {
      const ground = findGround([i, j, z], idx);
      if (ground > dest) dest = ground;
    }
  }
  if (brick[0][2] === brick[1][2]) {
    brick[0][2] = dest;
    brick[1][2] = dest;
  } else if (brick[0][2] > brick[1][2]) {
    brick[0][2] = brick[0][2] - brick[1][2] + dest;
    brick[1][2] = dest;
  } else {
    brick[1][2] = brick[1][2] - brick[0][2] + dest;
    brick[0][2] = dest;
  }
}

// find support
const support = new Map();
for (const [idx, brick] of enumerate(bricks)) {
  const z = Math.max(brick[0][2], brick[1][2]);
  support.set(idx, []);
  for (let i = brick[0][0]; i <= brick[1][0]; i++) {
    for (let j = brick[0][1]; j <= brick[1][1]; j++) {
      const over = findBrickOverAt([i, j, z], idx);
      if (over) support.get(idx).push(over);
    }
  }
}

const values = [...support.values()];

// consola.log(support);

const fall = (start) => {
  const done = new Set();
  const todo = new Heap((a, b) => bricks[a][0][2] - bricks[b][0][2]);
  todo.push(start);

  while (todo.size() > 0) {
    const idx = todo.pop();
    if (!done.has(idx)) {
      done.add(idx);
      const others = support.get(idx);
      const free = others.filter(
        (x) => !values.some((arr, i) => !done.has(i) && arr.includes(x))
      );
      free.forEach(b => todo.push(b));
    }
  }

  return done.size - 1; // remove the start
};

let answer = 0;
for (const [key, value] of support) {
  let ok = true;
  for (const b of value) {
    // if idx is not elsewhere, can be dessintegrated
    if (values.every((arr, i) => i === key || !arr.includes(b))) {
      ok = false;
    }
  }
  if (!ok) {
    // get all will fall
    answer += fall(key);
  }
}

consola.warn('Result:', answer);

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 2, answer });

consola.success('Done.');
