// require dependencies
const fs = require('fs');
const path = require('path');
const yargs = require('yargs'); //`npm i yargs` -- > update package.json + node_module

// declare constants
const ENTRIES_PATH = 'entries.json';

const argv = yargs
  .command('all', 'print all entries to the console')
  .command('read', ' print a single key/value pair to the console , use ex : read -k [key]', {
    key: {
      description: 'the key to read ',
      alias: 'k',
      type: 'string',
    }
  })
  .command('write', ' write <key> <value>set the given key / value pair ex: write -k [key] -v [value]', {
    key: {
      description: 'the key to write ',
      alias: 'k',
      type: 'string',
    },
    value: {
      description: 'the value to write ',
      alias: 'v',
      type: 'string',
    }
  }
  )
  .command('delete', 'delete <key>remove the entry with this key ex: delete -k [key]',
    {
      key: {
        description: 'the key to delete ',
        alias: 'k',
        type: 'string',
      }
    })
  .help()
  .alias('help', 'h')
  .argv;


if (argv._.includes('all')) {
  console.log('reading all enteries ...');
  fs.readFile(path.join(__dirname, ENTRIES_PATH), 'utf-8',
    (err, contents) => {
      if (err) throw err;
      console.log(contents);
      process.exit(0);
    });
}

// read -k [key]
if (argv._.includes('read')) {
  if (argv.key === undefined) {
    console.log("A key is needed");
    process.exit(0);
  }
  console.log('reading enteries ...');
  fs.readFile(path.join(__dirname, ENTRIES_PATH), 'utf-8',
    (err, contents) => {
      if (err) throw err;
      console.log(contents);
      const parsedContent = JSON.parse(contents);
      if (parsedContent[argv.key]) {
        console.log('value is = ' + parsedContent[argv.key]);
        process.exit(0);
      }
      else {
        console.log('No such a key found  ...');
        process.exit(0);

      }
    });
}
//write -k [key] -v [value]
if (argv._.includes('write')) {
  if (argv.key === undefined) {
    console.log("A key is needed");
    process.exit(0);
  }
  if (argv.value === undefined) {
    console.log("A value is needed");
    process.exit(0);
  }
  fs.readFile(path.join(__dirname, ENTRIES_PATH), function readFileCallback(err, data) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      obj = JSON.parse(data); //now it an object
      console.log(obj);
      obj[argv.key] = argv.value; //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile(path.join(__dirname, ENTRIES_PATH), json, 'utf8', (err) => {
        if (err)
          throw err;
        console.log(json);
        console.log('insertion completed..');
      }); // write it back 
    }
  });

}
// delete -k [key]

if (argv._.includes('delete')) {
  if (argv.key === undefined) {
    console.log("A key is needed");
    process.exit(0);
  }
  console.log('delete an entry ...');
  fs.readFile(path.join(__dirname, ENTRIES_PATH), 'utf-8',
    (err, contents) => {
      if (err) throw err;
      const parsedContent = JSON.parse(contents);
      if (parsedContent[argv.key]) {
        delete parsedContent[argv.key];
        console.log(parsedContent);
        const toWrite = JSON.stringify(parsedContent, null, '  ');
        //now write the data again
        fs.writeFile(path.join(__dirname, ENTRIES_PATH), toWrite, (err) => {
          if (err)
            throw err;
          console.log("deletion finished...");
        })
      }
      else {
        console.log('No such a key found to delete ...');
        process.exit(0);

      }

    });
}



/*A summary of elements used in the program:

    argv: This is the modified process.argv which
    we have configured with yargs.
    command(): This method is used to add commands,
     their description and options which are specific to
     these commands only, like in the above code lyr is the
     command and -y
    is lyr specific option: node myapp.js lyr -y 2016
    option(): This method is used to
    add global options(flags) which can be accessed by all
    commands or without any command.
    help(): This method is used to display a help dialogue
    when --help option is encountered which contains description
    of all the commands and options available.
    alias(): This method provides an alias name to an option,
    like in the above code both --help and -h triggers the help dialogue.
*/