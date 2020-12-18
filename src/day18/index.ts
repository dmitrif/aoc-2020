import * as Lexer from 'lex';
import { test, readInput } from "../utils/index"
import { Parser } from './Parser';

const prepareInput = (rawInput: string) => rawInput.split('\n')

const input = prepareInput(readInput())

var lexer = new Lexer;
lexer.addRule(/\s+/, () => undefined);
lexer.addRule(/[0-9]/, (lexeme) => parseFloat(lexeme));
lexer.addRule(/[\(\+\-\*\/\)]/, (lexeme) => lexeme);

var operators = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
};

const goA = (input) => {
  var operator = {
    precedence: 1,
    associativity: "left"
  };

  var parser = new Parser({
      "+": operator,
      "*": operator,
  });

  const results = [];

  for (let i = 0; i < input.length; i++) {
    lexer.setInput(input[i]);

    const tokens = [];
    let token;
    while (token = lexer.lex()) tokens.push(token);

    const instructions = parser.parse(tokens);

    const stack = [];    
    instructions.forEach((c) => {
      switch (c) {
        case "+":
        case "*":
          let b = stack.pop();
          let a = stack.pop();
          stack.push(operators[c](a, b));
          break;
        default:
          stack.push(c);
      }    
    })

    results.push(stack.pop());
  }

  return results.reduce((sum, cur) => sum + cur, 0);
}

const goB = (input) => {
  var parser = new Parser({
    "+": {
      precedence: 2,
      associativity: "left"
    },
    "*": {
      precedence: 1,
      associativity: "left"
    },
  });

  const results = [];

  for (let i = 0; i < input.length; i++) {
    lexer.setInput(input[i]);

    const tokens = [];
    let token;
    while (token = lexer.lex()) tokens.push(token);

    const instructions = parser.parse(tokens);

    const stack = [];    
    instructions.forEach((c) => {
      switch (c) {
        case "+":
        case "*":
          let b = stack.pop();
          let a = stack.pop();
          stack.push(operators[c](a, b));
          break;
        default:
          stack.push(c);
      }    
    })

    results.push(stack.pop());
  }

  return results.reduce((sum, cur) => sum + cur, 0);
}

/* Tests */

test(goA(prepareInput('1 + (3 * 5) * 2')), 32);
test(goA(prepareInput('2 * 3 + (4 * 5)')), 26);
test(goA(prepareInput('5 + (8 * 3 + 9 + 3 * 4 * 3)')), 437);
test(goA(prepareInput('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))')), 12240);
test(goA(prepareInput('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2')), 13632);

test(goB(prepareInput('1 + (2 * 3) + (4 * (5 + 6))')), 51);
test(goB(prepareInput('2 * 3 + (4 * 5)')), 46);
test(goB(prepareInput('5 + (8 * 3 + 9 + 3 * 4 * 3)')), 1445);
test(goB(prepareInput('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))')), 669060);
test(goB(prepareInput('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2')), 23340);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
