---
layout: post
title: The Budget Bookstore
excerpt: An explanation of the problem I'm solving in my PhD through silly analogies.
category: research
tags: [phd, research, plain english, nfv, sdn, nfv-ra]
---

My thesis has a scary title:

**Dynamic Resource Management and Optimisation for SLA Guarantees in Hyperconverged Communication Infrastructures**

When I tell that to people they switch off halfway through and then politely smile and motion that it's gone over their head. The thing is it's really not that tricky to understand and if you hang around I think I can prove that to you.

5G is on it's way. It's closer than you think but there's some tricky problems we've got to solve first. The problem I'm working on is called the 'Network Function Virtualisation Resource Allocation' problem or NFV-RA to it's friends.

Every time you use a service provided by a telecommunications company, like ringing someone, sending a text or accessing the internet your sending a message out into the air. This message gets picked up by a cell tower and is sent over the telecommunications network to a building filled with loads of computers. Once your message arrives here we have to work out 
where it's supposed to go and how we're going to get it there. 

TODO: Check this bit is accurate. Is this really why we have different services? It's all packets now, what are we really gaining from splitting it out? Is it just billing?

We can't handle all messages in the same way because different services have different requirements. You could hardly have a conversation on the phone if it took 5 seconds for your friend to hear what you were saying - but would you even notice if it took a text that long to arrive? Likewise if you were watching a video you might never notice if the occasional frame went missing but if you'd notice if some characters were out of place in a text message.

We also often have to do clever things to the messages to make them fast enough. For example when your watching a video a lot of information is being sent over the network. It can be difficult to send it over the network fast enough that it doesn't buffer and stutter. To make it easier the message gets compressed. It's like if you could squish all the parcels in the sorting office, then the postman could carry more at once. Once it gets to you, you can uncompress it and you get back the original message. Most messages get compressed but we can't use the same techniques on all the messages.

When these systems were first the designers decided to split each service into lots of little parts. Then they built specialised computers which each solved part of the problem. Finally they wired these computers together to form different services. Then when a message arrived into the datacentre it would be examined to work out what kind of message it was then passed into the first computer who would do their bit before passing it the next, and the next before it reached the end of the chain and was sent off to whomever it was intended for. These computers are commonly called network functions and when connected together they become a service chain.
 
This approach worked very well for a long time but now it's starting to reach the end of it's life. Before the 90s telecommunications companies only had to worry about phone calls for the most part. With 2G now people could send texts and photos and later primitive internet access. To provide all these new services telecommunications companies had to invest in more network functions, more space to keep them in and overall higher running costs. 3G and 4G introduced ever more sophisticated services leading to ever more complex - and expensive - service chains.

5G will pave the way for some major technological developments. For a population with an insatiable appetite for internet access and with self driving cars, smart homes and the Internet of Things on the horizon 5G is looking very exciting - and from the telecommunications point of view *very expensive indeed*.

You can think of network functions like a bookshelf that can only hold one kind of book. If we're a library then we have to make sure there are enough copies of the book that all of our users can have a copy at once. Over the course of a day we'll have busy periods where lots of people want to read a certain book and quiet periods when only a few do. The problem is we have to build our shelf big enough, or build enough shelves, that we have enough space for the busiest parts of the day. The rest of the time we're using far more space than we need.

**Virtual** Network Functions (VNFs) were invented to avoid some of the limitations of traditional network functions. Rather than being very specialised computers virtual network functions are computer programs that run on general purpose computers. These computers can run any number of virtual network functions. If a physical network function is a bookshelf that can only hold one kind of book a general purpose computer is a bookshelf that can hold any kind of books but maybe not quite as many of them.

Like before we need to make sure we have enough books on our shelves that everyone can access what they need to but now we can place any combination of books we'd like on there.

This introduces a new set of problems. Say we were to lay out the books as follows:

We've managed to fit everything on so far but we've not used up all of the space across the two shelves. If one huge book turned up that would take up all of the remaning space we'd have no where to put it. Sometimes we can rearrange the books to make space:

I mentioned before that over the course of the day different numbers of people would turn up at different times. If we knew exactly who was going to turn up and when then it would be easy to make sure that we'd allocated enough resources to keep everyone happy. But people can be strange and unpredictable so whilst we can make an informed guess based on what we've seen before we can't tell for certain. The easiest thing to do is to use all of the computing resources we can find.

Sticking to the shelf analogy, say we had 5 shelves. We could fill up all of the shelves proportionally based on how many people we expect will need them. That way we're almost guaranteed to have enough books available at the busiest times. Shown here drawn on their side to save space and in blocks because I'm lazy.

