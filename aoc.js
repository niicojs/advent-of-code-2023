import { existsSync, readFileSync, writeFileSync } from 'fs';
import { consola } from 'consola';

export async function submit(year, day, level, answer) {
  consola.log(`Sending answer : ${answer}`);

  let incorrect = [];
  if (existsSync('incorrect.json')) {
    incorrect = JSON.parse(readFileSync('incorrect.json', 'utf-8'));
  }
  const wrong = incorrect[`${day}-${level}`];
  if (wrong.includes(answer)) {
    consola.error('Incorrect answer, already sent');
  }

  const url = `https://adventofcode.com/${year}/day/${+day}/answer`;
  const body = new URLSearchParams({ level, answer });
  const res = await fetch(url, {
    body,
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
  if (res.status !== 200) {
    throw new Error(
      `Fetching "${url}" failed with status ${res.status}:\n${await res.text()}`
    );
  }
  const response = await res.text();
  if (response.includes('You gave an answer too recently')) {
    const match = response.match(/You have (.*?) left to wait/);
    if (!match) {
      consola.error(
        "You gave an answer too recently but the time couldn't be parsed."
      );
    } else {
      consola.error('You gave an answer too recently. Wait ' + match[1]);
    }
    return false;
  } else if (response.includes('not the right answer')) {
    incorrect[`${day}-${level}`] = [
      ...(incorrect[`${day}-${level}`] || []),
      answer,
    ];
    writeFileSync(
      'incorrect.json',
      JSON.stringify(incorrect, null, 2),
      'utf-8'
    );
    
    if (response.includes('too high')) {
      consola.log('Answer is too high');
      return false;
    } else if (response.includes('too low')) {
      consola.log('Answer is too low');
      return true;
    } else {
      consola.log('Answer not correct');
      return false;
    }
  } else if (response.includes("That's the right answer!")) {
    return true;
  }
  consola.log('Urecognized response while submitting, logging raw response');
  consola.log(response);
  consola.log('===========================================================');
  return false;
}
