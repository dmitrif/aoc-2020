import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n\n').map(group => group.split('\n'));

const input = prepareInput(readInput())

const goA = (input) => {
  const sum = input.reduce((sum, group) => {
    const answers = group.reduce((answerSheet, responses) => {
      return {
        ...answerSheet,
        ...responses.split('').reduce((acc, key) => { 
          acc[key] = '';
          return acc;
        }, {})
      };
    }, {});

    return sum + Object.keys(answers).length;
  }, 0);

  return sum;
}

const goB = (input) => {
  const sum = input.reduce((sum, group) => {
    const answers = group.reduce((answerSheet, responses) => {
      responses.split('').forEach((response) => {
        answerSheet[response] = answerSheet[response] ? answerSheet[response] + 1 : 1;
      });

      return answerSheet
    }, {});

    return sum + Object.keys(answers).filter(key => answers[key] === group.length).length;
  }, 0);

  return sum;
}

/* Tests */

test(goA(prepareInput(`abc

a
b
c

ab
ac

a
a
a
a

b`)), 11)
test(goB(prepareInput(`abc

a
b
c

ab
ac

a
a
a
a

b`)), 6)

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
