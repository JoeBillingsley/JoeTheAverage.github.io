---
layout: post
title: NFV - Why It's Tricky
excerpt: Turns out automating a telecommunications network is not as easy as it sounds... 
category: research
series: network function virtualisation for normal people
tags: [phd, research, plain-english, nfv, nfv-ra, moo]
---

In [my last post](Network-Function-Virtualisation-for-Normal-People) I explained what network function virtualisation is and how it relates to my PhD. Ultimately it comes down to finding the best configuration of virtual network functions on a group of servers. I described it like placing books on a shelf in a library where we want everyone to find the books they want, whilst minimising the number of shelves we use.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/books_full.png" alt = "A diagram of a book shelf filled with books">

At first glance it might not seem like a particularly difficult problem. There are a limited number of different configurations. All we really have to do is to look at all of the possible of virtual network functions and decide which one is the best. Doesn't seem like it should really take three or more years to solve.

So before people ~~realise~~ think I'm just going to be lounging around for the next few years I want to explain the three things that make the problem tricky: the number of choices, the short time we're allowed to find them and the difficult of defining 'best'.

### Combinatorial Explosion
Say we wanted to find the best configuration of those books on a shelf by looking at all of the possible configurations. If we had 1 book and 2 shelves then how many different configurations of books on shelves are there?

[One book, 1 shelf]

Two. The book could go on either shelf. And for two books and two shelves:

[Two book, two shelves case]

Four. Both books on either shelf or each book on a different shelf.

Simple enough when they are only a few books or shelves to consider but what about for any number of books or shelves?

Here's another way to look at this. Say that every time we make a decision about where to put a book an alternate timeline spawns where we made each of the other choices.

For three books and two shelves this would look like:

[Two book two shelves case]

We can see that over all of the timelines we have reached all of the configurations. If we have more shelves then we have more options at each step. And if we have more books then we have to make more decisions. Each time we make a decision, the number of timelines or configurations is multiplied by the number of shelves. More formally:

<p class="tab math">number of configurations = number of shelves ^ number of books</p>

If we swap out books for virtual network functions and shelves for services we get something very near to the NFV-RA problem. In the real NFV-RA problem we can scale resources but roughly:

<p class="tab math">number of configurations = number of servers ^ number of virtual network functions</p>

In fact we can generalise this to:

<p class="tab math">number of configurations = number of options ^ number of decisions</p>

For a real world problem we will likely need to provision resources across tens of thousands of servers then for a small number of services we 

The number of possible configurations increases exponentially fast as the number of decisions goes up. This is called a combinatorial explosion and it's annoyingly common in computer science. When you see that kind of equation we know that the number of combinations that we have to examine will quickly get so large than even the fastest computers cannot manage. The only way to solve this kind of problem is to get a bit clever about deciding which solutions to examine.

### Reaction Time
Modern computers are fast but we don't have long to spend finding a configuration. 

As I touched on in [part one]() the faster we can find a configuration the less we have to worry about how accurate our predictions, because it's easier to fix a mistake. For critical services most mobile network providers target 'five nines' availability. This means that a service should be available 99.999% of the time or it's allowed to be down at most 5.26 minutes or 315.6 seconds a year. This means if our service were to make a serious misestimation in demand that would make a service unavaiable for a percentage of customers we would have less than 6 minutes to find a new good configuration.

In actuality this is our upper bound. If we allocate resources to match the demand as closely as possible then our estimates are always going to be a little imperfect. An ideal system would be able to match subtle changes in demand to ensure a consistently high quality of service and minimise the resources required.

### What is a 'good' configuration anyway?
If we were dealing with a very small problem then we could find all of the possible configuration. The question then is what makes one configuration better than another?

First we need a way to measure a configuration. Ideally we'd have an accurate model that we could give a configuration and it would tell us how well different services would perform and how much energy it would use.

[Image of one configuration being better than another]

Certainly we should prefer a configuration that performs better for all services and is more energy efficient.

But what about if we had a choice between a configuration that performs well but is less energy efficient? Or a configuration that improves quality of service for one service but damages another?

If we get rid of all of the configurations for which there is another configuration that is strictly better than it in all aspects we end up a set of configurations that are incomparable to each other. We call these configurations the 'pareto optimal set'.

This set will contain the case where we turn all of the servers off (the most energy efficient) and the case where we turn all of them on and fill all of them with a single service (the most performant for that service) and every good configuration in between.

Without any more information a computer has no idea which configuration to pick as to it all of them appear equally good. Most of the time in computer science when we've got lots of configurations like this we either pick one at random or give them all to a human expert to decide amongst.

For our problem neither of those options are acceptable. The set of optimal configurations contains so many configurations a human would never approve of it's too risky. And we can't rely on there always being an expert to decide what configuration to pick or rely on them being fast enough for their decision to still be useful. What we need is to be able to learn the sort of configurations an expert would make so that we can write a program that does them the same.

<hr>

So to solve NFV-RA we need to write a program that can find a configuration from a practically infinite set of choices in as short a time as possible that an expert would be happy with. This might take a while...