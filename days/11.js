import { config } from 'dotenv';
import { consola } from 'consola';
import { submit } from '../aoc.js';
import { enumerate, getCurrentDay, getDataLines, getGrid } from '../utils.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
const grid = getGrid(lines);

const stars = [];
const emptyRows = [];
const emptyCols = [];

// get stars
{
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '#') stars.push([x, y]);
    }
  }
}

// get empy rows and cols
{
  for (let y = 0; y < lines.length; y++) {
    if (!lines[y].includes('#')) emptyRows.push(y);
  }

  for (let x = 0; x < grid[0].length; x++) {
    let empty = true;
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] === '#') {
        empty = false;
        break;
      }
    }
    if (empty) emptyCols.push(x);
  }
}

consola.log('stars', stars.length);
consola.log('emptyRows', emptyRows);
consola.log('emptyCols', emptyCols);

const expansion = 1000000 - 1; // (2-1) for part 1
const distance = ([a1, b1], [a2, b2]) => {
  const [x1, x2] = [a1, a2].toSorted((a, b) => a - b);
  const [y1, y2] = [b1, b2].toSorted((a, b) => a - b);
  let dist = y2 - y1 + x2 - x1;
  return (
    dist +
    expansion * emptyRows.filter((r) => r >= y1 && r <= y2).length +
    expansion * emptyCols.filter((r) => r >= x1 && r <= x2).length
  );
};

let result = 0;
for (const [idx, one] of enumerate(stars)) {
  for (const two of stars.slice(idx + 1)) {
    result += distance(one, two);
  }
}

consola.warn('result', result);

await submit({ day, level: 2, answer: result });

consola.success('Done.');
