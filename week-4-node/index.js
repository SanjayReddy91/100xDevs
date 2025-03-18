const chalk = require('chalk');

console.log(chalk('Hello, world!').blue);
console.log(chalk('This is an error message.').red.bold);
console.log(chalk('This is a success message.').green.underline);