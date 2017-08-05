---
layout: post
title: HCI, NFV, and SLAs - My PhD in Plain English
excerpt: ...or how I wish someone had explained it when I started.
category: research
tags: [phd, research, plain-english, nfv, nfv-ra]
---

I started a PhD recently. It's titled:

**Dynamic Resource Management and Optimisation for SLA Guarantees in Hyperconverged Communication Infrastructures**

Unless you've studied networking that was gibberish which is a shame because the ideas behind it are actually rather simple. In short I'm working on one of the technologies that will underpin next generation telecommunications networks. 

The internet is already integrated deeply into all our lives but soon it will be so common it will be invisible. The next generation of telecommunications networks will make internet access even more available, energy efficient, faster and all at lower cost. It will be the backbone supporting the next exciting developments in technology: the internet of things, smart factories, biosensors, machine to machine communication, self driving cars... and many other developments that will have a major impact on our lives in the next decade.

All this new technology brings new challenges for telecommunications networks. Up till now networks have only needed to provide a few generic services. Future technologies are going to need help from the network to be fast and reliable enough to function. Our current generation networks weren't designed with this in mind - they're inflexible - and if we want these new developments to happen we are going to need to turn them on their head.

### A bit of background
Often the best way of solving a difficult problem is to break it into smaller pieces. When people were first designing telecommunications networks that's exactly what they did. Every service a network can provide, like texts, calls or internet, can be split into several small tasks. For example when you send a text one task is to check whether your allowed to use the network, next to bill you and then finally send it too whoever you were texting.

Traditionally all of these tasks were run on specialised designed computers called *physical network functions*. These computers were designed to do one task very well. Then to provide a service all a company had to do was buy a computer for each task and connect them together in a chain.

When you make a request for a service, like make a call or send a text, your request ends up at one of these computers and gets passed through each one in the chain until it arrives where you wanted it to go.

Each network function can only process so many requests at a time. After that new requests are placed in a queue where they wait to be processed in the order that they arrived. So we can often make a service faster by connecting more of the same network functions in parallel. It's just like having more tills open at a supermarket. The more tills that are open, the less time you spend queuing. Similarly the more network functions that are available, the less time a request spends waiting to be processed.

Over the course of a day the number of people who want to use a service changes. After a particularly exciting episode of Game of Thrones, Love Island or Eastenders there might be thousands more phone calls being made than average.In order to provide a consistent service telecommunications companies have to buy enough physical network functions to handle even the busiest times.

If a company provides lots of services they have to make sure that each service can handle the busiest times. Different services might be busy at different times. Ideally when one service wasn't being used as much we could use the spare network functions for another service. With physical network functions this is not usually possible or convenient. Instead for every service we have to buy enough network functions for the busiest times of every service. But more physical network functions means higher operating costs in electricity, space, maintenance, cooling - all things telecommunication companies aren't keen on.

From the manufacturer perspective designing a new physical network function is a huge investment both in time and money. Whilst companies want to provide new services to differentiate themselves, manufacturers don't want to develop new network functions for a service that doesn't have widespread appeal. As a result innovation in this area has historically been very low.

But technology as a whole has been developing tremendously quickly and more and more of these new developments are dependant on access to the internet. The network that provides this access has started to fall behind. Physical network functions have been slowing things down. If telecommunications networks are going to catch up, physical network functions are going to have to go.

### Virtual Network Functions
This is where *Virtual network functions* come in. They do exactly the same thing that a physical network function does only with software. Virtual network functions, being virtual, need to run on a computer. Unlike physical network functions, virtual network functions don't need specialised computers. Instead we can run them on cheap, ordinary general purpose computers - just like the computer your reading this on only much, much more powerful. If we replace all of the specialised computers in the network with general purpose ones then we get a *hyperconverged communications infrastructure*.

