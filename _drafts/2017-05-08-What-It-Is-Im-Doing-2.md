---
layout: post
title: The Budget Bookstore
excerpt: An explanation of the problem I'm solving in my PhD through several silly analogies.
category: research
tags: [phd, research, plain english, nfv, sdn, nfv-ra]
---

My thesis has a pretty scary title:

**Dynamic Resource Management and Optimisation for SLA Guarantees in Hyperconverged Communication Infrastructures**

When I tell that to people they usually switch off halfway through and then politely smile and motion that it's gone over their head. But it's really not that tricky to understand and if you hang around I think I can prove that to you.

I'm working on the 'Network Function Virtualisation Resource Allocation' problem. I'm trying to find the best arrangement of 'virtual network functions' on a collection of servers so that everyone can get the services they want off of them. You can think of it a bit like putting books onto a shelf in a bookshop where you want to make sure that people can always find the books they want to buy.

## A Series of Analagous Events: The Budget Bookshop
Say one day you found yourself working in a bookshop. The bookshop has a very large amount of stock piled up but to keep costs low your boss, Mr Bossman, has mandated that there shall only be one shelf of books up in the store and the rest of the books are to be kept downstairs in the basement. Over the course of the day people will arrive looking to buy books. Your job is to make sure that they can find the books they're after.

At 6AM you open the bookshop. You head down to the basement where your surrounded stacks by stacks of musty books. In the corner, buried under a fallen pile of unsold '50 Shades' novels you find a wooden desk with a single drawer. Inside that drawer is a piece of paper with crude illustrations of people and underneath lists of books you've seen in the storeroom. Along the bottom someone has scrawled: 'Good luck'.

[Diagram of people]

Upstairs you hear the bell above the door ring. You rush up the stairs to see a woman walking in with a large red cross on her apron. Very concious that the bookshelf is empty you rush back to the basement, on a whim you grab the books the paper lists for her illustration and throw them on the shelf before she reaches it. Seemingly having not noticed your frantic stacking she picks out each of the books in sequence, flicks through them for a bit, places them back, turns on the spot and abruptly leaves.

'That was odd.' you think to yourself.

-

What I'm doing is very similar to arranging books in a shelf only instead of books and a shelf we've got 'virtual network functions' and a server. A virtual network function is just a computer program. Like most programs they take in a piece of data, make some change and feed it back out. By connecting several virtual network functions together you can provide a useful service, things like accessing the internet or making a phone call, and then it's important that they run in the correct order.

You can think of them like machines on a conveyor belt. Say for example you wanted to make clay plates. At one end of the belt someone would dump some clay, and the belt would push that clay to a machine that flattens it out, another machine would cut it and another machine would fire it and at the end you'd have a plate. If you did things in the wrong sequence, like fired the clay before you cut it, then you'd just get garbage out at the other end.

Virtual network functions are a fairly recent development. Before 'virtual network functions' we just had plain old 'network functions'. These are powerful, specialised computers that can do a single function very well but only that function. To create a new service we just had to connect several of these together. Then we have to buy enough of each machines to make sure we could handle the busiest times, when lots of people want to use our service at the same time. Though most of the time few people might be using the service,  we are still paying to run lots of computers that are usually not doing very much work.

Think of classic network functions like a shelf that could only hold one kind of book. Most of the time one or two copies of a book would be enough to keep everyone happy but at the busiest time though you may need ten or twenty copies of the most popular books. If we built our shelf to hold twenty books then most of the time it'll have more books on it that we need and we'll be wasting loads of space.

Clever IT people noticed this and started using general purpose computers and virtual network functions. Each virtual network function might not be as good as the specialised computers but now each computer can run any virtual network function fairly well and can run several different network functions at once. This is like a normal bookshelf. You can put whatever books you want on it just so long as they can all fit on the shelf together.

Now you know the background we can make things a little more interesting.

-

Some time pases.

Your slouching in your chair playing with your pencil when the bell rings and another nurse heads in. You leap out of your seat so fast you fall into your desk. By the time you've recovered the nurse is already contentedly flicking through the books you'd left on the shelf from before. You breath a sigh of relief, *phew.*

