import { existsSync, readFileSync, writeFileSync } from 'fs';
import { consola } from 'consola';

export async function submit({ year, day, level, answer }) {
  consola.log(`Sending answer : ${answer}`);

  if (!year) year = new Date().getFullYear();
  if (!level) level = 1;

  let incorrect = [];
  if (existsSync('incorrect.json')) {
    incorrect = JSON.parse(readFileSync('incorrect.json', 'utf-8'));
  }
  const wrong = incorrect[`${day}-${level}`] || [];
  if (wrong.includes(answer)) {
    consola.error('Réponse incorrect et déjà envoyée.');
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
      consola.error('Mauvais réponse envoyée trop récemment.');
    } else {
      consola.error(
        "Pas le droit d'envoyer une autre réponse avant " + match[1]
      );
    }
    return false;
  } else if (response.includes('not the right answer')) {
    wrong.push(answer);
    incorrect[`${day}-${level}`] = wrong;
    writeFileSync(
      'incorrect.json',
      JSON.stringify(incorrect, null, 2),
      'utf-8'
    );

    if (response.includes('too high')) {
      consola.error('Réponse trop élevée.');
      return false;
    } else if (response.includes('too low')) {
      consola.error('Réponse trop basse.');
      return true;
    } else {
      consola.error('Réponse incorrect.');
      return false;
    }
  } else if (response.includes("That's the right answer!")) {
    consola.success('Bonne réponse !');
    return true;
  }
  consola.warn('Impossible de comprendre la réponse du serveur :');
  consola.warn(response);
  return false;
}
