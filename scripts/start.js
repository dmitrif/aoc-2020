const { spawn, execSync } = require("child_process")
const { readdirSync } = require("fs")
const { cp } = require("shelljs")

const SESSION = process.env.ADVENT_SESSION;

const day = process.argv[2]
const days = readdirSync("./src")

if (!days.includes(day)) {
  const dayNum = day.replace('day', '');
  console.log(`Creating file structure for ${day}...`)
  cp("-r", "src/template", `src/${day}`)

  execSync(`curl -b 'session=${SESSION}' https://adventofcode.com/2020/day/${dayNum}/input > src/${day}/input.txt`);
}

spawn("nodemon", ["-x", "ts-node", `src/${day}/index.ts`], {
  stdio: "inherit",
})
