---
layout: post
title: NFV - Why It's Tricky
excerpt: Why automating a telecommunications network is not as easy as it sounds.
category: research
series: network function virtualisation for normal people
tags: [phd, research, plain-english, nfv, nfv-ra, moo]
---

In [my last post](Network-Function-Virtualisation-for-Normal-People) I explained what network function virtualisation is and how it relates to my PhD. Basically the aim is to find the best configuration of virtual network functions for a group of servers. I described it like placing books on a shelf in a library where we want everyone to find the books they want, whilst minimising the number of shelves we use.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/books_full.png" alt = "A diagram of a book shelf filled with books">

At first glance it might not seem like a particularly difficult problem. There are a limited number of different configurations. All we really have to do is to look at all of the possible of virtual network functions and decide which one is the best. Doesn't seem like it should really take three years to do...

So before people ~~realise~~ think I'm just going to be lounging around for the next few years I want to explain the three things that make the problem tricky: the number of choices, the short time we're allowed to find them and the difficulty of defining 'best'.

### Combinatorial explosion
Say we wanted to find the best configuration of those books on a shelf by looking at all of the possible configurations. If we had 1 book and 2 shelves then how many different configurations of books on shelves are there?

[One book, 1 shelf]

Two. The book could go on either shelf. And for two books and two shelves:

[Two book, two shelves case]

Four. Both books on either shelf or each book on a different shelf.

Simple enough when they are only a few books or shelves to consider but what about for any number of books or shelves?

If we make a graph of the decisions it becomes pretty clear. For each decision we can make we'll draw a different branch so that the bottom of the graph will have all of the possible configurations.

For three books and two shelves this would look like:

[Two book two shelves case]

Looking at this graph you might notice two things. If we have more shelves then we have more options at each step. And if we have more books then we have to make more decisions. So for each book the number of possible configurations is multiplied by the number of shelves. More formally:

<p class="tab math">number of configurations = number of shelves ^ number of books</p>

If we swap out books for virtual network functions and shelves for services we get something very near to the NFV-RA problem. It's not exactly the same but more or less the number of configurations is:

<p class="tab math">number of configurations = number of servers ^ number of virtual network functions</p>

In fact we can generalise this to:

<p class="tab math">number of configurations = number of options ^ number of decisions</p>

The number of possible configurations increases exponentially fast as the number of decisions increases. This is called combinatorial explosion and it's annoyingly common. You'll see the same thing for the number of decisions in chess or if your trying to plan a route to many cities. When you see that kind of equation we know that the number of combinations that we have to examine will quickly get so large than even the fastest computers couldn't examine every option in a reasonable time*. The only way to solve this kind of problem is to get a bit clever about deciding which solutions to examine.

### Reaction time
Modern computers are fast but we don't have long to spend finding a configuration. If we want to minimise the resources used whilst ensuring a consistently high quality of service the algorithm needs to be able to match demand as closely as possible.

But network traffic can be unpredictable. Any major event - like a breaking news story, natural disaster or a popular TV show finishing - could result in a surge in people using the network. The system would need to be able to reconfigure the network as quickly as possible.

To put a figure on it most mobile network providers target 'five nines' availability. This means that a service should be available 99.999% of the time or it can't be down more than 5.26 minutes or 315.6 seconds a year. So even if we surprised only once a year we would have less than 6 minutes to find and transition to a new good configuration.

### What is a 'good' configuration anyway?
If we were somehow able to find all of the possible configuration the next question is which one to choose?

If we took two configurations and one was better than the other in all objectives: it was more energy efficient and provide better quality of service then it's an easy pick.

But what about if we had a choice between a configuration that performs well but is less energy efficient than another? Or a configuration that improves quality of service for one service but harms another?

If we get rid of all of the configurations for which there is another configuration that is strictly better than it we end up a set of configurations we call 'Pareto optimal'. For these configurations, any change that improves any of the objectives will make at least one other one worse.

This set will contain the case where we turn all of the servers off (the most energy efficient) and the case where we turn all of them on and fill them with a single service (the most performant for that service) and every good configuration in between. Without any more information we can't say which configuration to pick as they all appear equally good. Most of the time when we've got lots of choices like this we either pick one at random or give them all to a human expert to decide amongst.

For our problem neither of those options are acceptable. Choosing one at random is risky because intuitively we know that some configurations are probably better than others. But we can't rely on there always being an expert to decide what configuration to pick or rely on them choosing a configuration fast enough that their decision is still useful. If only we could virtualise the expert somehow...

### Not as easy as it sounds
So to solve NFV-RA we need to write a program that can find a configuration that a human expert would choose, from a practically infinite set of choices and in as short a time as possible. It is I believe, going to be rather tricky.

<hr>

\* If your still not convinced here's some very rough maths:

An average data centre will have in the region of 10,000 servers <sup>[1]</sup>.<br/>
I'll make an educated guess at 40 different network functions.<br/>
Plugging that into our equation would give us 1x10^160 combinations or 1 followed by 160 zeros.<br/>
The fastest supercomputer in the world at the moment, the Sunway TaihuLight, can do roughly 1.254x10^17 <sup>[2]</sup> floating point operations in a second.<br/>
So if we assume that each combination could be evaluated in a single floating point operation (they can't) and the supercomputer could run at max capacity for as long as needed (it can't) it would take only... 2.527x10^133 centuries or 1.83 followed by 125 zeros, times longer than the universe has existed up to now.

<p>
[1] Smith, M (2013). <i>How many servers does a typical data center house?</i>. Quora. Available at: <a href="https://www.quora.com/How-many-servers-does-a-typical-data-center-house">www.quora.com/How-many-servers-does-a-typical-data-center-house</a> [Accessed 25/07/2017]
</p>

<p> 
[2] <i>Statistics Sublist Generator</i>. TOP500. Available at: <a href="https://www.top500.org/statistics/sublist/">www.top500.org/statistics/sublist/</a> [Accessed 25/07/2017] 
</p>