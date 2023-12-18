import { consola } from 'consola';
import { enumerate, getCurrentDay, getDataLines } from '../utils.js';

const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);

// part 1
{
  const times = lines[0].match(/(\d+)/g).map((n) => +n);
  const distances = lines[1].match(/(\d+)/g).map((n) => +n);

  consola.log(times, distances);

  let result = 1;
  for (const [idx, time] of enumerate(times)) {
    let hold = 1;
    const ways = [];
    while (hold < distances[idx]) {
      const d = hold * (time - hold);
      if (d > distances[idx]) {
        ways.push(hold);
      }
      hold++;
    }
    result *= ways.length;
  }

  consola.warn('part 1', result);
}

// part 2
{
  const time = +lines[0].split(': ')[1].replaceAll(/\s+/g, '');
  const distance = +lines[1].split(': ')[1].replaceAll(/\s+/g, '');

  consola.log(time, distance);

  let hold = 1;
  let ways = 0;
  while (hold < distance && hold < time) {
    const d = hold * (time - hold);
    if (d > distance) ways++;
    hold++;
  }

  consola.warn('part 2', ways);
}

consola.success('Done.');
