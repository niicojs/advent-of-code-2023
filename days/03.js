import { consola } from 'consola';
import {
  get2DArray,
  getCurrentDay,
  getDataLines,
  neighbors,
  product,
} from '../utils.js';

const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
const array = get2DArray(lines);
// consola.log(array);

const isInbound = (x, y) =>
  y >= 0 && y < array.length && x >= 0 && x < array[0].length;
const isNumber = (x, y) => !isNaN(+array[y][x]);
const isEmpty = (x, y) => array[y][x] === '.';
const isGear = (x, y) => array[y][x] === '*';
const isNotAlone = (x, y) =>
  neighbors.some(
    ([i, j]) =>
      isInbound(x + i, y + j) &&
      !isNumber(x + i, y + j) &&
      !isEmpty(x + i, y + j)
  );
const findGears = (x, y) =>
  neighbors.filter(([i, j]) => isInbound(x + i, y + j) && isGear(x + i, y + j));

let gearsmap = {};
let sum = 0;
for (let y = 0; y < array.length; y++) {
  for (let x = 0; x < array[0].length; x++) {
    if (isNumber(x, y)) {
      let hasPart = false;
      let hasGear = [];
      let num = '';
      while (isNumber(x, y) && isInbound(x, y)) {
        num += array[y][x];
        if (isNotAlone(x, y)) {
          hasPart = true;
          // part 2
          const gears = findGears(x, y);
          if (gears.length > 0) {
            for (const gear of gears) {
              const idx =
                (x + gear[0]).toString() + '-' + (y + gear[1]).toString();
              hasGear.push(idx);
            }
          }
        }
        x++;
      }
      if (hasPart) {
        sum += +num;
      }
      if (hasGear.length) {
        for (const gear of hasGear) {
          if (gearsmap[gear]) {
            gearsmap[gear].push(+num);
          } else {
            gearsmap[gear] = [+num];
          }
        }
      }
    }
  }
}

consola.warn('part 1', sum);

let ratio = 0;
for (const gear in gearsmap) {
  const nbs = [...new Set(gearsmap[gear])];
  if (nbs.length >= 2) {
    ratio += product(nbs);
  }
}
consola.warn('part 2', ratio);

consola.success('Done.');
