const program = require("commander");
const fs = require("fs");
const seeder = require("./src/seeders/all");

program
  .option("-s, --seed [filename]", "Seed your database or collection")
  .option("-t, --truncate [filename]", "Truncate your database or collection")
  .parse(process.argv);

if (program.seed === true) {
  seeder.up();
}

if (typeof program.seed === "string") {
  const filename = program.seed.replace(".js", "");
  const seederPath = `./src/seeders/${filename}.js`;

  if (fs.existsSync(seederPath)) {
    const seeder = require(seederPath);
    seeder.up();
  } else {
    console.log(`${program.seed} is not exist`);
  }
}

if (program.truncate === true) {
  seeder.down();
}

if (typeof program.truncate === "string") {
  const filename = program.truncate.replace(".js", "");
  const seederPath = `./src/seeders/${filename}.js`;

  if (fs.existsSync(seederPath)) {
    const seeder = require(seederPath);
    seeder.down();
  } else {
    console.log(`${program.seed} is not exist`);
  }
}
