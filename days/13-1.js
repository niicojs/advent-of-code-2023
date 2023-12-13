import { config } from 'dotenv';
import { consola } from 'consola';
import { getCurrentDay, getDataLines, getGrid } from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day, false);
const patterns = [];
for (let i = 0; i < lines.length; i++) {
  const current = [];
  while (i < lines.length && lines[i] !== '') {
    current.push(lines[i++]);
  }
  patterns.push(getGrid(current));
}

const testVerticalMirror = (grid, x) => {
  // consola.log('testVerticalMirror', x);
  for (let y = 0; y < grid.length; y++) {
    for (let i = x; i >= 0; i--) {
      const left = i;
      const right = x - i + x + 1;
      if (left >= 0 && right < grid[0].length) {
        if (grid[y][left] !== grid[y][right]) {
          return false;
        }
      }
    }
  }
  return true;
};

const testHorizontalMirror = (grid, y) => {
  // consola.log('testHorizontalMirror', y);
  for (let x = 0; x < grid[0].length; x++) {
    for (let j = y; j >= 0; j--) {
      const up = j;
      const down = y - j + y + 1;
      if (up >= 0 && down < grid.length) {
        if (grid[up][x] !== grid[down][x]) {
          return false;
        }
      }
    }
  }
  return true;
};

const findMirror = (grid) => {
  // vertical
  for (let x = 0; x < grid[0].length - 1; x++) {
    if (grid[0][x] === grid[0][x + 1]) {
      if (testVerticalMirror(grid, x)) {
        return { axe: 'vertical', x };
      }
    }
  }
  // horizontal
  for (let y = 0; y < grid.length - 1; y++) {
    if (grid[y][0] === grid[y + 1][0]) {
      if (testHorizontalMirror(grid, y)) {
        return { axe: 'horizontal', y };
      }
    }
  }

  return null;
};

let result = 0;
for (const grid of patterns) {
  const mirror = findMirror(grid);
  if (mirror.axe === 'vertical') {
    result += mirror.x + 1;
  } else {
    result += 100 * (mirror.y + 1);
  }
}

consola.warn('result', result);

// await submit({ day, level: 1, answer: result });

consola.success('Done.');
