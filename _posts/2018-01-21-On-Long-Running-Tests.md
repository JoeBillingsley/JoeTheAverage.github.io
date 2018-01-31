---
layout: post
title: On Long Running Tests
category: research
tags: [research, practical, mistakes]
---

For around the last two months I've been running some tests evaluating a bunch of different algorithms and seeing how they perform when subjected to a range of challenging tests. The aim: to see where they fail, where they succeed and get some ideas of how to improve them.

When we first started I thought it would take me around 2 weeks to implement the algorithms, run the tests, analyse them and write up the first draft of a paper. Now 2 months later, with a week till the deadline, I'm working every hour to try and wrap it all up before the times up. Still, they say you learn more from failure than success and recently I have learnt a lot...

## Lesson 1: It'll take longer than you think

> Hofstadter's Law: It always takes longer than you expect, even when you take into account Hofstadter's Law. — Douglas Hofstadter

I've written software before. I don't know why I thought it would be any different in research. It all seemed so clean and simple on the neatly laid out papers I'd read but of course theres always hidden details. Little details that are missing from the paper, parameters to tune and then the usual issues trying to get angry segments of code from different libraries to play nicely with each other.

After two weeks everything is at the point that it *seems* to be working nicely. I write a test runner and set it off then head home. The next day I come into work ready to sit down and analyse my crisp new data and I meet:

<div class="code">>Segmentation fault (core dumped)</div>

Not the greatest start to the morning.

### Lesson 2: Your time is more important than the computers

Due to the mysterious error only around 1% of my tests had run. After a bit of poking about I found there was a memory leak somewhere in the library I was using. I had two options:

1. Trace the memory leak through the labyrinthian codebase that is the library, eventually tracking it to it's source plugging it and then spend the next few days squashing the numerous bugs that come crawling out...
2. OR modify my program to take instructions for which test to run, write another program to make it run each test in sequence and then let the operating system clean up the memory each time

I don't regret my decision. The new code is slower and likely at some point I'll have to deal with the memory leak but it saved me days of work so for now my hacky code will do.

## Lesson 3: Gather as much data as you can

The end of the day comes and I've still not got any data to analyse but I set the updated test script running and go home.

The next day I come into work ready to sit down and analyse my crisp new data and I meet:

<div class="code">> Progress: 8%</div>

Huh.

Turns out that running thousands of tests was going to take the computer a little longer than I thought. After nearly a week reading papers we get to Thursday night and the tests are at roughly 95% completion.

The next day I come into work ready to sit down and analyse my crisp new data...

...and it's worked!

I spend the day looking through my data, making notes and trying to make sense of it all but as I go I find myself with more questions than answers. What does this population look like? Does this change over time? This other metric could be useful...

And if I want this data? I need to run all the tests again.

## Lesson 4: Run small batches

Another week of reading and I have the new data, followed by another day of trying to make sense of it all. With the complete data some things are much clearer but others just don't fit. Algorithms are acting oddly and I'm getting back some wonky measurements.

Poking around the code my deepest fears are realised - numerous tiny bugs are crawling all throughout my code. A less than sign which should be a greater than sign. Updating the wrong array. Forgetting to set the value of a parameter.

Each time I squashed a set of bugs I'd think that finally, that was the last of them and I'd start the tests off again. Each time the tests would run a bit faster and each time I'd eventually realise there was *still something wrong*.

I repeated this cycle for far longer than I should have. Eventually I realised that I should **just run less tests**.

## Lesson 5: Save your parameters

Finally, not long ago I finally had all of the data collected from several batches and I was feeling fairly confident in it. Some of it was consistent with my expectations, some of it was suprising but it all seemed reliable.

Then I started to write up the paper and I needed to include the parameters I'd used. Now I could grab the parameters from the code, but over all of these different batches and all my fiddling and bug fixing and analysis, are these still the ones I actually used?

There was only one way to be sure: one more run.

<hr>

I've now got my process down pretty well. With a bit of optimisation and parallelisation I can now run all the tests in around 2 days instead of 6. When I run the tests I put a copy of the current configuration in with the results as well as a copy of the built version of the program, any resources it needs and finally the test script so I can reproduce the tests later if I need to.

It took a lot of mistakes to get to this point, mistakes I don't plan on making again. To anyone else who finds themself in my position one day - remember where I went wrong and good luck!