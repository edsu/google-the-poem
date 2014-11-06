# Googly Vogonicus

Googly Vogonicus is an epic alien poem generated from Google's [auto-complete](https://support.google.com/websearch/answer/106230?hl=en). I found the source code on a USB stick in the smoking remains of a [Vogon](https://en.wikipedia.org/wiki/Vogon) battleship, named the Aspargus Turbine in Rushville, Nebraska. It seems to have been some kind of failed experiment to communicate with the human race via the one remaining fully public free web service API offered by Google.

I know, I had no idea aliens independently evolved JavaScript! Or maybe they
learned it from old TV episodes that were beamed into space. It's not really
clear what happened, or how their fire-proof USB sticks were interoperable with
OS X. Perhaps this is a stunt, and I have been duped. Now that I think about it,
this seems very likely.

At any rate, Googly Vogonicus is also my entry for [NaNoGenMo](https://github.com/dariusk/NaNoGenMo/issues/85). I guess this amounts to plagiarism. I apologize for this. You can see a more dynamic version of this poem on the [World Wide Web](http://inkdroid.org/vogon).

## Run

    npm install
    node googly_vogonicus.js > poem.txt

## Configure

Not much thought has gone into usability, but you can play with the `seed`,
`language`, `verbProbability` and `stanzaLines` variables at the top of 
`googly_vogonicus.js` if you want to experiment. Pull requests are welcome.

