import { test, readInput } from "../utils/index"

type ICommand = {
  op: string,
  param: number,
}

const DIR = {
  'EAST': 'EAST',
  'SOUTH': 'SOUTH',
  'WEST': 'WES',
  'NORTH': 'NORTH',
}

const DIRECTION_SHORTCODES = {
  'E': 'EAST',
  'S': 'SOUTH',
  'W': 'WES',
  'N': 'NORTH',
};

const DIR_FACTOR = {
  [DIR.EAST]: 1,
  [DIR.WEST]: -1,
  [DIR.NORTH]: 1,
  [DIR.SOUTH]: -1,
};

const DIRECTION_ANGLES = {
  0: DIR.EAST,
  90: DIR.SOUTH,
  180: DIR.WEST,
  270: DIR.NORTH
}

const getDirection = (shortcode) => DIRECTION_SHORTCODES[shortcode];

const prepareInput = (rawInput: string) => rawInput.split('\n').map((command: string): ICommand => ({
  op: command.substring(0, 1),
  param: parseInt(command.substring(1), 10)
}));

const rotate = (x, y, angle) => {
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * x) + (sin * y),
      ny = (cos * y) - (sin * x);
  return [Math.round(nx), Math.round(ny)];
}

const input = prepareInput(readInput())

const goA = (input) => {
  const {movements} = input.reduce((acc, { op, param }) => {
    if (op === 'F') {
      acc.movements[DIRECTION_ANGLES[acc.angle]] += param;
      return acc;
    }

    if (Object.keys(DIRECTION_SHORTCODES).includes(op)) {
      const direction = getDirection(op);
      acc.movements[direction] += param;
      return acc;
    }

    if (op === 'L') {
      acc.angle -= param;

      if (acc.angle < 0) {
        acc.angle = 360 - (Math.abs(acc.angle) % 360);
      }

      return acc;
    }

    if (op === 'R') {
      acc.angle += param;

      if (acc.angle >= 360) {
        acc.angle = 0 + (acc.angle % 360);
      }

      return acc;
    }

    return acc;
  }, {
    movements: {
      [DIR.EAST]: 0,
      [DIR.SOUTH]: 0,
      [DIR.WEST]: 0,
      [DIR.NORTH]: 0,
    },
    angle: 0,
  });

  const xMove = Math.abs(movements[DIR.EAST] - movements[DIR.WEST]);
  const yMove = Math.abs(movements[DIR.NORTH] - movements[DIR.SOUTH]);

  return xMove + yMove;
}

const goB = (input) => {
  const {coords} = input.reduce((acc, { op, param }) => {
    if (op === 'F') {
      acc.coords.x += acc.waypoint.x * param;
      acc.coords.y += acc.waypoint.y * param;
      return acc;
    }

    if (Object.keys(DIRECTION_SHORTCODES).includes(op)) {
      const direction = getDirection(op);
      const factor = DIR_FACTOR[direction];

      if (direction === DIR.EAST || direction === DIR.WEST) {
        acc.waypoint.x += param * factor;
      } else { 
        acc.waypoint.y += param * factor;
      }

      return acc;
    }

    if (op === 'L') {
      const [newX, newY] = rotate(acc.waypoint.x, acc.waypoint.y, -param);

      acc.waypoint.x = newX;
      acc.waypoint.y = newY;

      return acc;
    }

    if (op === 'R') {
      const [newX, newY] = rotate(acc.waypoint.x, acc.waypoint.y, param);

      acc.waypoint.x = newX;
      acc.waypoint.y = newY;

      return acc;
    }

    return acc;
  }, {
    coords: {
      x: 0,
      y: 0,
    },
    waypoint: {
      x: 10,
      y: 1,
    },
  });

  return Math.abs(coords.x) + Math.abs(coords.y);
}

/* Tests */

test(goA(prepareInput(`F10
N3
F7
R90
F11`)), 25);

test(goB(prepareInput(`F10
N3
F7
R90
F11`)), 286);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
