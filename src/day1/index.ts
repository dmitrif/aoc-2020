import { test, readInput } from "../utils/index"

const TARGET = 2020;

const prepareInput = (rawInput: string) => rawInput.split('\n').map(int => parseInt(int, 10));

const input = prepareInput(readInput())

const goA = (input) => {
  for (let i = 0; i < input.length; i++) {
    const needle = TARGET - input[i];

    if (input.includes(needle)) {
      return needle * input[i];
    }
  }

  return
}

const goB = (rawInput) => {
  const input = rawInput.sort();

  for (let i = 0; i < input.length - 2; i++) {
    let f = i + 1;
    let l = input.length - 1;

    while (f < l) {
      const sum = input[i] + input[f] + input[l];

      console.log(sum);

      if (sum > TARGET) {
        l--;
      } else if (sum < TARGET) {
        f++;
      } else {
        return input[i] * input[f] * input[l];
      }
    }
  }

  return
}

/* Tests */

test(goA(prepareInput(`1721
979
366
299
675
1456`)), 514579)

test(goB(prepareInput(`1721
979
366
299
675
1456`)), 241861950)

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
