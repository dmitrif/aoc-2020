import { test, readInput } from "../utils/index"

const ACTIVE_CHAR = '#';
const EXPANSION_FACTOR = 1;

const prepareInput = (
  rawInput: string
):number[][][][] => [[rawInput.split('\n').map(
  val => val.split('').map(cell => {
    return cell === ACTIVE_CHAR ? 1 : 0
  }),
)]];

const renderMatrix = (matrix, comment = '') => {
  console.log(`====${comment}====`)

  for (let w = 0; w < matrix.length; w++) {
    console.log(`W = ${w}`);
    for (let z = 0; z < matrix.length; z++) {
      console.log(`Z = ${z}`);
      renderZ(matrix, z);
    }
  }

  console.log('=========')
}

const renderZ = (matrix, z) => {
  const rows = matrix[z];
  console.log('------')
  console.log(rows.map(cols => cols.map(cell => cell ? ACTIVE_CHAR : '.').join('')).join('\n'));
  console.log('------')
}

const neighbours = (() => {
  const range = [-1, 0, 1];

  return range.reduce((acc, inc) => {
    const curX = inc;

    for (let i = 0; i < range.length; i++) {
      const curY = range[i];

      for (let j = 0; j < range.length; j++) {
        const curZ = range[j];

        for (let k = 0; k < range.length; k++) {
          const curW = range[k];

          if (curX === 0 && curY === 0 && curZ === 0 && curW === 0) {
            continue;
          }

          acc.push([curX, curY, curZ, curW])
        }
      }
    }

    return acc;
  }, []);
})();

const countActiveNeighbours = (matrix, w, x, y, z, searchW = false) => {
  return neighbours.reduce((acc, [incX, incY, incZ, incW]) => {
    if (incW !== 0 && !searchW) {
      return acc;
    }

    const curW = w + incW;
    const curZ = z + incZ;
    const curY = y + incY;
    const curX = x + incX;

    if (
      typeof matrix?.[curW]?.[curZ]?.[curY]?.[curX] === 'undefined'
    ) {
      return acc;
    }

    return acc += matrix[curW][curZ][curY][curX];
  }, 0);
}

const countActive = (matrix) => {
  return matrix.reduce((total, dimension) => {
    return total + dimension.reduce((dimensionSum, layer) => {
      return dimensionSum + layer.reduce((layerSum, row) => {
        return layerSum + row.reduce((cellSum, cell) => {
          return cellSum + cell;
        }, 0)
      }, 0)
    }, 0);
  }, 0);
}

const mutate = (matrix, search4D = false) => {
  let wLength = search4D ? matrix.length + EXPANSION_FACTOR * 2 : matrix.length;
  const wOffset = search4D ? EXPANSION_FACTOR : 0;
  let zLength = matrix[0].length + EXPANSION_FACTOR * 2;
  let yLength = matrix[0][0].length + EXPANSION_FACTOR * 2;
  let xLength = matrix[0][0][0].length + EXPANSION_FACTOR * 2;

  const mutated = [];

  for (let w = 0; w < wLength; w++) {
    for (let z = 0; z < zLength; z++) {
      for (let y = 0; y < yLength; y++) {
        for (let x = 0; x < xLength; x++) {
          const preDim = {
            w: w - wOffset,
            z: z - EXPANSION_FACTOR,
            y: y - EXPANSION_FACTOR,
            x: x - EXPANSION_FACTOR,
          };

          const cellValue = matrix?.[preDim.w]?.[preDim.z]?.[preDim.y]?.[preDim.x] || 0;
          const neighboursActive = countActiveNeighbours(matrix, preDim.w, preDim.x, preDim.y, preDim.z, search4D);

          if (!mutated[w]) {
            mutated[w] = [];
          }

          if (!mutated[w][z]) {
            mutated[w][z] = [];
          }

          if (!mutated[w][z][y]) {
            mutated[w][z][y] = [];
          }
          
          if (cellValue === 0 && neighboursActive === 3) {
            mutated[w][z][y][x] = 1;
          } else if (cellValue === 1 && (neighboursActive === 2 || neighboursActive === 3)) {;
            mutated[w][z][y][x] = 1;
          } else {
            mutated[w][z][y][x] = 0;
          }
        }
      }
    }
  }

  return mutated;
}

const input = prepareInput(readInput())

const goA = (input) => {
  let matrix = input;

  // renderMatrix(matrix);

  for (let i = 0; i < 6; i++) {
    matrix = mutate(matrix);
    // renderMatrix(matrix);
  }

  return countActive(matrix);
}

const goB = (input) => {
  let matrix = input;

  for (let i = 0; i < 6; i++) {
    matrix = mutate(matrix, true);
  }

  return countActive(matrix);
}

/* Tests */

// console.log(countActiveNeighbours(prepareInput(`.#.
// ..#
// ###`), 2, 2, 0))

test(goA(prepareInput(`.#.
..#
###`)), 112);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