If we want to deploy a service on a hyperconverged infrastructure we first have to install the different network functions on some of the computers. Each computer could have lots of network functions running on it. We need to instruct each computer how much of it's *resources* it should spend on each one. A resource is anything the computer has a limited amount of. So a resource could be how much of each second a computer should spend running a network function or more tangible things like storage space. To build a service we then just need to tell each computer how it should handle a request and where to send it next.

Virtual network functions have some **big** advantages over physical network functions:

1. **They're faster and cheaper to produce.** Writing good software is hard but once you've done it it's easy to make copies and send them to your customers. Physical network functions require a whole lot more investment and effort to manufacture, transport and maintain. Virtual network functions make innovation cheaper and not as risky.
2. **They can run on cheap infrastructure.** Part of the reason physical network functions were expensive is because they were so specialised. Now that we're just using software we can use the same mass produced computers that every other company uses for their IT.
3. **We can give resources to services dynamically.** Previously we could only make a service faster by buying more physical network functions. Now we can run virtual network functions on as few or as many computers as we want. This means we can decide how much resources we give to each service at any time. So if suddenly everyone decides to get off the internet and call each other instead, then we can take away resources from the internet service and give them to the phone service. Similarly when it get's late at night and very few people are using the network we can turn off most of the computers to save energy without affecting the quality of any services.

The clear winners here are the telecommunications companies who are going to save bucketloads of money, but there's more to it than just that. There's a huge amount of free information and education on the internet. Cheaper infrastructure will allow more people in developing countries access to this valuable information.

It'll also help reduce the impact of telecommunications on the environment. Telecommunications networks already produce around 250 million tonnes of CO<sub>2</sub> a year or roughly the same as 50 million cars<sup>[[1]](#Greenemeier_ScientificAmerican)</sup>. If the trend continues, telecommunications networks are going to face a 1000x increase in demand over the next 10 years<sup>[[2]](#Andrews_IEEE)</sup>. Meeting that demand with the same networks we had today would be the equivalent of adding 50 billion cars to the road or nearly 50 times as many cars as there are in the world today<sup>[[3]](#Voelcker_GreenCarReports)</sup>. We need to find more efficient ways of using the resources we already have. Virtual network functions and clever resource management are part of that.

There's widespread consensus that virtual network functions are the way forward for telecommunications networks. The big question now is how do we manage them? To get the most out of virtual network functions we should be reallocating resources on the fly to make sure everyone get's a good quality of service whilst using as little energy as possible. This is the problem at the heart of my research and it's called the 'Network Function Virtualisation Resource Allocation' problem or NFV-RA to its friends.

### How do you solve a problem like NFV-RA?
As we discussed earlier we can run the same virtual network function on lots of different computers. We can then build a service by connecting these computers together. Each computer has a certain amount of computing resources. The more computers we have running the more resources there are available. Each virtual network function a computer runs uses some of it's resources. If we don't give enough resources to a network function it will run slowly and the quality of the service will suffer. If we're running more computers than we need we're wasting energy. The challenge then is to find the minimum amount of resources we must use to provide a good service.

I think of it like stacking bookshelves in a library. We have books (i.e. network functions) that we need to make available. Every shelf (i.e. computer) gives us a certain amount of space to place these books. People using the library want to be able to find their books as quickly as possible whilst for some reason we want to use as few shelves as possible.

The first thing we have to do then is to make sure that we use all of the space we can. Books come in different same shapes and sizes. If we just place the books on the shelves in any old order:

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/books_bad_config.png" alt = "A diagram of a book shelf filled with books but arranged so that not all of the space is being used">

Then we'll end up with lots of little space on each shelf that we're not using. When we've got lots of shelves, all of that little space adds up. If we can find a configuration that uses all of the shelf space then we'll be able to fit more books on the same number of shelves.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/books_good_config.png" alt = "A diagram of a book shelf filled with books arrange so that all of the space is being used">

