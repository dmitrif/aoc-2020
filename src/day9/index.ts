import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n').map(num => parseInt(num, 10));

const input = prepareInput(readInput())

const validateNumber = (arr, idx, preambleLength) => {
  const number = arr[idx];
  const preambleMin = idx - preambleLength;

  for (let i = preambleMin; i < idx; i++) {
    for (let j = i + 1; j < idx; j++) {
      if (arr[i] + arr[j] === number && arr[i] !== arr[j]) {
        return true;
      }
    }
  }

  return false;
}

const goA = (input, preambleLength) => {
  let pl = preambleLength ? preambleLength : 25;

  for (let i = pl; i < input.length; i++) {
    const result = validateNumber(input, i, pl);

    if (result === false) {
      return [i, input[i]];
    }
  }
}

const goB = (input, preambleLength) => {
  const [targetIdx, targetNum] = goA(input, preambleLength);

  let l = 0;
  let r = 0;
  let sum = 0;

  while(r < input.length) {
    if (sum === targetNum) {
      break;
    } else if (sum > targetNum) {
      sum -= input[l];
      l++;
    } else {
      sum += input[r];
      r++;
    }
  }

  return Math.min(...input.slice(l, r)) + Math.max(...input.slice(l, r))
}

/* Tests */

test(goA(prepareInput(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`), 5)[1], 127);

test(goB(prepareInput(`35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`), 5), 62);

/* Results */

console.time("TimeA")
const resultA = goA(input, 25)[1]
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input, 25)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
