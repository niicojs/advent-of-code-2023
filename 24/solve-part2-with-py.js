import { writeFileSync } from 'fs';
import { config } from 'dotenv';
import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day).map((l) =>
  l.split(' @ ').map((p) => p.split(', ').map((n) => +n))
);

let pyfile = `from sympy import *
init_printing()

x, y, z, dx, dy, dz = symbols('x y z dx dy dz')
equations = [];
`;
for (const line of lines.slice(0, 4)) {
  const [[x1, y1, z1], [dx1, dy1, dz1]] = line;
  // x1 + dx1 * t = x + dx * t
  // x1 - x = (dx - dx1) * t
  // (x1 - x) / (dx - dx1) =  (y1 - y) / (dy - dy1) = (z1 - z) / (dz - dz1)
  // eq1 = (x1 - x) * (dy - dy1) - (y1 - y) * (dx - dx1) = 0
  // eq2 = (x1 - x) * (dz - dz1) - (z1 - z) * (dx - dx1) = 0

  const eq1 = `(${x1} - x) * (dy - (${dy1})) - (${y1} - y) * (dx - (${dx1}))`;
  const eq2 = `(${x1} - x) * (dz - (${dz1})) - (${z1} - z) * (dx - (${dx1}))`;

  pyfile += 'equations.append(' + eq1 + ')\n';
  pyfile += 'equations.append(' + eq2 + ')\n';
}
pyfile += 'solve(equations)\n';

writeFileSync('./24/finish.py', pyfile, 'utf8');

consola.log('Run finish.py in python to get results.');

consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// await submit({ day, level: 2, answer: answer });

consola.success('Done.');
