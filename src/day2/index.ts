import { access } from 'fs';
import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => {
  const lines = rawInput.split('\n');
  return lines.map(line => {
    const [range, char, text] = line.replace(':', '').split(' ');
    const [min, max] = range.split('-');

    return {
      min,
      max,
      char,
      text,
    };
  });
}

const input = prepareInput(readInput())

console.log(input);

const goA = (input) => {
  const validPasswords = input.reduce((acc, { min, max, char, text }) => {
    const sortedLetters = text.split('').sort().join('');
    const firstOccurence = text.indexOf(char);

    if (firstOccurence === -1) {
      return acc;
    }

    const lastOccurence = text.lastIndexOf(char);

    const repeats = lastOccurence - firstOccurence + 1;

    if (repeats > max || repeats < min) {
      return acc;
    }

    return acc + 1;
  }, 0);

  return validPasswords;
}

const goB = (input) => {
  const validPasswords = input.reduce((acc, { min: a, max: b, char, text }) => {
    const charAMatch = text[a - 1] === char;
    const charBMatch = text[b - 1] === char;

    if ((charAMatch || charBMatch) && !(charAMatch && charBMatch)) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return validPasswords;
}

/* Tests */

test(goB(prepareInput('1-3 a: abcde')), 1);
test(goB(prepareInput('1-3 b: cdefg')), 0);
test(goB(prepareInput('2-9 c: ccccccccc')), 0);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