[Image of packed servers]

But running all the computers at full power all of the time will use a lot of energy. If we were being really tight we might try and use as few computers as we can and then just allocate the maximum resources we think we'll need **most** of the time.

[Image of empty servers]

But wait - what if one of the computers crashed/set on fire/became self aware? All of the resources that we'd put on that computer would no longer be available. By spreading out the resources we can make sure that most of each service will survive but a service won't work if there's a missing link in the chain. The sensible thing to do is to have multiple copies of the same VNFs so that there's no single point of failure.

[Image of replicated servers]

This is the Network Function Virtualisation - Resource Allocation (NFV-RA) problem. We have a limited amount of resources and so we need to allocate them to different services to meet some objectives. 

Here we've considered three objectives: 'performance', 'robustness' and 'energy efficiency'. You might have noticed that these objectives are at odds with each other. The most performant solution is far from the one that uses the least energy for example. As it turns out there is no single best solution but a set of equally good solutions that all compromise on the objectives to different amounts. At the end we can still only use one solution so we'll also need someway of picking our 'best' solution out of the lot*. 

This is made trickier because the number of people that use the services will change over the course of the day and so the set of equally good solutions will also be changing too. This means we can't just pick one good solution and be done with it because what was good in the morning might be useless by the afternoon. So unless you want to spend your whole day picking out solutions we're going to want to teach a computer how to do it.

So how do we find the set of good solutions and how do we decide on a 'best' solution out of them?

Well I don't know. Not yet anyway, but I encourage you to think on it yourself and I'll let you know my answers - just as soon as I've got some.

</hr>
</hr>

*One last thing. Some of you may be thinking that this doesn't seem like that hard a problem at all. After all there's a limited number of different combinations so why can't we just try them all and then pick the combination we like the most? Well the problem is the number of possible combinations increases rapidly as we increase the number of books or shelves. 

As a very informal example, imagine that each shelf could take as many books as we want. For this problem we're not worried about different combinations of books on the same shelf. 
So where do those numbers come from and how do I know there right?



Imagine you had 1 book and 2 shelves, which we'll call shelf A and shelf B. How many different combinations are there if we're not bothered about the order? Just 2. The book could go on shelf A or shelf B. 

[Graph of shelf A and shelf B]

What about if we had 2 books and 2 shelves. Now we end up with 4 combinations. Both books on either shelf, and each book on a different shelf.

Here's another way to look at this. Say that every time we make a decision about where to put a book we spawn an alternate timeline where we made all other decisions. So when we decided where to place the first book we spawned another timeline. And then when we decided to place the second book we spawned another one again.


If we have more shelves then each time we create more timelines every time we make a decision.


And if we have more books then we have to make more decisions.


At each step we have the number of shelves times as many timelines. Or alternatively put:

    number of possible configurations = number of shelves ^ number of books.

If we plug some numbers into this we can see the problem.

5 books and 1 shelf   = 1^5 = 1
5 books and 2 shelves = 2^5 = 32
5 books and 3 shelves = 3^5 = 243

10 books and 1 shelf   = 1^10 = 1
10 books and 2 shelves = 2^10 = 1024
10 books and 3 shelves = 3^10 = 59049

15 books and 1 shelf   = 15^1 = 1
15 books and 2 shelves = 15^2 = 32768
15 books and 3 shelves = 15^3 = 14348907

With just 15 books and 3 shelves we already have more than 10 million combinations to try. That's not completely infeasible for a computer but when you consider that real world problems could have the equivalent of thousands of shelves, and at least the same number of books it gets alot more tricky.

## A Series of Analogous Events: The Budget Bookshop
Say one day you found yourself on your first day of working in a bookshop. The bookshop has a very large stock piled up but to keep costs low your boss has mandated that there shall be only two shelves of books up in the store and the rest of the books are to be kept downstairs in the basement. Over the course of the day people arrive looking to buy series of books. Your job is to make sure that they can find the series they are after.

At 6AM you open the bookshop. You head down to the basement where your surrounded by stacks of musty books. In one corner buried under a fallen pile of unsold '50 Shades' novels is a wooden desk with a single drawer. Inside you find a piece of paper with crude illustrations of people with series of books underneath. At the bottom someone has scrawled 'Good luck'.

<div class="inset row">
    <div class="column">
        <img src="{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/g12659.png" alt="That's a nurse apparently. You can tell by the red cross">
    </div>
    <div class="column">
        <img src="{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/g12573.png" alt="I think that's supposed to be a businessman?">
    </div>
    <div class="column">
        <img src="{{ site.baseurl }}/img/2017-05-08-What-It-Is-Im-Doing/g12297.png" alt="And a priest.. who drew these??">
    </div>
