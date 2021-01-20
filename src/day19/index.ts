import { access } from 'fs';
import { runInContext } from 'vm';
import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n').reduce((acc, line) => {
  if (line === '') {
    return acc;
  }

  if (line.indexOf(':') !== -1) {
    const [index, value] = line.split(': ');
    let storedVal;

    if (value[0] === '"') {
      storedVal = value.slice(1, -1);
    } else {
      storedVal = value.split(' | ').map(variant => variant.split(' ').map(ref => parseInt(ref, 10)));
    }

    acc.rules[index] = storedVal;

    return acc;
  }

  acc.messages.push(line);
  return acc;
}, { rules: {}, messages: [] })

const input = prepareInput(readInput())

const matchRule = (
  message,
  rules,
  ruleIdx,
  charIdx = 0,
) => {
  const curRule = rules[ruleIdx];

  if (typeof curRule === 'string') {
    return message[charIdx] === curRule ? charIdx + 1 : undefined;
  } else {
    for (const variant of curRule) {
      let i = charIdx;
      let failed = false;
      
      for (const r of variant) {
        const nextIdx = matchRule(message, rules, r, i);

        if (nextIdx === undefined) {
          failed = true;
          break;
        } else {
          i = nextIdx;
        }
      }
      if (!failed) {
        return i;
      }
    }
  }
  
  return undefined;
}

export const matchRule2 = (
  line: string,
  rules,
  ruleIndex = 0,
  wordIndex = 0
): number[] => {
  const rule = rules[ruleIndex];
  if (typeof rule === 'string') {
    return line[wordIndex] === rule ? [wordIndex + 1] : [];
  } else {
    return rule.flatMap((r) =>
      r.reduce(
        (acc, n) => {
          return acc.flatMap((ir) => matchRule(line, rules, n, ir));
        },
        [wordIndex]
      )
    );
  }
};

const goA = ({ rules, messages }) => {
  return messages.filter((message) => matchRule(message, rules, 0) === message.length).length;
}

const goB = ({ rules, messages }) => {
  const newRules = {
    ...rules,
    8: [[42], [42, 8]],
    11: [[42, 31], [42, 11, 31]]
  }

  const matches = messages.filter(message => {
    const result = matchRule2(message, newRules);
    return result[0] === message.length;
  });

  console.log(matches);

  return matches.length;
}

/* Tests */

test(goA(prepareInput(`0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`)), 2)

test(goB(prepareInput(`42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`)), 12)

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
