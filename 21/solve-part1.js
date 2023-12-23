import { config } from 'dotenv';
import { consola } from 'consola';
import {
  directNeighbors,
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
  inPath,
} from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const grid = getGrid(lines);

let start = [0, 0];
for (const { x, y } of enumGrid(grid)) {
  if (grid[y][x] === 'S') {
    start = [x, y];
    break;
  }
}

const print = (mark = []) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (inPath(mark, [x, y])) {
        line += 'o';
      } else {
        line += grid[y][x];
      }
    }
    line += '│';
    consola.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

// print();

const step = (pos) => {
  return directNeighbors
    .map(([i, j]) => [pos[0] + i, pos[1] + j])
    .filter(([a, b]) => inGridRange(grid, a, b) && grid[b][a] !== '#');
};

let reach = [start];
for (let i = 0; i < 64; i++) {
  const newreach = reach.flatMap(step);
  reach = [];
  newreach.forEach((pos) => {
    if (!inPath(reach, pos)) reach.push(pos);
  });
}

print(reach);

const answer = reach.length;
consola.warn('Result:', answer);

consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// await submit({ day, level: 1, answer: answer });

consola.success('Done.');
