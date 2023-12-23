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

const start = [grid[0].indexOf('.'), 0];
const end = [grid[grid.length - 1].indexOf('.'), grid.length - 1];

const findIntersections = ([x, y], from, d = 0) => {
  if (x === end[0] && y === end[1]) {
    return [x, y, d, []];
  }

  const possible = directNeighbors
    .map(([i, j]) => [x + i, y + j])
    .filter(
      ([a, b]) =>
        (a !== from[0] || b !== from[1]) &&
        inGridRange(grid, a, b) &&
        grid[b][a] !== '#'
    );
  if (possible.length === 0) {
    return null;
  } else if (possible.length > 1) {
    return [x, y, d + 1, possible];
  } else {
    return findIntersections(possible[0], [x, y], d + 1);
  }
};

const key = ([a, b]) => a + ',' + b;
const nodes = new Map();
const nodesDists = new Map();
const buildGraph = () => {
  const visited = new Set();
  const todo = [[start, start, [0, 0]]];
  nodes.set(key(start), []);
  nodes.set(key(end), []);
  while (todo.length > 0) {
    const [[x, y], from] = todo.shift();

    if (x === end[0] && y === end[1]) {
    } else if (!visited.has(key([x, y]))) {
      visited.add(key([x, y]));

      const next = findIntersections([x, y], from);
      if (next) {
        const [a, b, dist, possible] = next;
        const link = nodes.get(key(from)) || [];
        link.push(key([a, b]));
        nodes.set(key(from), link);
        nodesDists.set(key(from) + ';' + key([a, b]), dist);
        for (const p of possible) {
          todo.push([p, [a, b]]);
        }
      }
    }
  }
};

const walk = () => {
  const from = key(start);
  const to = key(end);
  const todo = [[[from], 0]];
  let max = 0;
  while (todo.length > 0) {
    const [path, dist] = todo.pop();
    const pos = path.at(-1);
    for (const next of nodes.get(pos)) {
      if (!path.includes(next)) {
        const newdist = dist + nodesDists.get(pos + ';' + next);
        if (next === to) {
          if (newdist > max) {
            max = newdist;
            consola.log('found', max);
          }
          // print(path.map((l) => l.split(',').map((n) => +n)));
        } else {
          todo.push([[...path, next], newdist]);
        }
      }
    }
  }
  return max;
};

consola.log('start', start);
consola.log('end', end);

buildGraph();

const nswer = walk();

consola.warn('Result:', dist);

consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// await submit({ day, level: 2, answer: answer });

consola.success('Done.');
