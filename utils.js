import { existsSync, readFileSync } from 'fs';
import path from 'path';

/**
 *
 * @returns string
 */
export function getCurrentDay() {
  return path.parse(process.argv[1]).name;
}

/**
 *
 * @param {string} day
 * @returns string
 */
export function getRawData(day) {
  let inputs = '../inputs';
  if (!existsSync(inputs)) inputs = './inputs';
  return readFileSync(path.join(inputs, day + '.txt'), 'utf8');
}

/**
 *
 * @param {string} day
 * @returns string[]
 */
export function getDataLines(day, removeBlank = true) {
  const raw = getRawData(day);
  let lines = raw.split(/\r?\n/);
  if (removeBlank) {
    lines = lines.filter(Boolean);
  }
  return lines;
}

/**
 *
 * @param {string[]} lines
 * @returns string[][]
 */
export function getGrid(lines) {
  return lines.map((l) => l.split(''));
}

/**
 *
 * @param {number[]} arr
 * @returns number
 */
export function sum(arr) {
  return arr.reduce((acc, v) => acc + v, 0);
}

/**
 *
 * @param {number[]} arr
 * @returns number
 */
export function product(arr) {
  return arr.reduce((acc, v) => acc * v, 1);
}

export function* enumerate(enumerable) {
  let i = 0;
  for (const item of enumerable) yield [i++, item];
}

export function* enumGrid(grid) {
  for (const [y, row] of enumerate(grid)) {
    for (const [x, cell] of enumerate(row)) {
      yield { x, y, row, cell };
    }
  }
}

/** @type {[number, number][]} */
export const directNeighbors = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];
/** @type {[number, number][]} */
export const diagNeighbors = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];
export const neighbors = [...diagNeighbors, ...directNeighbors];

export function chunk(arr, len) {
  arr = [...arr];
  return [...Array(Math.ceil(arr.length / len))].map((_, i) =>
    arr.slice(i * len, (i + 1) * len)
  );
}
