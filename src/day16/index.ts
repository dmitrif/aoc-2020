import { test, readInput } from "../utils/index"

const PARSER_STATE = {
  RULES: 'RULES',
  MY_TICKET: 'MY_TICKET',
  TICKETS: 'TICKETS',
}

type IInput = {
  rules: {
    [key: string]: number[][]
  },
  myTicket: number[],
  tickets: number[][],
}

const prepareInput = (rawInput: string): IInput => {
  const { rules, myTicket, tickets } = rawInput.split('\n').reduce((acc, line) => {
    if (line === '') {
      return acc;
    }

    if (line === 'your ticket:') {
      acc.currentState = PARSER_STATE.MY_TICKET;
      return acc;
    }

    if (line === 'nearby tickets:') {
      acc.currentState = PARSER_STATE.TICKETS;
      return acc;
    }

    switch(acc.currentState) {
      case(PARSER_STATE.RULES):
        const [label, ranges] = line.split(': ');
        const rules = ranges.split(' or ').map(rule => rule.split('-').map(val => parseInt(val, 10)));
        acc.rules[label] = rules;
        break;
      case(PARSER_STATE.MY_TICKET):
        acc.myTicket = line.split(',').map(val => parseInt(val, 10));
        break;
      case(PARSER_STATE.TICKETS):
        acc.tickets.push(line.split(',').map(val => parseInt(val, 10)));
        break;
      default:
    }

    return acc;
  }, { rules: {}, myTicket: [], tickets: [], currentState: PARSER_STATE.RULES });

  return { rules, myTicket, tickets };
}

const input = prepareInput(readInput())

const getMergedRules = (rules: { [key: string]: number[][] }): number[][] => {
  return Object.values(rules).reduce((allRules, currentRule) => {
    currentRule.forEach(rule => {
      allRules.push(rule);
    });

    return allRules;
  }, []);
}

const goA = (input: IInput) => {
  const mergedRules = getMergedRules(input.rules);
  const errorRate = input.tickets.reduce((acc, ticket) => {
    for (let i = 0; i < ticket.length; i++) {
      const num = ticket[i];

      const passed = mergedRules.map(([min, max]) => num >= min && num <= max).some(val => val === true);
      if (!passed) {
        acc += num;
        return acc;
      }
    }

    return acc;
  }, 0)

  return errorRate;
}

const goB = (input) => {
  const rulesPerEntry = [input.myTicket, ...input.tickets].reduce((acc, ticket, idx) => {
    let nums = [];

    for (let i = 0; i < ticket.length; i++) {
      const num = ticket[i];
      let passedRules = [];

      Object.keys(input.rules).forEach(ruleName => {
        const rules = input.rules[ruleName];

        for (let i = 0; i < rules.length; i++) {
          const [min, max] = rules[i];
          if (num >= min && num <= max) {
            passedRules.push(ruleName);
            break;
          }
        }
      });

      if (passedRules.length > 0) {
        nums.push(passedRules);
      }
    }

    if (nums.length === ticket.length) {
      acc.push(nums);
    }

    return acc;
  }, []);


  const mappedValues = input.myTicket.map((val, idx) => {
    const matchingRules = rulesPerEntry.reduce((acc, ticket) => {
      if (acc.length === 0) {
        return ticket[idx];
      }

      return acc.filter(rule => ticket[idx].includes(rule));
    }, [])

    return [matchingRules, val];
  });

  while(mappedValues.some(([rules]) => typeof rules !== 'string')) {
    for (let i = 0; i < mappedValues.length; i++) {
      const [rules, val] = mappedValues[i];

      if (typeof rules !== 'string' && rules.length === 1) {
        const acceptedRule = rules[0];
        mappedValues[i] = [acceptedRule, val];

        for (let j = 0; j < mappedValues.length; j++) {
          const [otherRules, val] = mappedValues[j];
          
          if (typeof otherRules === 'object') {
            mappedValues[j] = [otherRules.filter(rule => rule !== acceptedRule), val];
          }
        }
      }
    }
  }

  return mappedValues.reduce((product, [rule, val]) => {
    if (!rule || rule.indexOf('departure') !== 0) {
      return product;
    }

    return product * val;
  }, 1);
}

/* Tests */

test(goA(prepareInput(`class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`)), 71);

test(goB(prepareInput(`class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`)), 0);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
