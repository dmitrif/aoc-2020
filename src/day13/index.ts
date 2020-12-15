import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => {
  const data = rawInput.split('\n');
  const ts = parseInt(data[0], 10);
  const busses = data[1].split(',').map(busId => parseInt(busId, 10) || 'x');

  return {ts, busses};
}

const input = prepareInput(readInput())

const goA = ({ ts, busses }) => {
  let minutesWaited, busId;
  const cleanBusses = busses.filter(busId => busId !== 'x');

  for (let i = ts; i < Infinity; i++) {
    const targetBusIdx = busses.map(busId => i % busId).indexOf(0);

    if (targetBusIdx !== -1) {
      minutesWaited = i - ts;
      busId = busses[targetBusIdx];
      break;
    }
  }

  return busId * minutesWaited;
}

const goB = ({ busses }) => {
  const sp = busses.map((busId, idx) => ({
    busId,
    cadence: busId,
    offset: idx,
  })).filter(({ busId }) => busId !== 'x');

  let time = 0;
  let count = 0;

  const firstBus = sp.shift();
  let increment = firstBus.cadence;

  sp.forEach(bus => {
    console.log('Lining up bus:', bus.cadence, 'at increment:', increment, 'time:', time, 'count:', count)

    let remainder;
    do {
      time = time + increment;
      remainder = (time + bus.offset) % bus.cadence;
      count++;
    } while (remainder !== 0)

    increment *= bus.cadence;
  })
  console.log('Used', count, 'loops to find answer')

  return time;
}

/* Tests */

test(goA(prepareInput(`939
7,13,x,x,59,x,31,19`)), 295);

test(goB(prepareInput(`939
7,13,x,x,59,x,31,19`)), 1068781);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