</div>

Upstairs you hear the shop bell ring as the front door swings open. You rush up the stairs to see a woman with a large red cross on her apron walking towards the empty shelf. You grab the books that match her drawing and throw them on the top shelf just as she reaches it. It wobbles under the load, but holds. Seemingly having not noticed your frantic stacking she picks up the first book in the series. You stand awkwardly for a moment and then sit back at your desk.

<hr>

Some time passes and the nurse is still reading the book.

Your leaning backwards in your chair playing with a pencil when the bell rings and another nurse identical to the first heads in. You tip backwards in surprise and land in a heap on the floor. Once you've seperated yourself from your seat you see the nurse clone looking rather displeased at the shelves. You scramble downstairs and grab another copy of each of the books in the nurses series and add them to the shelf. The nurse clone begins to read the series but she does not look amused.

[Diagram of current set of books]

The bell rings again.

A priest strides through. You go back downstairs, grab his books and put them on to the bottom shelf. He surveys the series briefly and begins to work his way through.

[Diagram of two shelves of books]

The bell rings again.

Yet another man appears. He walks in wielding a stiff black leather briefcase and an expression so stern it must have been etched on with a chisel. He paces towards the shelf. You dart downstairs yet again and return lugging just one huge book up with you. You heave it to your chest and your about to place it on the shelf when:

[Diagram of two shelves of books where not every book can fit]

You stare at the shelf in horror. With the way the books are there's no space on either shelf big enough to fit the book anymore. The businessmans expression turns sterner still. 

Thinking quickly, you rearrange the books to make as much space on the first shelf as you can. All eyes are on you but no one is happy you've disrupted their reading. After a few different combinations you just manage to squeeze the massive book into the second shelf. Still glaring, the businessman reaches out towards the book you've just placed.

*beep beep. beep beep. beep beep.*

It's his watch beeping. He glares at you, turns and storms away.

-

[TODO: Explanation of 
 Books - VNF
 Series - Services
 Time - Time sensitive services]

What I'm doing is very similar to this only instead of books and a shelf we've got 'virtual network functions' and computers. A virtual network function is a just a computer program. 

Like most programs they take in some information, make some change to it and feed it back out. Each individual virtual network function isn't very useful by itself but by connecting several of them together we can build a useful service. In my research a service is anything we do that relies on the telephone or internet network like sending a text, ringing someone, accessing a webpage or streaming a video. It's important we connect them in the right order though or everything falls apart.

You can think of a virtual network function like a machine in a factory and a service would be several machines on a conveyor belt. Say for example you wanted to make clay plates. At one end of the belt someone would dump some clay, and the belt would push that clay to a machine that flattens it out, another machine would cut it and another machine would fire it and at the end you'd have a plate. If you did things in the wrong sequence, like fired the clay before you cut it, then you'd just get garbage out at the other end.

Now you know the background we can make things a little more interesting.

We had a configuration of books that worked well at first 

This is the core of the problem I'm trying to solve. Without getting too technical we have a limited amount of resources and we have to make sure that everyone gets the service they came looking for. 


This is made difficult because for most services you need a response in a certain amount of time. Imagine if you made a call and it took 10 seconds from you saying something to the other person hearing it. It wouldn't make for much of a conversation! So we have to make sure that 

It's commonly called the Network Function Virtualisation Resource Allocation problem or just NFV-RA to it's friends.

We can reorder the books/virtual network functions to make sure we use all of our shelves/computers but this can only take us so far. If in our example another customer turned up before the others had left there would simply be no more space to display books. The next step is clear. More shelves!

As it turns out this makes things **a lot** more difficult.

Silly question. What would have happened if another nurse walked in whilst the first one was still reading the first book? She'd have had to wait to read the book. In the real problem there's usually always a lot of people using a service but at some times there are more people using it than others. We need enough copies of each service

- 

You put the phone down, your ears still ringing from your bosses complaints. He'd made it very clear that you would not still be working here if he weren't expecting such a busy day tomorrow. Your arguments that you'd need more space if there were to be more people... were not popular.

You arrive the next day to see the shop has tripled in size. Two more rooms have been added each with two more wobbly shelfs. Each room is lit by a single naked bulb. A letter is stapled to your till explaining that the electricity bill will be coming out of your paycheque.

You turn off all the lights.

In the darkness you start. It's going to be a busy day and you have three rooms to manage. Your going to need a plan. You write down your two objectives:

