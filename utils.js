import { existsSync, readFileSync } from 'fs';
import path from 'path';

/**
 *
 * @returns string
 */
export function getCurrentDay() {
  const file = path.parse(process.argv[1]).name;
  return file.match(/^(\d+)/)[1];
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
 * @param {any[][]} grid
 * @param {number} x
 * @param {number} y
 * @returns boolean
 */
export function inGridRange(grid, x, y) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
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

const gcd = (x, y) => (!y ? x : gcd(y, x % y));
const _lcm = (x, y) => (x * y) / gcd(x, y);
/**
 *
 * @param {number[]} arr
 * @returns number[]
 */
export const lcm = (arr) => {
  return arr.reduce((a, b) => _lcm(a, b));
};

export function deepEqual(a, b) {
  if (typeof a !== 'object') {
    return a === b;
  }
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([k, v]) => deepEqual(v, b[k]))
  );
}

export function memoize(func, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = resolver.apply(this, args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
