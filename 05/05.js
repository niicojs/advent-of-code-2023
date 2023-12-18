import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
const [first, ...rest] = lines;

const config = {};
const seeds = first.match(/(\d+)/g).map((n) => +n);

const transformations = [];
let currentmap = 'none';
for (let x = 0; x < rest.length; x++) {
  const name = rest[x].match(/([a-z]|\-)+/);
  if (name) {
    currentmap = name[0];
    config[currentmap] = [];
    transformations.push(currentmap);
  } else {
    config[currentmap].push(rest[x].match(/(\d+)/g).map((n) => +n));
  }
}

const truc2machin = (input, mappings) => {
  for (const mapping of mappings) {
    const [dest, start, ln] = mapping;
    if (input >= start && input < start + ln) {
      return dest + (input - start);
    }
  }
  return input;
};

const transform = (input) => {
  let location = input;
  for (let t of transformations) {
    location = truc2machin(location, config[t]);
  }
  return location;
};

// part 1
{
  let result = Number.MAX_SAFE_INTEGER;
  for (const input of seeds) {
    result = Math.min(result, transform(input));
  }

  consola.warn('part 1', result);
}

// part 2
{
  let result = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i];
    const ln = seeds[i + 1];
    consola.log(start, ln);
    for (let x = start; x < start + ln; x++) {
      result = Math.min(result, transform(x));
    }
  }

  consola.warn('part 2', result);
}

consola.success('Done.');
