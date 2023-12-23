import { config } from 'dotenv';
import { consola } from 'consola';
import {
  directNeighbors,
  enumGrid,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
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
    grid[y][x] = '.';
  }
}

// thanks to https://www.youtube.com/watch?v=9UOMZSL0JTg

const fill = (x, y, maxSteps, visited = new Set(), distance = 0) => {
  const key = JSON.stringify({ x, y, distance });
  if (visited.has(key)) return 0;
  visited.add(key);

  if (distance === maxSteps) return 1;

  let plots = 0;
  directNeighbors
    .map(([i, j]) => [x + i, y + j])
    .forEach(([nx, ny]) => {
      if (inGridRange(grid, nx, ny) && grid[ny][nx] === '.') {
        plots += fill(nx, ny, maxSteps, visited, distance + 1);
      }
    });

  return plots;
};

const [startX, startY] = start;
const ln = grid.length;
const steps = 26501365;

const gardenGridDiameter = ~~(steps / ln) - 1;

const oddGardens = (~~(gardenGridDiameter / 2) * 2 + 1) ** 2;
const evenGardens = (~~((gardenGridDiameter + 1) / 2) * 2) ** 2;

const oddGardenPlots = fill(startX, startY, ln * 2 + 1);
const evenGardenPlots = fill(startX, startY, ln * 2);

const northPlots = fill(startX, ln - 1, ln - 1);
const eastPlots = fill(0, startY, ln - 1);
const southPlots = fill(startX, 0, ln - 1);
const westPlots = fill(ln - 1, startY, ln - 1);

const smallSteps = ~~(ln / 2) - 1;

const NEPlotsSM = fill(0, ln - 1, smallSteps);
const NWPlotsSM = fill(ln - 1, ln - 1, smallSteps);
const SEPlotsSM = fill(0, 0, smallSteps);
const SWPlotsSM = fill(ln - 1, 0, smallSteps);

const largeSteps = ~~((ln * 3) / 2) - 1;

const NEPlotsLG = fill(0, ln - 1, largeSteps);
const NWPlotsLG = fill(ln - 1, ln - 1, largeSteps);
const SEPlotsLG = fill(0, 0, largeSteps);
const SWPlotsLG = fill(ln - 1, 0, largeSteps);

const mainGardenPlots =
  oddGardens * oddGardenPlots + evenGardens * evenGardenPlots;

const smallSidePlots =
  (gardenGridDiameter + 1) * (SEPlotsSM + SWPlotsSM + NWPlotsSM + NEPlotsSM);

const largeSidePlots =
  gardenGridDiameter * (SEPlotsLG + SWPlotsLG + NWPlotsLG + NEPlotsLG);

const answer =
  mainGardenPlots +
  smallSidePlots +
  largeSidePlots +
  northPlots +
  eastPlots +
  southPlots +
  westPlots;

consola.warn('Result:', answer);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// await submit({ day, level: 2, answer: answer });

consola.success('Done.');
