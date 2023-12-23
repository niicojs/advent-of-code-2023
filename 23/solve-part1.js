import { config } from 'dotenv';
import { consola } from 'consola';
import Heap from 'heap';
import {
  directNeighbors,
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

const grid = getGrid(getDataLines(day));
const print = (path = []) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (inPath(path, [x, y])) {
        if (grid[y][x] === '.') {
          line += '\x1b[33m' + 'o' + '\x1b[0m';
        } else {
          line += '\x1b[33m' + grid[y][x] + '\x1b[0m';
        }
      } else {
        line += grid[y][x];
      }
    }
    line += '│';
    consola.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const start = [grid[0].indexOf('.'), 0];
const end = [grid[grid.length - 1].indexOf('.'), grid.length - 1];

const walk = () => {
  const good = new Heap((a, b) => b.length - a.length);
  const todo = new Heap((a, b) => b.length - a.length);
  todo.push([start]);
  while (todo.size() > 0) {
    const path = todo.pop();
    const [x, y] = path.at(-1);
    if (x === end[0] && y === end[1]) {
      good.push(path);
    } else if (['>', '<', '^', 'v'].includes(grid[y][x])) {
      let [a, b] = [x, y];
      if (grid[y][x] === '>') a++;
      else if (grid[y][x] === '<') a--;
      else if (grid[y][x] === '^') b--;
      else if (grid[y][x] === 'v') b++;
      if (!inPath(path, [a, b]) && grid[b][a] !== '#') {
        todo.push([...path, [a, b]]);
      }
    } else {
      const possible = directNeighbors
        .map(([i, j]) => [x + i, y + j])
        .filter(
          ([a, b]) =>
            inGridRange(grid, a, b) &&
            grid[b][a] !== '#' &&
            !inPath(path, [a, b])
        );
      for (const [a, b] of possible) {
        todo.push([...path, [a, b]]);
      }
    }
  }
  return good.pop();
};

consola.log('start', start);
consola.log('end', end);

const path = walk();

print(path);

const answer = path.length - 1;
consola.warn('Result:', answer);

consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// await submit({ day, level: 1, answer: answer });

consola.success('Done.');
