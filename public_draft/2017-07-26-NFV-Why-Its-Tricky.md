---
layout: post
title: NFV - Why It's Tricky
excerpt: Why automating a telecommunications network is not as easy as it sounds.
category: research
series: network function virtualisation for normal people
tags: [phd, research, plain-english, nfv, nfv-ra, moo]
---

In [my last post](Network-Function-Virtualisation-for-Normal-People) I explained what network function virtualisation is and how it relates to my PhD. Basically the aim is to find the best configuration of virtual network functions on a network. I described it like placing books on a shelf in a library where we want everyone to find the books they want, whilst minimising the number of shelves we use.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-07-26-NFV-Why-Its-Tricky/books_good_config.png" alt = "A diagram of two book shelves filled with books">

At first glance it might not seem like a particularly difficult problem. There are a limited number of different configurations. All we really have to do is to look at all of the possible of virtual network functions and decide which one is the best. Doesn't seem like it should really take three years...

So before people ~~realise~~ think I'm just going to be lounging around for the next few years I want to explain the three things that make the problem tricky: the number of choices, the short time we're allowed to find them and the difficulty of defining 'best'.

### Combinatorial explosion
Say we wanted to find the best configuration of those books on a shelf by looking at all of the possible configurations. If we had 1 book and 2 shelves then there are two possible configurations. The book could go on either shelf.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-07-26-NFV-Why-Its-Tricky/1books_2shelves.png" alt = "A diagram showing the possible configurations of a book on two shelves.">

And for two books and two shelves there's four configurations. Both books on either shelf or each book on a different shelf.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-07-26-NFV-Why-Its-Tricky/2books_2shelves.png" alt = "A diagram showing the possible configurations of two books on two shelves.">

Simple enough when they are only a few books or shelves to consider but what about for 100 shelves or a 1000 books?

When we place the first book the number of possible configurations is the same as the number of shelves because the book can go on any shelf. For the second book, the book can go on any of the shelves **for all of the previous configurations**. Then again for the third and the fourth and the fifth...

On a graph for three books and two shelves this looks like@

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-07-26-NFV-Why-Its-Tricky/graph.png" alt = "A diagram showing the possible configurations of three books on two shelves.">

So if we have more shelves then we have more options at each step. And if we have more books then we have to make more decisions. For each book the number of possible configurations is multiplied by the number of shelves. More formally:

<p class="tab math">number of configurations = number of shelves ^ number of books</p>

If we swap out books for virtual network functions and shelves for services we get something close enough to the NFV-RA problem. The number of configurations is roughly:

<p class="tab math">number of configurations = number of computers ^ number of virtual network functions</p>

In fact we can generalise this to:

<p class="tab math">number of configurations = number of options ^ number of decisions</p>

The number of possible configurations increases exponentially fast as the number of decisions increases. This is called a combinatorial explosion and it's annoyingly common in computer science. You'll see the same thing for the number of decisions in chess or if your trying to plan a route to many cities. When you see that kind of equation we know that the number of combinations that we have to examine will quickly get so large than even the fastest computers couldn't examine every option in a reasonable time*. The only way to solve this kind of problem is to get a bit clever about deciding which solutions to examine.

### Reaction time
Modern computers are fast but we don't have long to spend finding a configuration. If we want to minimise the resources used whilst ensuring a consistently high quality of service the algorithm needs to be able to match demand as closely as possible. If we can predict the traffic we can give ourselves a bit more time.

But network traffic can be unpredictable. Any major event - like a breaking news story, natural disaster or a popular TV show finishing - could result in a surge of demand on the network that could make services unavailable. To maintain a good quality of service in all situations the network needs to be able to react at least as fast as the demand can change.

To put a figure on it, networks target 'five nines' availability for critical services. This means that a service should be available 99.999% of the time or it can't be down more than 5.26 minutes or 315.6 seconds total, a year. So even if we are only surprised once a year then we have less than 6 minutes to find and transition to a new good configuration.

### What is a 'good' configuration anyway?
If we were somehow able to find all of the possible configuration the next question is which one to choose?

Say we had two configurations to choose from and one was more energy efficient and ensured better quality for all services. It's an easy pick because one is strictly better than the other.

But what about if we had a choice between a configuration that performs well but is less energy efficient than another? Or a configuration that improves quality of service for one service but harms another?

If we get rid of all of the configurations for which there is another configuration that is strictly better than it we end up a set of configurations we call 'Pareto optimal'. For these configurations, any change that improves any of the objectives will make another objective worse.

This set will contain the case where we turn all of the servers off (the most energy efficient) and the case where we turn all of them on and fill them with a single service (the most performant for that service) and every good configuration in between. Without any more information we can't say which configuration to pick as they are arguably equally good. Most of the time when we've got lots of choices like this we either pick one at random or give them all to a human expert to decide amongst.

For our problem neither of those options are acceptable. Choosing one at random is risky because intuitively we know that some configurations are probably better than others. But we can't rely on there always being an expert to decide what configuration and if we do involve a human they are bound to be the slowest part of our system. We're going to need something a bit more intelligent to solve this problem.

### Not as easy as it sounds
So to solve NFV-RA we need to write a program that can find a configuration that a human expert would choose from a practically infinite set of choices and in as short a time as possible. It is, I believe, going to be rather tricky.

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