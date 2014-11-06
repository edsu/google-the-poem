/*
 * Vogon Poetry: Use Google Suggest to generate a 50,000 word 
 * epic poem.
 */

var sleep = require('sleep');
var request = require('request');
var winston = require('winston');
var verb = require('./lib/verb.js');

/*
 * You can modify these variables to change the behavior.
 */

var seed = 'Vogon';        // the word to use to start the poem
var language = 'en';       // an ISO 639-1 code
var t = .5 * 1000000;       // microseconds to sleep between google requests
var stanzaLines = 2;       // how many lines per stanza
var maxWords = 50000;      // length of the poem in words
var verbProbability = 0.6; // percentage of time to add a random verb

/* 
 * Don't modify these :)
 */

var poem = '';
var lineCount = 0;
var wordCount = 0;
var lastLine = null;

/*
 * deep breath
 */

function main() {
  winston.add(winston.transports.File, {filename: 'googly_vogonicus.log'});
  winston.remove(winston.transports.Console);
  getLine(seed, writeLine, t);
}

/*
 * write a line in the poem
 */

function writeLine(line) {
  // if we didn't get a suggestion try again using the poem as seed text
  if (line == null && wordCount < maxWords) {
    winston.warn("ran out of suggestions, using poem as seed");
    getLine(getSeed(poem), writeLine, t * 2);
  } 

  // if we start to repeat ourself get a new seed from the poem
  if (line == lastLine) {
    winston.warn("got repeat", {line: line});
    getLine(getSeed(poem), writeLine, line * 2);
  }

  // otherwise write the line  
  else {
    console.log(line);
    winston.info("wrote line", {line: line});

    // remember the entire text of the poem in case we need it for seed text
    poem += line + " ";

    // add a stanza break
    lineCount += 1;
    if (lineCount % stanzaLines === 0) {
      console.log();
    }

    // write more lines?
    wordCount += line.split(' ').length;
    if (wordCount < maxWords) {
      getLine(getSeed(line), writeLine, t);
    }
  }
}

/*
 * creates a new line in the poem based on the last
 */

function getLine(seed, callback, t) {
  winston.info("sleeping for " + t);
  sleep.usleep(t);
  var url = 'http://suggestqueries.google.com/complete/search?client=chrome&hl=' + language + '&q=' + seed;
  request.get({url: url, json: true}, function(err, resp, data) {
    if (data.length != 5) {
      winston.error('unexpected results from google: ', {data: data});
      return getLine(seed, callback, t * 2);
    }

    var phrases = data[1];

    // if we don't have any suggestions try again with another seed
    if (phrases.length === 0) {
      winston.warn("no suggestions for seed", {seed: seed});
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
    seed = words[i];
  }
  winston.info("created seed", {seed: seed});
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
