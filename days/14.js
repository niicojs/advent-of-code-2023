import { config } from 'dotenv';
import { consola } from 'consola';
import { getCurrentDay, getDataLines, getGrid } from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
let grid = getGrid(lines);

const print = () => {
  console.log('------');
  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < grid[y].length; x++) {
      line += grid[y][x];
    }
    consola.log(line);
  }
};

const tilt = (dir) => {
  if (dir === 'north') {
    for (let y = 1; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'O' && grid[y - 1][x] === '.') {
          let j = y - 1;
          while (j > 0 && grid[j - 1][x] === '.') j--;
          grid[y][x] = '.';
          grid[j][x] = 'O';
        }
      }
    }
  } else if (dir === 'south') {
    for (let y = grid.length - 2; y >= 0; y--) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'O' && grid[y + 1][x] === '.') {
          let j = y + 1;
          while (j < grid.length - 1 && grid[j + 1][x] === '.') j++;
          grid[y][x] = '.';
          grid[j][x] = 'O';
        }
      }
    }
  } else if (dir === 'west') {
    for (let x = 1; x < grid[0].length; x++) {
      for (let y = 0; y < grid.length; y++) {
        if (grid[y][x] === 'O' && grid[y][x - 1] === '.') {
          let i = x - 1;
          while (i > 0 && grid[y][i - 1] === '.') i--;
          grid[y][x] = '.';
          grid[y][i] = 'O';
        }
      }
    }
  } else if (dir === 'east') {
    for (let x = grid[0].length - 2; x >= 0; x--) {
      for (let y = 0; y < grid.length; y++) {
        if (grid[y][x] === 'O' && grid[y][x + 1] === '.') {
          let i = x + 1;
          while (i < grid[0].length - 1 && grid[y][i + 1] === '.') i++;
          grid[y][x] = '.';
          grid[y][i] = 'O';
        }
      }
    }
  }
};

const cycle = () => {
  tilt('north');
  tilt('west');
  tilt('south');
  tilt('east');
};

const load = () => {
  let result = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'O') {
        result += grid.length - y;
      }
    }
  }
  return result;
};

const part2 = () => {
  let loads = [];
  const seen = new Map();
  for (let i = 0; true; i++) {
    cycle();
    const hash = grid.map((l) => l.join('')).join();
    if (seen.has(hash)) {
      const idx = seen.get(hash);
      return loads[((1000000000 - idx - 1) % (i - idx)) + idx];
    } else {
      seen.set(hash, i);
      loads.push(load(grid));
    }
  }
};

const temp = structuredClone(grid);
{
  tilt('north');
  consola.warn('part1', load());
}
grid = temp;
// await submit({ day, level: 1, answer });

const answer = part2();
consola.warn('part2', answer);
// await submit({ day, level: 2, answer });

consola.success('Done.');
