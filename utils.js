import { existsSync, readFileSync } from 'fs';
import path from 'path';

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
export function getDataLines(day) {
  const raw = getRawData(day);
  return raw.split(/\r?\n/).filter((l) => !!l);
}

/**
 *
 * @param {number[]} arr
 * @returns number
 */
export function sum(arr) {
  return arr.reduce((acc, v) => acc + v, 0);
}

export function* enumerate(enumerable) {
  let i = 0;
  for (const item of enumerable) yield [i++, item];
}
