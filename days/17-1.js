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
const start = new Date().getTime();

const lines = getDataLines(day);
const grid = getGrid(lines).map((l) => l.map((c) => +c));

const print = (path) => {
  const pad = (grid.length - 1).toString().length;
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' ';
    for (let x = 0; x < grid[y].length; x++) {
      const inpath = inPath(path, [x, y]);
      if (inpath) line += '\x1b[33m';
      line += grid[y][x];
      if (inpath) line += '\x1b[0m';
    }
    consola.log(line);
  }
};

const key = (o) => JSON.stringify(o);

const find = () => {
  const done = new Map();
  const good = [];
  const todo = new Heap((a, b) => a.dist - b.dist);
  todo.push({ path: [[0, 0]], pos: [0, 0], dir: [1, 0], nb: 0, dist: 0 });

  while (todo.size() > 0) {
    let { path, pos, dir, nb, dist } = todo.pop();
    const [x, y] = pos;

    if (x === grid[0].length - 1 && y === grid.length - 1) {
      good.push({ path, dist });
    } else if (!done.has(key({ pos, dir, nb }))) {
      done.set(key({ pos, dir, nb }), dist);

      const possible = directNeighbors
        .map(([i, j]) => [i, j, x + i, y + j])
        .filter(([i, j]) => i !== -dir[0] || j !== -dir[1])
        .filter(([, , a, b]) => inGridRange(grid, a, b))
        .filter(([i, j]) => nb < 3 || (i !== dir[0] && j !== dir[1]));

      for (const [i, j, a, b] of possible) {
        const newnb = i !== dir[0] || j !== dir[1] ? 1 : nb + 1;
        todo.push({
          // path: [...path, [a, b]],
          pos: [a, b],
          dir: [i, j],
          nb: newnb,
          dist: dist + grid[b][a],
        });
      }
    }
  }

  return good.sort((p1, p2) => p1.dist - p2.dist)[0];
};

const { path, dist } = find();

if (path) print(path);

consola.warn('result', dist);
consola.success('Elapsed:', formatElapsedTime(start - new Date().getTime()));

// await submit({ day, level: 1, answer: dist });

consola.success('Done.');
