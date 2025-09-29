
const { program } = require("commander");
const fs = require("fs");

program
  .option("-i, --input <path>", "input JSON file")
  .option("-o, --output <path>", "output file")
  .option("-d, --display", "display results in console")
  .option("-s, --survived", "only show survived passengers")
  .option("-a, --age", "show age of passengers");

program.parse(process.argv);
const options = program.opts();

// Перевірка вхідного файлу
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

// Читання файлу построково
const raw = fs.readFileSync(options.input, "utf8");
const lines = raw.trim().split("\n"); // розділити на рядки
let data = lines.map(line => JSON.parse(line));

// Обробка
if (options.survived) {
  data = data.filter(p => String(p.Survived) === "1");
}

let result = data.map(p => {
  let line = `${p.Name}`;
  if (options.age && p.Age !== undefined) {
    line += ` ${p.Age}`;
  }
  line += ` ${p.Ticket}`;
  return line;
});

// Вивід у консоль
if (options.display) {
  console.log(result.join("\n"));
}

// Запис у файл
if (options.output) {
  fs.writeFileSync(options.output, result.join("\n"), "utf8");
}

