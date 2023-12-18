import { config } from 'dotenv';
import { consola } from 'consola';
import { submit } from '../aoc.js';
import {
  deepEqual,
  directNeighbors,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
  lacet,
} from '../utils.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
let grid = getGrid(lines);

let start = [0, 0];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === 'S') start = [x, y];
  }
}

consola.log('start', start);

const connected = ([a1, b1], [a2, b2]) => {
  const val1 = grid[b1][a1];
  const val2 = grid[b2][a2];
  if (val2 === 'S') {
    ''.toString();
  }
  if (val1 === '.' || val2 === '.') {
    return false;
  } else if (val1 === 'S') {
    return (
      (b1 === b2 &&
        (['-'].includes(val2) ||
          (a2 > a1 && ['J', '7'].includes(val2)) ||
          ['L', 'F'].includes(val2))) ||
      (a1 === a2 &&
        (['|'].includes(val2) ||
          (b1 > b2 && ['F', '7'].includes(val2)) ||
          ['L', 'J'].includes(val2)))
    );
  } else if (val1 === '-') {
    return (
      b1 === b2 &&
      (['-', 'S'].includes(val2) ||
        (a1 > a2 && ['L', 'F', 'S'].includes(val2)) ||
        ['J', '7', 'S'].includes(val2))
    );
  } else if (val1 === '|') {
    return (
      a1 === a2 &&
      (['|', 'S'].includes(val2) ||
        (b1 > b2 && ['F', '7', 'S'].includes(val2)) ||
        ['L', 'J', 'S'].includes(val2))
    );
  } else if (val1 === 'L') {
    return (
      (a1 === a2 && b2 === b1 - 1 && ['|', 'F', '7', 'S'].includes(val2)) ||
      (b1 === b2 && a2 === a1 + 1 && ['-', 'J', '7', 'S'].includes(val2))
    );
  } else if (val1 === 'J') {
    return (
      (a1 === a2 && b2 === b1 - 1 && ['|', 'F', '7', 'S'].includes(val2)) ||
      (b1 === b2 && a2 === a1 - 1 && ['-', 'F', 'L', 'S'].includes(val2))
    );
  } else if (val1 === '7') {
    return (
      (a1 === a2 && b2 === b1 + 1 && ['|', 'J', 'L', 'S'].includes(val2)) ||
      (b1 === b2 && a2 === a1 - 1 && ['-', 'F', 'L', 'S'].includes(val2))
    );
  } else if (val1 === 'F') {
    return (
      (a1 === a2 && b2 === b1 + 1 && ['|', 'J', 'L', 'S'].includes(val2)) ||
      (b1 === b2 && a2 === a1 + 1 && ['-', 'J', '7', 'S'].includes(val2))
    );
  }
};

const inPath = (path, [x, y]) => path.some(([i, j]) => i === x && j === y);

const done = {};
const findLoop = (start) => {
  const todo = [[start]];
  while (todo.length > 0) {
    const path = todo.pop();
    const [x, y] = path.at(-1);
    for (let [i, j] of directNeighbors) {
      if (inGridRange(grid, x + i, y + j)) {
        const next = [x + i, y + j];
        if (path.length > 1 && deepEqual(path.at(-2), next)) {
          // we come from there
        } else if (connected([x, y], next)) {
          if (grid[next[1]][next[0]] === 'S') {
            // found
            // console.log('found loop', [...path, next]);
            return [...path, next];
          } else if (inPath(path, next)) {
            ''.toString();
          } else if (!done[next[0] + '-' + next[1]]) {
            todo.push([...path, next]);
            // const test = findLoop(next, [...path, next]);
            // done[next[0] + '-' + next[1]] = true;
          } else {
            // const d = done[next[0] + '-' + next[1]];
            // d.toString();
          }
        }
      }
    }
    // done[x + '-' + y] = true;
  }
};

const print = (path) => {
  const nice = {
    '-': '─',
    '|': '│',
    J: '┘',
    F: '┌',
    L: '└',
    7: '┐',
  };
  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < grid[y].length; x++) {
      const inpath = inPath(path, [x, y]);
      if (inpath) line += '\x1b[33m';
      if (x === start[0] && y === start[1]) {
        line += 'S';
      } else {
        line += nice[grid[y][x]] || grid[y][x];
      }
      if (inpath) line += '\x1b[0m';
    }
    consola.log(line);
  }
};

consola.info('Finding loop...');
const loop = findLoop(start);

print(loop);

consola.warn('part 1', (loop.length - 1) / 2);

// https://en.wikipedia.org/wiki/Shoelace_formula
const area = lacet(loop);

// https://en.wikipedia.org/wiki/Pick%27s_theorem
const pick = Math.ceil(area - loop.length / 2 + 1);

consola.warn('part 2', pick);

// await submit({ day, level: 1, answer: result.dist });

consola.success('Done.');