It's the same thing services and computer resources if a little more complicated. Network functions have a fixed minimum amount of resources but we can give them more resources than they need if we want to. There are also some tricks we can use to make the network functions use *less* resources than normal if we can arrange things correctly. Plus we have to consider the effect that one network function has on the next ones in the sequence. There's no point having one very fast network function followed by a very slow one for example.

There are lots of things to consider and lots of options but we have to be able to keep up with the changing demand. We can give ourselves more time to find a good configuration if we can predict what services people are going to need at different times so we can work some out in advance.

With the library example the easiest thing to do would be to monitor which books get read and then it's easy to work out what books are the most popular. We could then fill all of the shelves up by the popularity of each series.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/books_full.png" alt = "A diagram of a book shelf filled with books">

This is fine when the library is busy but most of the time we're using more shelves than we need. Instead we could ask our visitors what books they want when they walk into the library. As soon as we know what books they are after we then call a colleague to put the books on a shelf for us. Once the colleague has placed the books we can then tell the visitor where they can find their books.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/books_empty.png" alt = "A diagram of a book shelf with only a few books">

This way we are only using the space we need to. Unfortunately it also mean it takes people longer to get their books because they have to wait for them to be shelved. Ideally we'd be able to predict the books customers are going to want in advance.

If we track not just which books were taken off the shelf but when it happened and how long they take to read we may be able to predict when as well as which books will be needed.

<img class="center small-img" src = "{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/book_times.png" alt = "A diagram of a portion of two book shelves and a time above each">

Of course our predictions could be wrong. So we'll still need to ask each customer what books they are after on the way in but most of the time the books should already be ready for them so we don't have to wait for them to be shelved. Any time we get something wrong we've learnt something that we can use to improve our estimates.

With virtual network functions we can do the same thing. If we monitor when people use a service and how long they usually use it for we can use this information to try and predict how much a service will be being used at a time in the future and make informed decisions. If our decisions then turn out to be wrong we have to be able to reconfigure the different services and update our estimates.

This is called 'dynamic resource allocation'. Because we're relying on predictions and averages it can be pretty risky. For example if we were to predict low demand for a night but did not realise it was New Years eve then the network might be overwhelmed at midnight. We can account for the uncertainty in our prediction by allocating more resources than we need for each service but obviously this means using more energy and resources that might be better spent elsewhere.

In my opinion that means we have three objectives to consider. We need it to provide a good quality of service, to use very little of energy and to be robust against unexpected events. It's a challenging problem and there are a great number of researchers working on solving it with so far no definitive solution. For the next few years I'll be working to help crack this and related problems. I'll let you know how it goes.

<hr>

<p id="Greenemeier_ScientificAmerican">
[1] Greenemeier, L. (2010). <i>Can the World's Telecoms Slash Their Energy Consumption 1,000-Fold?</i>. Scientific American. Available at: <a href="https://www.scientificamerican.com/article/green-touch-launch/">https://www.scientificamerican.com/article/green-touch-launch/</a> [Accessed 16/07/2017]
</p>

<p id="Andrews_IEEE">
[2] Andrews, G.J. *et al*. (2014). <i>What Will 5G Be?</i>. IEEE Journal on Selected Areas in Communications. Available at: <a href="http://ieeexplore.ieee.org/document/6824752/">http://ieeexplore.ieee.org/document/6824752/</a> [Accessed 16/07/2017] 
</p>

<p id="Voelcker_GreenCarReports">
[3] Voelcker, J. (2014). <i>1.2 Billion Vehicles On World's Roads Now, 2 Billion By 2035: Report</i>. Green Car Reports. Available at: <a href="http://www.greencarreports.com/news/1093560_1-2-billion-vehicles-on-worlds-roads-now-2-billion-by-2035-report">http://www.greencarreports.com/news/1093560_1-2-billion-vehicles-on-worlds-roads-now-2-billion-by-2035-report</a> [Accessed 16/07/2017]
</p>