const request = require('request');
const fs = require('fs');
const readline = require('readline');
const { stdin } = require('process');
const args = process.argv.slice(2);
const URL = args[0];
const fileName = args[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const writeToFile = (fileName, body) => {
  fs.writeFile(fileName, body, err => {
    if (err) {
      console.error(err);
    }
    console.log(`Downloaded and saved ${body.length} bytes to ${fileName}`)
    process.exit();
  })
}


request(URL, (error, response, body) => {
  console.log("error: ", error); // Prints out an error if one occurs
  console.log("statuscode: ", response && response.statuscode) // prints out the response and the statuscode of the response
  console.log("body: ", body); // prints the HTML for the requested webpage
  fs.stat(fileName, (error, stats) => {
    if (error) {
      console.log("File does not exist.")
      // Call function to write to file
      writeToFile(fileName, body)
      return;
    }
    console.log("File does exist");
    // if yes, call function to write file, if no then exit
    rl.question("This file already exists, would you like to overwrite it? Y/N", (answer) => {
      if (answer === 'n'||answer ==='N') {
        console.log("File will not be overwritten.")
        process.exit();
      } else {
        writeToFile(fileName, body);
      }
    })
  })
});