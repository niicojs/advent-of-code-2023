import { consola } from 'consola';
import { config } from 'dotenv';
import { enumerate, getCurrentDay, getDataLines } from '../../utils.js';
import { submit } from '../../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);

const games = [];
for (const line of lines) {
  const sets = line.split(': ')[1].split(/\;\s*/m);

  const game = [];
  for (const set of sets) {
    const tirage = { red: 0, green: 0, blue: 0 };
    const nbcolors = set.split(/\,\s*/m);
    for (const nbcolor of nbcolors) {
      const [nb, color] = nbcolor.split(/\s+/);
      tirage[color] = nb;
    }
    game.push(tirage);
  }

  games.push(game);
}

const possible = { red: 12, green: 13, blue: 14 };

let sum = 0;
for (const [i, game] of enumerate(games)) {
  const id = i + 1;
  let ok = true;
  for (const tirage of game) {
    if (
      tirage.red > possible.red ||
      tirage.green > possible.green ||
      tirage.blue > possible.blue
    ) {
      // pas possible
      ok = false;
    } else {
      // possible
    }
  }
  if (ok) sum += id;
}

consola.warn('part 1', sum);
// await submit({ day, level: 1, answer: sum });

let power = 0;
for (const [i, game] of enumerate(games)) {
  const id = i + 1;

  const min = {
    red: 0,
    green: 0,
    blue: 0,
  };
  for (const tirage of game) {
    min.red = Math.max(min.red, tirage.red);
    min.green = Math.max(min.green, tirage.green);
    min.blue = Math.max(min.blue, tirage.blue);
  }
  power += min.red * min.green * min.blue;
}

consola.warn('part 2', power);
// await submit({ day, level: 2, answer: power });

consola.success('Done.');