[Diagram of current set of books]

The bell rings again.

A man steps through, fedora on his head and bull whip in hand, and strides over towards the shelf. You dart downstairs, grab his books and throw them on the next shelf down faster than a crack of a whip. The archaeologist surveys the books you've shelved and seems pleased. He begins to work his way through.

[Diagram of two shelves of books]

The bell rings again.

Another man appears with a stiff black leather briefcase at his side and an iI wanted this to make sense to everyone including my Grandma's so it's a bit longer than it would be if I got technical.rritated expression so well set it may have been chiseled into his head. He paces towards the shelf as you sprint downstairs once more and return with one huge book. You go to place it on the shelf when tragedy strikes.

[Diagram of two shelves of books where not every book can fit]

You stare at the shelf for a moment in horror. With the way you've got the books arranged, there's no space on either space big enough to fit the book in. The businessmans expression somehow turning sourer by the second without moving a muscle.

Thinking quickly, you rearrange the books to try and make as much space on the first shelf as you can. Now everyone has noticed you and no one is happy you have disrupted their reading. 

After trying a few different combinations you manage to make a big enough space and you squeeze the book into the second shelf. Still glaring, he reaches out towards the book you've just placed. 

*beep beep. beep beep. beep beep.*

His watch is beeping - your time is up. He turns and storms away.

- 

This is the core of the problem: we have a limited amount of shelf space and we have to make sure that the right books are available when they're needed to keep everyone happy. Or in telecommunications terms, we have a limited number of computers and we have to make sure that the right virtual network functions are available when they're needed to keep people from complaining.

This is made difficult because most services are time sensitive, you need a response in a certain amount of time. Imagine if you made a call and there was a 5 second delay in between you saying something and the other person hearing it. It wouldn't make for much of a conversation. This applies to pretty much all services we use - we expect a website to download quickly, videos not to stutter, texts to send instantly...

We can reorder the books/virtual network functions to make sure we use all of our shelves/computers but this can only take us so far. If in our example another customer turned up before the others had left there would simply be no more space to display books. The next step is clear. More shelves!

As it turns out this makes things **a lot** more difficult.

- 

You put the phone down, your ears still ringing from Mr Bossmans relaying the businessman's complaints. He made it very clear that you would not still be working here if it weren't World Book Day tomorrow. You'd tried to explain that you'll need more space if your expecting more customers but it fell on deaf ears. 

It's the end of the day so you lock up and walk home, thinking on whether you should come back. 

You arrive the next day to see the shop has tripled in size. Two more rooms have been added each with two more wobbly shelfs. Each room is lit by a single naked bulb. A letter is stapled to your till:

The electricity bill will be coming out of your paycheque. Happy now?

Bossman

You turn off all the lights.

Sitting in the darkness you get to thinking. It's going to be a busy day and you now have three rooms to worry about so your going to need a plan. You write down your two objectives:

1. Make sure everyone can ~~buy~~ read the books they want in the time they have
2. Keep the lights off as long as possible

You know that different types of visitor read different books and in a particular order:

[Diagram of forward graph]

Each individual objective is easy enough. You could keep your energy bill down if you just used the one room and kept the other lights turned off. You draw a diagram, with the shelf on it's sides to save space.

[Diagram of single servers]

But you could quickly run out of space when things got busy if you just had the two shelves. If you just wanted to make sure everyone had the books they wanted you would fill up all of the shelves.

[Diagram with multiple servers]

Deciding what books you'd put up is still tricky though. If you have several customers wanting to read the same series of books then there should be the same number of books available. There's nowhere near enough space to keep multiple copies of all of the books that everyone will need so your still going to be running around swapping books about. And you'll also want to place the books so that you use all the available space as you go.

Then you remember how wobbly the shelves are. If one collapsed then all of the people who were reading those books would go to the other shelves to finish their reading. The safest thing to do would be to put multiple copies of the books on different shelves.

[Diagram with multiple servers, robust]

But that uses up precious space, and on books which might not even get looked at!

This **is** a hard problem. You lean back in your chair and stare up at the ceiling and bemoan the twisted path that brought you here in the first place. 

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