import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n').map(num => parseInt(num, 10)).sort((a, b) => a-b);

const input = prepareInput(readInput())

const joltDeviation = 3;

const goA = (input) => {
  let joltDiffs = {};
  let lastAdapter = 0;
  
  for (let i = 0; i < input.length; i++) {
    console.log(i, input[i], lastAdapter)
    if (input[i] > lastAdapter && input[i] - lastAdapter <= joltDeviation) {
      const diff = input[i] - lastAdapter;

      if (typeof joltDiffs[diff] === 'undefined') {
        joltDiffs[diff] = 0;
      }

      joltDiffs[diff] += 1;

      lastAdapter = input[i];
    } else {
      throw new Error('Chain broken');
    }
  }

  joltDiffs[3] += 1;
  return joltDiffs[1] * joltDiffs[3];
}

const goB = (input) => {
  const maxJoltage = Math.max(...input);
  const joltages = [0, ...input, maxJoltage + 3]

  const dp = [0, 0, 1];
  for (let i = 1; i < joltages.length; i++) {
    let pos = 0;

    if (i >= 3 && 0 < (joltages[i] - joltages[i - 3]) && joltages[i] - joltages[i - 3] <= 3) {
      pos += dp[0];
    }
    if (i >= 2 && 0 < (joltages[i] - joltages[i - 2]) && joltages[i] - joltages[i - 2] <= 3) {
      pos += dp[1];
    }
    if (i >= 1 && 0 < (joltages[i] - joltages[i - 1]) && joltages[i] - joltages[i - 1] <= 3) {
      pos += dp[2];
    }

    dp.shift();
    dp.push(pos);
  }

  return dp[2];
}

/* Tests */

test(goA(prepareInput(`16
10
15
5
1
11
7
19
6
12
4`)), 35);

test(goA(prepareInput(`28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`)), 220);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
