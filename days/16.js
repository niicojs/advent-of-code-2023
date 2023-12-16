import { config } from 'dotenv';
import { consola } from 'consola';
import { getCurrentDay, getDataLines, getGrid, inGridRange } from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
const grid = getGrid(lines);

const print = (light) => {
  const pad = (grid.length - 1).toString().length;
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' ';
    for (let x = 0; x < grid[y].length; x++) {
      if (light.has(JSON.stringify([x, y]))) {
        line += '#';
      } else {
        line += grid[y][x];
      }
    }
    consola.log(line);
  }
};

const beam = (pos, from) => {
  let light = new Set();
  let done = new Set();
  const todo = [{ start: pos, dir: from }];
  while (todo.length > 0) {
    let { start, dir } = todo.shift();
    let [x, y] = start;
    if (done.has(JSON.stringify({ start, dir }))) continue;

    light.add(JSON.stringify([x, y]));

    // print();

    while (true) {
      let [i, j] = [x + dir[0], y + dir[1]];
      if (!inGridRange(grid, i, j)) break;
      light.add(JSON.stringify([i, j]));
      if (done.has(JSON.stringify({ start: [x, y], dir }))) break;
      done.add(JSON.stringify({ start: [x, y], dir }));

      if (grid[j][i] === '-') {
        if (dir[1] === 0) {
          // horizontal, continue
        } else {
          //split
          todo.push({ start: [i, j], dir: [1, 0] });
          todo.push({ start: [i, j], dir: [-1, 0] });
          break;
        }
      } else if (grid[j][i] === '|') {
        if (dir[0] === 0) {
          // vertical, continue
        } else {
          //split
          todo.push({ start: [i, j], dir: [0, 1] });
          todo.push({ start: [i, j], dir: [0, -1] });
          break;
        }
      } else if (grid[j][i] === '/') {
        // [1, 0]  -> [0, -1]
        // [-1, 0] -> [0, 1]
        // [0, 1]  -> [-1, 0]
        // [0, -1] -> [1, 0]
        dir = [-dir[1], -dir[0]];
      } else if (grid[j][i] === '\\') {
        // [1, 0]  -> [0, 1]
        // [-1, 0] -> [0, -1]
        // [0, 1]  -> [1, 0]
        // [0, -1] -> [-1, 0]
        dir = [dir[1], dir[0]];
      }

      [x, y] = [i, j];
    }
  }
  return light;
};

// part 1
{
  const light = beam([-1, 0], [1, 0]);
  consola.warn('part 1', light.size - 1);
  // await submit({ day, level: 1, answer: light.size });
}

// part 2
{
  let result = 0;
  for (let y = 0; y < grid.length; y++) {
    result = Math.max(
      result,
      beam([-1, y], [1, 0]).size,
      beam([grid[0].length, y], [-1, 0]).size
    );
  }
  for (let i = 0; i < grid[0].length; i++) {
    result = Math.max(
      result,
      beam([i, -1], [0, 1]).size,
      beam([i, grid.length], [0, -1]).size
    );
  }

  consola.warn('part 2', result - 1);
  // await submit({ day, level: 2, answer: result - 1 });
}

consola.success('Done.');
