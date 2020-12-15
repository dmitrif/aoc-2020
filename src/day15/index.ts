import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split(',').map(num => parseInt(num, 10));

const input = prepareInput(readInput())

const goA = (input) => {
  const lastSaid = [...input];

  for (let i = input.length; i < 2020; i++) {
    const prevNum = lastSaid[i - 1];
    const lastNamed = lastSaid.lastIndexOf(prevNum);
    const secondLastNamed = lastNamed !== -1 ? lastSaid.slice(0, lastNamed).lastIndexOf(prevNum) : -1;

    if (secondLastNamed === -1) {
      lastSaid.push(0);
    } else {
      lastSaid.push(lastNamed - secondLastNamed);
    }
  }

  return lastSaid[lastSaid.length - 1];
}

const goB = (input) => {
  let lastNum = input[input.length - 1];
  const n = 30000000;
  const lastSpoken = new Array(n);
  input.forEach((v, i) => lastSpoken[v] = i + 1);

  for (let i = input.length; i < n; i++) {
    const next = lastSpoken[lastNum] ? i - lastSpoken[lastNum] : 0;
    lastSpoken[lastNum] = i;
    lastNum = next;
  }

  return lastNum;
}

/* Tests */

// test(goA(prepareInput(`0,3,6`)), 1);
test(goA(prepareInput(`1,3,2`)), 1);
test(goA(prepareInput(`2,1,3`)), 10);
test(goA(prepareInput(`1,2,3`)), 27);
test(goA(prepareInput(`2,3,1`)), 78);
test(goA(prepareInput(`3,2,1`)), 438);
test(goA(prepareInput(`3,1,2`)), 1836);

test(goB(prepareInput(`0,3,6`)), 175594);
test(goB(prepareInput(`1,3,2`)), 2578);
test(goB(prepareInput(`2,1,3`)), 3544142);
test(goB(prepareInput(`1,2,3`)), 261214);
test(goB(prepareInput(`2,3,1`)), 6895259);
test(goB(prepareInput(`3,2,1`)), 18);
test(goB(prepareInput(`3,1,2`)), 362);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
