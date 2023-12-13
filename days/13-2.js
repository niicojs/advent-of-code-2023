import { config } from 'dotenv';
import { consola } from 'consola';
import {
  enumGrid,
  getCurrentDay,
  getDataLines,
  getGrid,
} from '../utils.js';
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

const findMirror = (grid, except) => {
  // vertical
  for (let x = 0; x < grid[0].length - 1; x++) {
    if (grid[0][x] === grid[0][x + 1]) {
      if (!except || except.x !== x) {
        if (testVerticalMirror(grid, x)) {
          return { axe: 'vertical', x };
        }
      }
    }
  }
  // horizonta
  for (let y = 0; y < grid.length - 1; y++) {
    if (grid[y][0] === grid[y + 1][0]) {
      if (!except || except.y !== y) {
        if (testHorizontalMirror(grid, y)) {
          return { axe: 'horizontal', y };
        }
      }
    }
  }

  return null;
};

const getPossible = (grid) => {
  const possible = [];
  for (const { x, y } of enumGrid(grid)) {
    const other = structuredClone(grid);
    other[y][x] = other[y][x] === '#' ? '.' : '#';
    possible.push(other);
  }
  return possible;
};

const findAlternateMirror = (grid) => {
  const first = findMirror(grid);
  const possible = getPossible(grid);
  for (const smudged of possible) {
    const mirror = findMirror(smudged, first);
    if (mirror) return mirror;
  }
  return null;
};

let result = 0;
for (const grid of patterns) {
  const mirror = findAlternateMirror(grid);
  console.log(mirror);
  if (mirror.axe === 'vertical') {
    result += mirror.x + 1;
  } else {
    result += 100 * (mirror.y + 1);
  }
}

consola.warn('result', result);

// await submit({ day, level: 2, answer: result });

consola.success('Done.');
