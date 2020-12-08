import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(''));

const input = prepareInput(readInput())

const goA = (input, rightStep = 3, downStep = 1) => {
  let treesEncountered = 0;

  for (let y = 0, x = 0; y < input.length; y += downStep) {
    const row = input[y];
    const ptWidth = row.length;

    if (y !== 0) {
      x += rightStep;
    }

    if (x > ptWidth - 1) {
      x = x - ptWidth;
    }

    if (row[x] === '#') {
      treesEncountered++;
    }
  }

  return treesEncountered;
}

const goB = (input) => {
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
  ];

  return slopes.map(([ right, down ]) => goA(input, right, down)).reduce((product, op) => product ? product * op : product)
}

/* Tests */

// test()

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
