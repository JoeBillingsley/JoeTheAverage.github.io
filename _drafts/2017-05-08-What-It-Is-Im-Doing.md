---
layout: post
title: Dynamic Resource Management and Optimisation for Dummies
excerpt: A (hopefully) understandable explanation of my thesis problem
category: research
tags: [phd, research, plain english, nfv, sdn, nfv-ra]
---

My thesis has a pretty scary title:

<b>Dynamic Resource Management and Optimisation for SLA Guarantees in Hyperconverged Communication Infrastructures</b>

When I tell that to people they usually switch off halfway through and then politely smile and motion that it's gone over their head.

But whilst it sounds horrendous there's actually some very simple ideas hidden behind that wall of jargon. Over the course of my PhD I'm going to do my best to explain the ideas at the heart of my work as clearly as I can. So what follows is a long, silly but comprehensive analogy.

-

Imagine you were tasked with managing a library.

Your responsibility is to make sure that everyone can find the information they are after as with as little hassle as possible. Now when you started working at the library it was fairly specialist if a bit weird. There was one section dedicated to childrens fiction, another for foreign language dictionaries and a small section for philosophy. 

But people liked the library. You kept it clean and organised as best you could and more and more people started visiting every day. To cope with the increased demand the library was extended and expanded and over time the library got bigger, and bigger and bigger till we get to today where there's a section for every modern and ancient language, philosophy has moved to it's own wing filled with smoking hipster and the childrens books live in a tower with 100 different colours and a slide around the outside. That cute little library you once loved has become an architectual nightmare - and yours too.

More people keep coming and wanting more and more from your library. It seems like every day another building is added to try and meet demand and it's only going to get worse: you've just been told to expect a 1000x more people in the next 4 years and you've been told you need to cut the electricity bill in half in the same time. In half! Somehow you need to make the whole place 2000% more efficient in 4 years. Energy efficient bulbs just aren't going to cut it this time. 

It's 5:40 AM and your worries won't let you rest. You slump in your seat, drop your head against the reception desk and groan gently and wish for sleep.

The service bell rings right next to your ear.

*Ba DING*

You look up to see a man with a long grey beard dressed in a long cape and a pointy hat with a bag slung over his shoulder.

He opens his mouth to speak.

'Role Playing Game rules books are in the east wing, floor 4. Harry Potter is down that corridor to the fantasy building. Contemporary Witchcraft is out in the yard. The black pointy one shaped like a hat.' you say and drop your head against the desk again. 

**Thud**

Silence, then

*Ba DING*

He's still there.

'What.' you say.

'I'm a salesman' he says, 'I've travelled all around this land acquiring items of interest and I have just what you need'

'Uh huh' you say as you slowly reach under the table to the panic button.

'WAIT!' he says. 

'Well he's a perceptive nutter' you think.

'Let me show you' and he drops the bag onto the reception desk where it collapses softly. He pats the bag down gently. 'See? It's empty'.

He puts his arm into the bag and pulls out a copy of 'Anthology of Appropriate Analogies, Volume 1'. And then takes out Volume 2 and stacks it on top. And Volume 3. And his arms are shaking as he tries to raise Volume 4 to the top of the stack which stands at nearly 1/2 metre tall now.

To say the least your surprised.

'How...' you whisper.

'How much?' he says with a smirk, 'For you I'll settle for directions. Which way to mathematical optimisation?'

'...um', your shaken but you've never been one to lose their cool for long, 'It's on top of the biggest hill. Just keep going up and you'll get close enough.'.

Still smirking, he turns on his heel and strides away.

-

You pace back and forwards eyes locked firmly on the bag. Surrounding you are books of all shapes and sizes. It's nearly 6AM, a quiet time in the library.

On the desk is a list with your observations about the bag so far:

1. Any book in the library can be pulled from the bag 
2. Any book placed in the bag disappears

It's not getting the books that's the problem it's displaying them so that everyone can read them. That and the energy costs. You've been running around turning the lights off after people but it still means paying to light a whole floor even when there's only one person on it and the budget is just not going to cover that anymore. A thought stops you in your tracks.

You run to the bag, reach in and pull out: 'Ingots of Gold: A Miss Marple short story'. You throw the book to the side and collapse back in your seat. With a sigh you add:

3. The bag can only produce books

The clock strikes 6. 'The barristas will be here soon with the philosphers will follow them. Cigarettes and coffee.' you muse 'Then the doctors and nurses. The engineers. Some children before they go to school and then it'll really start getting busy after 9...'

And then it hits you.

You don't have to have enough space for all of the books everyone will need. You only need enough space for the books they need at a given time! If you change the books on the shelves over the day you would need less space and you could save energy too because you wouldn't need to light the empty buildings either.

You sit down and begin to draw up a plan.

'The philosophers and barrista's will be here soon so I'll need to have their books ready.'

[Diagram of books]

'They used to have four buildings between them but they rarely needed that much space. There should be enough copies so that no one has to wait to read a book. The easiest thing to do is still to fill the buildings up like we used to'

[Diagram of buildings full]

'But then we're not saving any energy. Or we could just put as few books in as we need at that exact moment...'

[Diagram of buildings empty]

'But then I'll be running around swapping books all day! And if a load of philosophers suddenly turn up I'll never be able to put the books on fast enough to keep everyone happy. So I need to stack the shelves so that there's enough books for everyone, but as few as possible and so I have to reorder the shelves as little as I can...'

-

That is the problem I'm trying to solve only instead of buildings and books we're dealing with computers and network functions. The challenge is to try and put the network functions on to the computers, like how we put the books on the shelves, so that the resulting set up is fast, energy efficient and robust.

Back in the real world we first tried to keep things simple by building specialised computers that could run a network function very well but they could only run the network function they have been designed for. Because of this we had to make sure that the computers had enough resources that they could cope with the busiest periods. This meant most of the time we were powering lots of computers that were not doing very much work.

Think of it like designing a bookshelf that can only hold one kind of book. The resource we have to consider is space. Most of the time one or two copies of a book would be enough to keep everyone happy. But at the busiest time though you may need ten or twenty copies of the most popular books though. If we built our shelf to hold twenty books then most of the time it'll have more books on it that we need and we're wasting all that space.

Clever IT people noticed this and started using general purpose computers. These aren't as good at running a single network function as the specialised computers but they can run any network function fairly well and can run several different network functions at once. This is like a normal bookshelf with no restrictions. You can put whatever books you want on it just so long as they can all fit on the shelf together.

This brings us back to the library problem. On what computers do we put the network functions and how much resources do we allocate to each one?

The aim over the next three years is to find a solution to that problem that can handle the massive demands 5G will put on telecommunications networks. 