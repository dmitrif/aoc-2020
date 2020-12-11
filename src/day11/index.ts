import { test, readInput } from "../utils/index"

const STATE = {
  EMPTY: 'EMPTY',
  TAKEN: 'TAKEN',
}

const prepareInput = (rawInput: string) => rawInput.split('\n').map(row => {
  return row.split('').map(seat => seat === 'L' ? STATE.EMPTY : null);
});

const input = prepareInput(readInput())

const getOccupiedNeighbours = (input, row, seat) => {
  const neighbours = [
    [row - 1, seat - 1],
    [row - 1, seat],
    [row - 1, seat + 1],
    [row, seat - 1],
    [row, seat + 1],
    [row + 1, seat - 1],
    [row + 1, seat],
    [row + 1, seat + 1],
  ];

  return neighbours.map(([nRow, nSeat]) => {
    const curRowData = input[nRow];

    if (!curRowData) {
      return 0;
    }

    const curSeatData = curRowData[nSeat];

    if (curSeatData === STATE.TAKEN) {
      return 1;
    }

    return 0;
  }).reduce((sum, cur) => sum + cur, 0)
}

const findTaken = (input, row, seat, steps) => {
  const [rowStep, seatStep] = steps;

  const log = row === 7 && seat === 9 && rowStep === 1 && seatStep === 0 ? (...args) => console.log(...args) : () => {};

  if (row === 0 && rowStep < 0) {
    return 0;
  }

  if (seat === 0 && seatStep < 0) {
    return 0;
  }

  let curRowIdx = row;
  let curSeatIdx = seat;

  while (true) {
    curRowIdx += rowStep;
    curSeatIdx += seatStep;

    let curRow = input[curRowIdx];

    if (typeof curRow === 'undefined') {
      return 0;
    }

    let curSeat = curRow[curSeatIdx];

    if (typeof curSeat === 'undefined') {
      return 0;
    }

    if (curSeat === STATE.TAKEN) {
      return 1;
    }

    if (curSeat === STATE.EMPTY) {
      return 0;
    }
  }
}

const getVisibleNeighbours = (input, row, seat) => {
  const neighbours = [
    findTaken(input, row, seat, [-1, -1]),
    findTaken(input, row, seat, [-1, 0]),
    findTaken(input, row, seat, [-1, +1]),
    findTaken(input, row, seat, [0, -1]),
    findTaken(input, row, seat, [0, +1]),
    findTaken(input, row, seat, [+1, -1]),
    findTaken(input, row, seat, [+1, 0]),
    findTaken(input, row, seat, [+1, +1]),
  ];

  return neighbours.reduce((sum, cur) => sum + cur, 0)
}


const simulateSeating = (input, abandonTreshold = 4, neighbourFn = getOccupiedNeighbours) => {
  let changed = false;

  const update = input.map((row, rowIdx) => {
    return row.map((seat, seatIdx) => {
      if (seat === null) {
        return null;
      }

      const occupied = neighbourFn(input, rowIdx, seatIdx);

      if (seat === STATE.EMPTY && occupied === 0) {
        changed = true;
        return STATE.TAKEN;
      }

      if (seat === STATE.TAKEN && occupied >= abandonTreshold) {
        changed = true;
        return STATE.EMPTY;
      }

      return seat;
    });
  });

  return [changed, update];
};

const countOccupied = (input) => input.reduce((totalSum, row) => {
  return totalSum + row.reduce((rowSum, seat) => {
    if (seat === STATE.TAKEN) {
      return rowSum + 1;
    }

    return rowSum;
  }, 0);
}, 0);

const printSeatingChart = (input) => {
  const render = input.map(row => row.map(seat => seat === 'EMPTY' ? 'L' : seat === 'TAKEN' ? '#' : '.').join('')).join('\n')
  console.log(`${render}\n\n`);
}


const goA = (input) => {
  let simulate = true;
  let seatingChart = input;

  while (simulate) {
    [simulate, seatingChart] = simulateSeating(seatingChart);
  }

  return countOccupied(seatingChart);
}

const goB = (input) => {
  let simulate = true;
  let seatingChart = input;

  while (simulate) {
    [simulate, seatingChart] = simulateSeating(seatingChart, 5, getVisibleNeighbours);
  }

  return countOccupied(seatingChart);
}

/* Tests */

test(goA(prepareInput(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`)), 37)

test(goB(prepareInput(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`)), 26)

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
