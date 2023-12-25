import { writeFileSync } from 'fs';
import { config } from 'dotenv';
import { consola } from 'consola';
import { mincut } from '@graph-algorithm/minimum-cut';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submit } from '../aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);
const begin = new Date().getTime();

const lines = getDataLines(day)
  .map((l) => l.split(': '))
  .map(([a, b]) => [a, b.split(' ')]);

const nodes = [];
const edges = [];

for (const [from, l] of lines) {
  let i = nodes.indexOf(from);
  if (i < 0) {
    nodes.push(from);
    i = nodes.length - 1;
  }

  for (const to of l) {
    let j = nodes.indexOf(to);
    if (j < 0) {
      nodes.push(to);
      j = nodes.length - 1;
    }
    edges.push([i, j]);
  }
}

consola.log(edges);
const cut = [...mincut(edges)];
for (const edge of cut) {
  consola.log(nodes[edge[0]] + '-' + nodes[edge[1]]);
}

const newedges = edges.filter(
  ([a, b]) =>
    !cut.some(([i, j]) => (a === i && b === j) || (a === j && b === i))
);

const size = (from) => {
  const todo = [from];
  const done = new Set();
  while (todo.length > 0) {
    const node = todo.shift();
    if (!done.has(node)) {
      done.add(node);
      const lines = newedges.filter(([a, b]) => a === node || b === node);
      for (const [a, b] of lines) {
        if (a === node) todo.push(b);
        else todo.push(a);
      }
    }
  }
  return done.size;
};

// https://dreampuf.github.io/GraphvizOnline
const exportGraph = () => {
  let data = 'digraph G {\n';
  for (const [from, values] of map) {
    data += from + '-> { ' + [...values].join(' ') + ' }\n';
    // for (const to of values) {
    //   data += from + '->' + to + '\n';
    // }
  }
  data += '}';
  writeFileSync('./25/graph.dot', data, 'utf-8');
};

const answer = size(cut[0][0]) * size(cut[0][1]);
consola.warn('Result:', answer);

consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// await submit({ day, level: 1, answer: answer });

consola.success('Done.');
