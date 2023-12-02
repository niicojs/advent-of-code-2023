import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
consola.log(lines);

let sum = 0;
for (const line of lines) {
  const numbers = line
    .replaceAll('one', 'one1one')
    .replaceAll('two', 'two2two')
    .replaceAll('three', 'three3three')
    .replaceAll('four', 'four4four')
    .replaceAll('five', 'five5five')
    .replaceAll('six', 'six6six')
    .replaceAll('seven', 'seven7seven')
    .replaceAll('eight', 'eight8eight')
    .replaceAll('nine', 'nine9nine')
    .split('')
    .filter((c) => !isNaN(+c))
    .map((c) => +c);
  const first = numbers.at(0);
  const last = numbers.at(-1);
  sum += +(first.toString() + last.toString());
}

consola.warn('result', sum);

consola.success('Done.');
