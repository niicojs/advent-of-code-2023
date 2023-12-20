import { consola } from 'consola';
import { enumerate, getCurrentDay, getDataLines } from '../utils.js';

const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
const data = lines.map((l) => l.split(' ')).map(([a, b]) => [a, +b]);

const count = (str) => {
  const res = {};
  for (const c of str) {
    res[c] = 1 + (res[c] || 0);
  }
  return res;
};

const order = ['five', 'four', 'full', 'three', 'twopair', 'pair', 'high'];

// part 1
{
  const cards = [
    'A',
    'K',
    'Q',
    'J',
    'T',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
  ];

  const get = (hand) => {
    const cnt = count(hand);
    const max = Math.max(...Object.values(cnt));
    if (max === 5) return 'five';
    if (max === 4) return 'four';
    const full =
      Object.values(cnt).find((c) => c === 3) > 0 &&
      Object.values(cnt).find((c) => c === 2) > 0;
    if (full) return 'full';
    if (max === 3) return 'three';
    if (Object.values(cnt).filter((c) => c === 2).length === 2)
      return 'twopair';
    if (max === 2) return 'pair';
    return 'high';
  };

  const compare = ([hand1], [hand2]) => {
    const type1 = get(hand1);
    const type2 = get(hand2);
    if (type1 !== type2) {
      return order.indexOf(type2) - order.indexOf(type1);
    } else {
      for (let i = 0; i < hand1.length; i++) {
        const un = cards.indexOf(hand1[i]);
        const deux = cards.indexOf(hand2[i]);
        if (un !== deux) return deux - un;
      }
    }
    return 0;
  };

  const sorted = data.sort(compare);

  let winning = 0;
  for (const [idx, [_, bid]] of enumerate(sorted)) {
    winning += (idx + 1) * bid;
  }

  consola.warn('part 1', winning);
}

// part 2
{
  const cards = [
    'A',
    'K',
    'Q',
    'T',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
    'J',
  ];

  const get = (hand) => {
    const cnt = count(hand);
    const max = Math.max(...Object.values(cnt));
    if (max === 5) return 'five';
    if (max === 4) {
      if (cnt['J'] === 1 || cnt['J'] === 4) return 'five';
      return 'four';
    }
    const full =
      Object.values(cnt).find((c) => c === 3) > 0 &&
      Object.values(cnt).find((c) => c === 2) > 0;
    if (full) {
      if (cnt['J'] === 3 || cnt['J'] === 2) return 'five';
      return 'full';
    }
    if (max === 3) {
      if (cnt['J'] === 3 || cnt['J'] === 1) return 'four';
      return 'three';
    }
    if (Object.values(cnt).filter((c) => c === 2).length === 2) {
      if (cnt['J'] === 2) return 'four';
      if (cnt['J'] === 1) return 'full';
      return 'twopair';
    }
    if (max === 2) {
      if (cnt['J'] === 2 || cnt['J'] === 1) return 'three';
      return 'pair';
    }
    if (cnt['J'] === 1) return 'pair';
    return 'high';
  };

  const compare = ([hand1], [hand2]) => {
    const type1 = get(hand1);
    const type2 = get(hand2);
    if (type1 !== type2) {
      return order.indexOf(type2) - order.indexOf(type1);
    } else {
      for (let i = 0; i < hand1.length; i++) {
        const un = cards.indexOf(hand1[i]);
        const deux = cards.indexOf(hand2[i]);
        if (un !== deux) return deux - un;
      }
    }
    return 0;
  };

  const sorted = data.sort(compare);

  let winning = 0;
  for (const [idx, [_, bid]] of enumerate(sorted)) {
    winning += (idx + 1) * bid;
  }

  consola.warn('part 2', winning);
}

consola.success('Done.');
