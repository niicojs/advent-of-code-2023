import { writeFileSync } from 'fs';
import { config } from 'dotenv';
import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  inGridRange,
  inPath,
  neighbors,
} from '../utils.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const start = new Date().getTime();

const lines = getDataLines(day)
  .map((l) => l.split(' '))
  .map(([a, b]) => [a, +b]);

const dirmap = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
};

const boundaries = () => {
  let path = [[0, 0]];
  let [x, y] = [0, 0];

  // dig
  for (const [d, nb] of lines) {
    const dir = dirmap[d];
    for (let i = 0; i < nb; i++) {
      [x, y] = [x + dir[0], y + dir[1]];
      path.push([x, y]);
    }
  }

  return path;
};

// build path
let path = boundaries();

// get min / max
let minx = Math.min(...path.map(([x]) => x));
let maxx = Math.max(...path.map(([x]) => x));
let miny = Math.min(...path.map(([, y]) => y));
let maxy = Math.max(...path.map(([, y]) => y));

// normalize to a 0,0 based grid
path = path.map(([x, y]) => [x - minx, y - miny]);
maxx = maxx - minx + 1;
maxy = maxy - miny + 1;

// build grid
const grid = Array(maxy)
  .fill(0)
  .map(() => Array(maxx).fill('.'));

const print = () => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      line += grid[y][x];
    }
    line += '│';
    consola.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

// put boundaries in grid
for (let y = 0; y < maxy; y++) {
  for (let x = 0; x < maxx; x++) {
    if (inPath(path, [x, y])) {
      grid[y][x] = '#';
    }
  }
}

const inside = (pos) => {
  const done = new Set();
  const todo = [[pos]];
  while (todo.length > 0) {
    const path = todo.shift();
    let [x, y] = path.at(-1);

    if (done.has(x + '-' + y)) continue;
    done.add(x + '-' + y);

    const possible = neighbors
      .map(([i, j]) => [x + i, y + j])
      .filter(([a, b]) => !inGridRange(grid, a, b) || grid[b][a] !== '#');

    if (
      possible.some(([a, b]) => !inGridRange(grid, a, b) || grid[y][x] === ' ')
    ) {
      // outside
      path.forEach(([a, b]) => {
        grid[b][a] = ' ';
      });
      return false;
    } else if (possible.some(([a, b]) => grid[y][x] === 'o')) {
      // inside
      path.forEach(([a, b]) => {
        grid[b][a] = 'o';
      });
      return true;
    } else {
      todo.push(...possible.map(([a, b]) => [...path, [a, b]]));
    }
  }

  return true;
};

// dig in the middle
for (let y = 0; y < maxy; y++) {
  for (let x = 0; x < maxx; x++) {
    if (grid[y][x] === '.') {
      if (inside([x, y])) {
        grid[y][x] = 'o';
      }
    }
  }
}

print();

writeFileSync('./18/output.json', JSON.stringify(grid), 'utf-8');

consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 2, answer: result });

consola.success('Done.');
