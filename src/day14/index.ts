import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n').reduce((acc, line, idx, arr) => {
  const [type, value] = line.split(' = ');

  if (type === 'mask') {
    if (typeof acc.currentGroup.mask !== 'undefined') {
      acc.result.push(acc.currentGroup);
    }

    acc.currentGroup = { mask: value, values: [] };
    return acc;
  }

  const [ _, memAddress ] = type.split(/\[|\]/);
  acc.currentGroup.values.push([memAddress, parseInt(value, 10)]);

  if (idx === arr.length - 1) {
    acc.result.push(acc.currentGroup);
  }

  return acc;
}, { result: [], currentGroup: { mask: undefined, values: [] } })['result'];

const input = prepareInput(readInput())

const goA = (input) => {
  let memory = {};

  input.forEach(({ mask, values }) => {
    values.forEach(([address, value]) => {
      let binary = value.toString(2).padStart(36,'0').split('');

      for(let i = 0; i < 36 ; i++){
        if(mask[i] !== 'X'){
          binary[i] = mask[i];    
        }
      }

      memory[address] = parseInt(binary.join(''), 2);
    })
  });

  return Object.keys(memory).reduce((acc, address) => {
    return acc += memory[address];
  }, 0);
}

const goB = (input) => {
  let memory = {};

  input.forEach(({ mask, values }) => {
    values.forEach(([address, value]) => {
      let addrBinary = parseInt(address, 10).toString(2).padStart(36,'0').split('');

      for(let i = 0; i < 36 ; i++){
        if(mask[i] === 'X' || mask[i] === '1'){
          addrBinary[i] = mask[i];    
        }
      }

      let writeKeys = [addrBinary];
      let incomplete = 1;

      while (incomplete) {
        incomplete = 0;

        writeKeys.forEach((key, idx) => {
          const wildcardIdx = key.indexOf('X');

          if (wildcardIdx !== -1) {
            key[wildcardIdx] = '0';
            writeKeys.push([...key]);
            key[wildcardIdx] = '1';
            writeKeys.push([...key]);
            
            incomplete = 1;
            writeKeys.splice(idx, 1)
          }
        });
      }

      writeKeys.forEach(key => {
        const writeAddress = parseInt(key.join(''), 2);
        memory[writeAddress] = value;
      })
    })
  });

  return Object.keys(memory).reduce((acc, address) => {
    return acc += memory[address];
  }, 0);

}

/* Tests */

test(goA(prepareInput(`mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`)), 165);

test(goB(prepareInput(`mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`)), 208);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
