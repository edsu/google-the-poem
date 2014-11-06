/*
 * Vogon Poetry: Use Google Suggest to generate a 50,000 word 
 * epic poem.
 */

var seed = 'Vogon';
var seed = 'воген';
var language = 'ru'; // an ISO 639-1 code
var verbProbability = 0.6;
var stanzaLines = 2;
var poem = '';
var maxWords = 50000;

var sleep = require('sleep');
var request = require('request');
var verb = require('./lib/verb.js');
var lineCount = 0;

var wordCount = 0;

function main() {
  getLine(seed, writeLine);
}

/*
 * write a line in the poem
 */

function writeLine(line) {
  // if we didn't get a suggestion try again
  if (line == null && wordCount < maxWords) {
    getLine(getSeed(poem), writeLine);
  } 

  // otherwise write the line  
  else {
    // write the line in the poem
    console.log(line);
    poem += line + " ";

    // add a stanza break
    lineCount += 1;
    if (lineCount % stanzaLines === 0) {
      console.log();
    }

    // write more lines?
    wordCount += line.split(' ').length;
    if (wordCount < maxWords) {
      sleep.sleep(1);
      getLine(getSeed(line), writeLine);
    }
  }
}

/*
 * creates a new line in the poem based on the last
 */

function getLine(seed, callback) {
  var url = 'http://suggestqueries.google.com/complete/search?client=chrome&hl=' + language + '&q=' + seed;
  request.get({url: url, json: true}, function(err, resp, data) {
    var phrases = data[1];

    // if we don't have any suggestions try again with another seed
    if (phrases.length === 0) {
      return callback(null);
    }

    // sort suggestions by their length, and get the longest one
    var line = phrases.pop();

    // remove the seed from the text
    line = line.replace(RegExp(data[0] + ' '), '');

    // randomly add a verb
    line = addVerb(line);

    // remove some repetitive things
    line = remove(line);

    callback(line);
  });
}

/*
 * finds a random pair of words in some phrase. if the phrase is 
 * just a single word that word is returned.
 */

function getSeed(text) {
  var words = text.split(' ');
  var seed = text;
  if (words.length > 1) {
    var i = Math.floor(Math.random() * words.length)
    seed = words.slice(i, i + 1);
  }
  return seed;
}

/*
 * remove some repetitive words
 */

function remove(line) {
  words =  line.split(' ');
  newWords = [];
  removeWords = ['lyrics', 'mp3'];

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var found = false;
    for (var j = 0; j < removeWords.length; j++) {
      if (word == removeWords[j]) {
        found = true;
      }
    }
    if (! found) {
      newWords.push(word);
    }
  }

  return newWords.join(' ');
}

function longest(l) {
  // returns the longest string in a list of strings
  max = 0;
  for (var i = 1; i < l.length; i++) {
    if (l[i].length > l[max].length) {
      max = i;
    }
  }
  return l[max];
}

function addVerb(line) {
  if (Math.random() > verbProbability) {
    var words = line.split(' ');
    var pos = Math.floor(Math.random() * words.length);
    words.splice(pos, 0, verb());
    line = words.join(' ');
  }
  return line;
}

if (require.main === module) {
  main();
}
