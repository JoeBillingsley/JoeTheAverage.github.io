TODO: This is too much information up front. Need to point out what we're doing differently and then can push some of the information too later on.

Structure could be: 1. Engaging intro post. Introduces abstract problem in a simplified way but
                    still provides **essential** information. Think similar content as current 
                    but less cruft
                    2. Need to discuss different metrics we need to use for both optimisation and modelling
                    3. Informative post providing general knowledge about switches and servers more detail
                    4. Informative post providing general knowledge about virtual machines and containers

TLDR: We can't afford to run communication networks like we used to. People are trying to make them more efficient. We think we can do it better by building accurate models and using these to optimise the configuration of networks.

It's hard to pin down exactly how much energy, modern communications uses but we know it's a lot. Best estimates put it at around [\_% of world energy consumption in 2012](http://www.internet-science.eu/sites/eins/files/biblio/oe-20-26-B513.pdf), looking ahead it'll probably be somewhere between [_ - _% by 2030](http://www.mdpi.com/2078-1547/6/1/117/htm) depending on how efficient we can make our devices and the infrastructure that supports them.

Unfortunately it's not easy to make things more efficient. There tends to be a trade off of the amount of energy something uses and how well it works. Think about how you're phone changes when you put it in power saver mode. Phone designers could make you're phones battery last forever if they wanted too - a tap on power saver would turn the phone off. Job done. Instead they opt to remove unnecessary animations and limiting the speed of you're phone. Each of these decisions allow for a longer battery life at some small or large expense. Turning off animations is an aesthetic loss but saves a fair bit of power. Slowing the phone down could be more of a problem and leads to a further question - how much energy can we save before the phone is too slow to use?

Phones use a portion of that energy listed above but as far as devices go there pretty small and low power. The real costs is in the manufacturing of communication equipment and the infrastructure that is needed to carry the myriad ways we communicate with each other. And that's the key thing here - when we talk about communication we don't just mean calls and texts. It's webpages, tv shows, podcasts, Snapchat, Messenger, WhatsApp, TODO: and calls and texts. The common link between the dominant forms of communication is the internet and underneath that the connections of light and metal that now connect almost any two people in the world. Improving the efficiency of this infrastructure, even a little, can make a huge impact. But just like with phones there are trade offs to be made and again we have to ask - how much energy can we afford to save? 

## Communication Networks

We've no hope of solving this problem unless we understand it and years and years of development and investment (or lack thereof) have made modern communications network pretty complex with a whole mess of technologies doing their best to coexist. However in the abstract it's pretty straightforward:

[Network figure]
[TODO: Check Network POP definition]

At the 'edge' of the network is you. Your phone, computer, TV, fridge - whatever internet enabled device you are using. Your devices communicate with nearby 'cells'. These can be large cell towers that can support hundreds of users at a time or more commonly now, small cells that have a much smaller range and are meant for 10's of users in very densely populated areas. Further along still you reach network points of presence where networks owned by different mobile or internet providers will meet to allow sharing of information and sometimes resources. Finally at the heart of the thing you have your datacentres - big rooms stacked high with computers that can provide an almost unlimited supply of computing power.

Over this network goes all of the information that needs to be transmitted. As the network needs to carry lots of different kinds of information, everything gets broken down into many *packets* of data that all have the same structure:

[Packets figure]

Each packet is labelled with an address so that the network knows where to send it, the payload - the raw data itself, and some information about ordering to help put everything back together again when it arrives. For example if you send a long text the payload of each packet might contain several characters. Then when it arrives at the edge of the network, all of these packets can be put in order and the text can be reconstructed.

Packets are a fairly abstract idea but it's easiest just to imagine as chunks of data moving along the network like cars moving down a road:

[Network + Packets animation]

Depending on the service you are using, there may be some important tasks that need to be done as the packet goes over the network. If you send a text we need to check if you have enough credit, people are very sensitive to voices so calls need special handling, once you open something up to the internet you need some basic protections and of course for anything you do we need to be work out where we are meant to send these packets to make sure they end up in the right place. These tasks are called 'network functions'. To provide some service, such as texting, we break down the service into it's individual functions (charging, routing, etc) and connect them altogether.

Each of these services also have different needs that need to be met. If your talking on a phone then the time taken between you speaking and the person hearing you needs to be very low - even a few seconds delay would be enough to ruin a conversation. Compare that to sending a text. How long is too long to wait for a text?

So clearly different services have different requirements. From the service providers perspective there are only a few important service qualities that matter:

- **Latency** The time it takes for the sent packets to arrive. The speed of the road. 
- **Throughput** The amount of packets we can send in a second. The width of the road.
- **Packet Loss** The number of packets that are damaged/lost in transit. The number of car crashes that happen on a road. Like with a car crash, packet loss can have a major impact on a services latency and throughput.
- **Availability** The amount of time the service is available for.
- **Cost** The initial and running costs of deploying a service from a network. Practically this is set by the energy cost of running the servers being used. This is good news for us! The short term incentives of saving money and the longer term incentive of not wiping out the species from climate change line up nicely.

So clearly different services have different requirements and we can generally make a service better and faster by throwing money at the problem and making more resources available. In the past this had to be planned out well in advance. Traditionally, network functions were provided by very fast, purpose built machines that can process a certain number of packets in a short amount of time. However these are expensive - and inflexible. For example if you find that you didn't buy enough of one computer to meet demand for some new service, then you're stuck until you can get more delivered.

The alternative option then is to 'virtualise' these network functions - that is principally, to provide them using software rather than special hardware. Rather than running them on purpose built computers you can run them on *relatively* cheap industry standard pieces. Now if you find your new service has unexpectedly high demand you can take resources from elsewhere in the datacentre by launching more copies of your network functions on other servers.

## Tradeoffs
Now obviously this is no magic bullet. To see the challenge we first need to understand exactly what we mean by 'resources'.

Here I'll describe the resources available in a datacentre but the idea applies at all levels in our network. Datacentres are typically made up of 10s of thousands of servers. Each server has two key resources: processor time and memory space. The important part for now is that typically the more of these resources we give to a VNF, the faster it will run. These servers are connected by a network of their own. The network has a critical resource of its own called bandwidth: the number of packets that can go between two servers in a second. If you give a service more bandwidth, it's like widening the road so that the cars/packets can get to their destination quicker.

The catch is that all of these resources are limited. Each server has a limited amount of processing power and memory space; the network has a limited amount of bandwidth. To construct a service we have to decide how much of each of server and each switch's resource is allocated to each service.

If you are familiar with it this will sound similar to the issues when managing a cloud computing environment and in many ways it is very similar. In cloud computing the challenge is similar, people pay you to be able to provide a certain amount of computing resource whenever you need it. So for example if you need a server that has 16 processors in it, Amazon will happily rent you one from one of their datacentres. If you need more, you just ask.

The catch with this problem is that we must place sequences of VNFs and we must consider how all of these different VNFs will interact with each other. Plus we must consider how to use the wider network and what VNFs are worth placing at the edge of the network. PLUS we have constraints to worry about such as traditional network functions that cannot be moved but are as essential as the more modern equipment. 

Finally because that was apparently not enough, we are building a system that can make intelligent decisions about how many VNFs you need based on your particular requirements. That is that rather than buying a server like in traditional cloud computing, you buy a guarantee that the service you are providing will have low latency, high throughput and 99.99999% uptime. This moves the hard decision of choosing how much resources are needed from the consumer to the service provider. Now to make these decisions at a huge scale we need to move this intelligent decision making from humans to computers.

My research has two key parts. First is the development of mathematical models that provide insights into the VNF placement problem. The second is the usage of these models to develop state of the art optimisation algorithms that can solve it. 

At this point this series turns into a bit of a choose your own adventure book. If you have some time on your hands then you could read all of these posts in chronological order starting from this next post where we'll get into the real gritty details of how modern networks work, from servers and switches to virtual machines, containers, Software Defined Networking and all sorts of fun stuff.

If you are more interested in the development of cool mathematical models you should head over here.

And if you'd rather head straight to the optimisation of these models then you want to go this way.