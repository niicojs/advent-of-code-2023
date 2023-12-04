import { consola } from 'consola';
import { enumerate, getCurrentDay, getDataLines, sum } from '../utils.js';

const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const data = getDataLines(day).map((l) =>
  l
    .split(': ')[1]
    .split(' | ')
    .map((p) => p.split(/\s+/m).filter(Boolean))
);

{
  let sum = 0;
  for (const [i, card] of enumerate(data)) {
    const [win, numbers] = card;
    const points = numbers
      .filter((n) => win.includes(n))
      .reduce((p, c, idx) => (p ? p * 2 : 1), 0);
    sum += points;
  }
  consola.warn('part 1', sum);
}

{
  const nbof = Array(data.length).fill(1);
  for (const [i, card] of enumerate(data)) {
    let [win, numbers] = card;
    const won = numbers.filter((n) => win.includes(n)).length;
    for (let y = 0; y < nbof[i]; y++) {
      for (let x = 0; x < won; x++) {
        nbof[i + x + 1]++;
      }
    }
  }
  consola.warn('part 1', sum(Object.values(nbof)));
}

consola.success('Done.');
