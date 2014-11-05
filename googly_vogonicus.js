/*
 * Vogon Poetry: Use Google Suggest to generate a 50,000 word 
 * epic poem.
 */

var seed = 'Vogon';
var verbProbability = 0.6;
var stanzaLines = 2;

var sleep = require('sleep');
var request = require('request');
var verb = require('./lib/verb.js');
var lineCount = 0;

var wordCount = 0;

function main() {
  getLine(seed, writeLine);
}

function writeLine(line) {
  lineCount += 1;
  if (lineCount % stanzaLines === 0) {
    console.log();
  }
  wordCount += line.split(' ').length;
  if (wordCount < 1000) {
    console.log(line);
    sleep.sleep(1);
    seed = getSeed(line);
    getLine(seed, writeLine);
  }
}

function getLine(seed, callback) {
  var url = 'http://google.com/complete/search?client=chrome&q=' + seed;
  request.get({url: url, json: true}, function(err, resp, data) {

    // sort suggestions by their length, and get the longest one
    var phrases = data[1];
    phrases.sort(function(a, b) {
      aLen = a.split(" ").length;
      bLen = b.split(" ").length;
      if (aLen > bLen) {
        return 1;
      } else if (aLen < bLen) {
        return -1;
      } else {
        return 0;
      }
    });

    if (phrases.length === 0) {
      return;
    }

    var line = phrases.pop();

    line = line.replace(RegExp(data[0] + ' '), '');

    if (Math.random() > verbProbability) {
      line = verb() + " " + line;
    }

    // remove some things
    var words = line.split(' ');
    remove(words, 'lyrics'); 
    remove(words, 'mp3'); 
    line = words.join(' ');

    callback(line);
  });
}

function getSeed(text) {
  var words = text.split(' ');
  if (words.length > 1) {
    i = Math.floor(Math.random() * (words.length - 2)) + 1;
    return words.slice(i, i + 2).join(' ');
  }
  return null;
}

function remove(a, s) {
  var i = a.indexOf(s);
  if (i > -1) {
    a.splice(i, 1);
  }
}

if (require.main === module) {
  main();
}
