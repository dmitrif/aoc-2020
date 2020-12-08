import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n').reduce((parentAcc, current) => {
  const [parent, children] = current.split('contain');
  const parentColor = parent.replace('bags', '').trim();

  if (children.trim() === 'no other bags.') {
    return parentAcc;
  }

  const cleanChildren = children.replace('.', '').split(',').map(child => {
    const [number, ...color] = child.replace(/bag(s)?/, '').trim().split(' ');
    return { color: color.join(' '), number };
  }).reduce((acc, current) => {
    acc[current.color] = current.number;
    return acc;
  }, {});

  parentAcc[parentColor] = cleanChildren;
  return parentAcc;
}, {});

const input = prepareInput(readInput())

const goA = (input) => {
  const result = [];
  const queue = ['shiny gold'];
  
  while (queue.length !== 0) {
    const currentSearch = queue.pop();

    Object.keys(input).forEach(bagType => {
      const contains = Object.keys(input[bagType]);
      if (contains.includes(currentSearch)) {
        if (!result.includes(bagType)) {
          queue.push(bagType);
          result.push(bagType)
        }
      }
    });
  }
  
  return result.length;
}

const goB = (input) => {
  let result = 0;
  const queue: [string, number][] = [['shiny gold', 1]];
  
  while (queue.length !== 0) {
    const [currentSearch, multiplier] = queue.pop();

    if (!input[currentSearch]) {
      continue;
    }

    Object.keys(input[currentSearch]).forEach(child => {
      const count = parseInt(input[currentSearch][child], 10);
      result += count * multiplier;
      queue.push([child, count * multiplier]);
    })
  }
  
  return result;

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
