import { config } from 'dotenv';
import { consola } from 'consola';
import Z3 from 'z3-solver';
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

const { Context } = await Z3.init();
const { Solver, Int, Eq, And, Product, Sub, Neg } = new Context('main');
const [x, y, z] = [Int.const('x'), Int.const('y'), Int.const('z')];
const [dx, dy, dz] = [Int.const('dx'), Int.const('dy'), Int.const('dz')];

const solver = new Solver();
for (const line of lines.slice(0, 4)) {
  const [[x1, y1, z1], [dx1, dy1, dz1]] = line;
  // x1 + dx1 * t = x + dx * t
  // x1 - x = (dx - dx1) * t
  // (x1 - x) / (dx - dx1) =  (y1 - y) / (dy - dy1) = (z1 - z) / (dz - dz1)
  // eq1 = (x1 - x) * (dy - dy1) = (y1 - y) * (dx - dx1)
  // eq2 = (x1 - x) * (dz - dz1) = (z1 - z) * (dx - dx1)

  // (x1 - x) * (dy - dy1) = (y1 - y) * (dx - dx1)
  solver.add(
    Eq(x.neg().add(x1).mul(dy.sub(dy1)), y.neg().add(y1).mul(dx.sub(dx1)))
  );

  // (x1 - x) * (dz - dz1) = (z1 - z) * (dx - dx1)
  solver.add(
    Eq(x.neg().add(x1).mul(dz.sub(dz1)), z.neg().add(z1).mul(dx.sub(dx1)))
  );
}

const ok = await solver.check();
if (ok === 'sat') {
  consola.success('Found an answer 🎉');
  const answer = await solver.model().eval(x.add(y).add(z)).asString();
  console.log('answer', answer);
  // await submit({ day, level: 2, answer: answer });
} else {
  consola.error('No answer found 😡');
}

consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
process.exit(); // force exit, don't know why
