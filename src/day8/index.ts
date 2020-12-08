import { test, readInput } from "../utils/index"

type Instruction = [string, number];

const prepareInput = (rawInput: string): Instruction[] => {
  return rawInput.split('\n').map(line => {
    const [command, param] = line.split(' ');
    return [command, parseInt(param, 10)];
  });
}

const input = prepareInput(readInput())

class IntVM {
  _acc: number;
  _stack: Instruction[];
  _visited: number[];
  _execIdx: number;

  _commands = {
    nop: () => { 
      this._execIdx++; 
    },
    acc: (param) => {
      this._acc += param;
      this._execIdx++;
    },
    jmp: (param) => {
      this._execIdx += param;
    }
  };

  load = (instructionSet) => {
    this._acc = 0;
    this._execIdx = 0;
    this._stack = instructionSet;
    return this;
  }

  run = () => {
    this._visited = [];

    while(this._execIdx < this._stack.length) {
      const [command, param] = this._stack[this._execIdx];
      const visited = this._visited.includes(this._execIdx);

      if (visited) {
        return ['Infinity', this._acc];
      }

      this._visited.push(this._execIdx);
      this._commands[command](param);
    }

    return [true, this._acc];
  }

  getVisitOrder = () => this._visited;
}

const swapCommand = (command) => {
  if (command === 'nop') {
    return 'jmp';
  }

  if (command === 'jmp') {
    return 'nop';
  }

  return command;
}

const goA = (input) => {
  const vm = new IntVM();
  return vm.load(input).run();
}

const goB = (input) => {
  const vm = new IntVM();

  let result = [];
  let visitOrder;
  let instructionChangeIdx;

  while (!result[0] || result[0] === 'Infinity') {
    const instructionSet = input;

    if (visitOrder && typeof instructionChangeIdx !== 'undefined') {
      const instructionIdx = visitOrder[instructionChangeIdx];
      const [command, param] = instructionSet[instructionIdx];
      // console.log('Changing idx', instructionIdx, command);
      instructionSet[instructionIdx] = [swapCommand(command), param];
    }

    result = vm.load(input).run();

    if (!visitOrder) {
      visitOrder = vm.getVisitOrder();
      instructionChangeIdx = visitOrder.length - 1;
    } else {
      instructionChangeIdx--;
    }
  }

  return result;
}

/* Tests */

test(goA(prepareInput(`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`))[1], 5)

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
