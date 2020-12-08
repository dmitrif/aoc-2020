import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput.split('\n');

type TICKET_METADATA = {
  row: number;
  column: number;
  id: number;
}

const MAX_ROWS = 127;
const MAX_COLUMNS = 7;
const PARTITIONS = {
  FIRST: 'first',
  LAST: 'last',
  F: 'first',
  B: 'last',
  L: 'first',
  R: 'last',
}

const getSeatId = (row, column) => row * (MAX_COLUMNS + 1) + column;

const selectPartition = (partition, start, end) => {
  const total = end - start;
  const midPoint = Math.floor(total / 2);

  if (partition === PARTITIONS.FIRST) {
    return { start, end: start + midPoint };
  }

  return { start: start + midPoint + 1, end };
}

const input = prepareInput(readInput())

const getTickets = (input) => input.map((ticketCode) => {
  let startRow = 0;
  let endRow = MAX_ROWS;

  let startCol = 0;
  let endCol = MAX_COLUMNS;

  for (var i = 0; i < 7; i++) {
    const partitionType = PARTITIONS[ticketCode[i]];
    const partition = selectPartition(partitionType, startRow, endRow);

    startRow = partition.start;
    endRow = partition.end;
  }

  const row = startRow;
  
  for (var i = 7; i < ticketCode.length; i++) {
    const partitionType = PARTITIONS[ticketCode[i]];
    const partition = selectPartition(partitionType, startCol, endCol);

    startCol = partition.start;
    endCol = partition.end;
  }

  const column = startCol;
  
  return {row, column, id: getSeatId(row, column)};
}).sort((a, b) => a.id - b.id);

const goA = (input): number => {
  const tickets = getTickets(input);

  return tickets[tickets.length - 1].id;
}

const goB = (input) => {
  const tickets = getTickets(input);
  for (let i = 0; i < tickets.length; i++) {
    const id = tickets[i].id;
    const nextId = i + 1 < tickets.length ? tickets[i + 1].id : tickets[i].id;

    if (nextId - id === 2) {
      return id + 1;
    }
  }
}

/* Tests */

test<number>(goA(prepareInput('FBFBBFFRLR')), 357)
test<number>(goA(prepareInput('BFFFBBFRRR')), 567)
test<number>(goA(prepareInput('FFFBBBFRRR')), 119)
test<number>(goA(prepareInput('BBFFBBFRLL')), 820)


/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
