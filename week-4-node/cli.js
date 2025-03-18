const { Command } = require('commander');
const program = new Command();
const fs = require('fs');

program
  .name('word-count-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program
  .argument('<string>', 'path to file')
  .action((str) => {
    fs.readFile(str,"utf-8", (err, data) => {
        if (err) {
            console.log("Error while reading file");
        } else {
            console.log("You have " + data.split(" ").length +" words in this file.");
        }
    })
  });

program.parse();