1. Make sure everyone can ~~buy~~ read the books they want in the time they have
2. Keep the lights off as long as possible

Each individual objective is easy enough. You could keep your energy bill down if you just used the one room and kept the other lights turned off. You draw a diagram, with the shelf on it's sides to save space.

[Diagram of single server]

But you could quickly run out of space when things got busy if you just had the two shelves. If you just wanted to make sure everyone had the books they wanted you would fill up all of the shelves.

[Diagram with multiple servers]

Deciding what books you'd put up is still tricky though. If you have several customers wanting to read the same series of books then there should be the same number of books available. There's nowhere near enough space to keep multiple copies of all of the books that everyone will need so you'll still have to swap books about. And you also have to place the books so that you use all the available space as you go.

Then you remember how wobbly the shelves are. If one collapsed then all of the people who were reading those books would go to the other shelves to finish their reading. The safest thing to do would be to put multiple copies of the books on different shelves.

[Diagram with multiple servers, robust]

But that uses up precious space, and on books which might not even get looked at!

This **is** a hard problem. You lean back in your chair and stare up at the ceiling. You just need a moment to think... 

The bell rings again.

-

That, more or less, is the 'Network Function Virtualisation Resource Allocation' problem. We'll have the easiest job keep all of our customers happy if we have lots of computers but then we have to spend alot on energy and although each individual computer is unlikely to fail when you approach thousands of them then the likelyhood is one will fail and soon. We have to juggle all of these considerations at once and try and solution that will work for everyone.

One last thing as some of you may be thinking that this doesn't seem like that hard a problem at all. There's a limited number of combinations of books so why can't we just try them all and then pick the single best combination? Well the problem is the number of possible combinations increases rapidly as we increase the number of books or shelves. 

As a very informal example, imagine that each shelf could take as many books as we want and the ordering of the books doesn't matter. If we had just 5 books and 1 shelf how many ways could we configure the books? Just 1, all of the books on one shelf. If we have 2 shelves that jumps up to 32, and with 3 shelves 243 combinations. Things get even worse as we increase the number of books. With just 2 shelves and 10 books there are 1024 combinations and at 2 shelves and 15 books it's already 32,768 combinations*! When you consider that real world problems could have thousands of shelves, and at least the same number of books, it's clearly impractical to try every combination. Instead we'll have to get a little creative.

Hopefully that made enough sense that now you can get to thinking about how to solve it. I'll be writing up my thoughts on a solution in the future - just as soon as I manage to work one out.

-

Notes

*You don't need to understand where those numbers came from to get the overall problem and the post is too long already so consider this bonus material for the interested. So where do those numbers come from and how do I know there right?

Imagine you had 1 book and 2 shelves, which we'll call shelf A and shelf B. How many different combinations are there if we're not bothered about the order? Just 2. The book could go on shelf A or shelf B. 

[Graph of shelf A and shelf B]

What about if we had 2 books and 2 shelves. Now we end up with 4 combinations. Both books on either shelf, and each book on a different shelf.

Here's another way to look at this. Say that every time we make a decision about where to put a book we spawn an alternate timeline where we made all other decisions. So when we decided where to place the first book we spawned another timeline. And then when we decided to place the second book we spawned another one again.


If we have more shelves then each time we create more timelines every time we make a decision.


And if we have more books then we have to make more decisions.


At each step we have the number of shelves times as many timelines. Or alternatively put:

    number of possible configurations = number of shelves ^ number of books.





I'm trying to find the best arrangement of 'virtual network functions' on a collection of computers so that everyone can get the service they're looking for. In particular I'm doing this for telecommunications networks so a service could be anything from accessing the internet to making a phone call.

Virtual network functions are a fairly recent development. Before 'virtual network functions' we just had plain old 'network functions'. These are powerful, specialised computers that can do a single function very well but only that function. To create a new service we just had to connect several of these together. Then we have to buy enough of each machines to make sure we could handle the busiest times, when lots of people want to use our service at the same time. Though most of the time few people might be using the service, we are still paying to run lots of computers that are usually not doing very much work.

Think of classic network functions like a shelf that could only hold one kind of book. Most of the time one or two copies of a book would be enough to keep everyone happy but at the busiest time though you may need ten or twenty copies of the most popular books. If we built our shelf to hold twenty books then most of the time it'll have more books on it that we need and we'll be wasting loads of space.

Clever IT people noticed this and started using general purpose computers and virtual network functions. Each virtual network function might not be as good as the specialised computers but now each computer can run any virtual network function fairly well and can run several different network functions at once. This is like a normal bookshelf. You can put whatever books you want on it just so long as they can all fit on the shelf together.