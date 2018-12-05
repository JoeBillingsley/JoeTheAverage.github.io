TODO: Move bit explaining NFV elsewhere possibly
      Possibly need to introduce VMs
      Move long/many services and other extensions elsewhere
      Move SDN elsewhere
      Add figures
      Write it from the perspective of something I've researched not as teaching material

It's hard to pin down exactly how much energy, modern communication uses but we know it's a lot. Best estimates put it at around [\_% of world energy consumption in 2012](http://www.internet-science.eu/sites/eins/files/biblio/oe-20-26-B513.pdf), looking ahead it'll probably be somewhere between [_ - _% by 2030](http://www.mdpi.com/2078-1547/6/1/117/htm) depending on how efficient we can make our devices and the infrastructure that supports them.

Unfortunately it's not easy to make things more efficient. There tends to be a trade off of the amount of energy something uses and how well it works. Think about how you're phone changes when you put it in power saver mode. Phone designers could make you're phones battery last forever if they wanted too - a tap on power saver would turn the phone off. Job done. Instead they opt to remove unnecessary animations and limiting the speed of you're phone. Each of these decisions allow for a longer battery life at some small or large expense. Turning off animations is an aesthetic loss but saves a fair bit of power. Slowing the phone down could be more of a problem and leads to a further question - how much energy can we save before the phone is too slow to use?

Phones use a portion of that energy listed above but as far as devices go there pretty small and low power. The real costs is in the manufacturing of communication equipment and the infrastructure that is needed to carry the myriad ways we communicate with each other. And that's the key thing here - when we talk about communication we don't just mean calls and texts. It's webpages, tv shows, podcasts, Snapchat, Messenger, WhatsApp, TODO: and calls and texts. The common link between the dominant forms of communication is the internet and underneath that the connections of light and metal that now connect almost any two people in the world. Improving the efficiency of this infrastructure, even a little, can make a huge impact. But just like with phones there are trade offs to be made and again we have to ask - how much energy can we afford to save? 

The easiest way of solving this problem is to try stuff and see what happens. The cheapest way of answering this problem is by building an accurate model. Guess what we'll be doing?

## Background
From what I've seen and read, when given a difficult problem smart people tend to try and understand it. Hopefully if we mimic them, some of it might rub off. First I will introduce some background material then we will work through a initial model I developed to help me get my head around things.

Years and years of development and investment (or lack thereof) have made modern communications network pretty complex, with a whole mess of technologies doing their best to coexist. However in the abstract it's pretty straightforward:

[Network figure]
[TODO: Check Network POP definition]

At the 'edge' of the network is you. Your phone, computer, TV, fridge - whatever internet enabled device you are using. Your devices communicate with nearby 'cells'. These can be large cell towers that can support hundreds of users at a time or more commonly now, small cells that have a much smaller range and are meant for 10's of users in very densely populated areas. Further along still you reach network points of presence where networks owned by different mobile or internet providers will meet to allow sharing of information and sometimes resources. Finally at the heart of the thing you have your datacentres - big rooms stacked high with computers that can provide an almost unlimited supply of computing power.

Over this network goes all of the information that needs to be transmitted. As the network needs to carry lots of different kinds of information, everything gets broken down into many *packets* of data that all have the same structure:

[Packets figure]

Each packet is labelled with an address so that the network knows where to send it, the payload - the raw data itself, and some information about ordering to help put everything back together again when it arrives. For example if you send a long text the payload of each packet might contain several characters. Then when it arrives at the edge of the network, all of these packets can be put in order and the text can be reconstructed.

Depending on the service you are using, there may be some important tasks that need to be done as the packet goes over the network. If you send a text we need to check if you have enough credit, people are very sensitive to voices so calls need special handling, once you open something up to the internet you need some basic protections and of course for anything you do we need to be work out where we are meant to send these packets to make sure they end up in the right place. These little tasks are called 'network functions'. To provide some service, such as texting, we break down the service into it's individual functions (charging, routing, etc) and connect them altogether.

Traditionally network functions have been provided by very fast, purpose built computers that can process lots of packets in a very short amount of time. However these are expensive, and inflexible. For example if you find that you didn't buy enough of one computer to meet demand for some new service, well you're stuck until more are delivered and meanwhile you're providing a poor quality service and presumably getting lots of complaints.

The alternative option then is to 'virtualise' these network functions - that is principally, to provide them using software rather than special hardware. Rather than running them on purpose built computers you can run them on *relatively* cheap industry standard pieces. Now if you find your new service has unexpectedly high demand you can take resources from elsewhere in the datacentre by launching more copies of your network functions on other servers.

So finally we need to talk a little about how a datacentre is wired up. Datacentres have thousands of servers, to keep things organised and make sure that routing (the process of getting a message from one server to another) is efficient, it helps to have a well defined structure. One common structure is called a **fat tree**, for this work we've augmented this structure a bit to look like this:

[fig:network]

Datacentre networks are constructed from *switches* and *servers*. Each switch has a number of ports that allow it to connect to other devices in the network. Switches look at each packets destination and decide which port to send them out of. Servers run our network functions. Each server can run any number of these network functions - provided it has enough resources. The job of the network is to get packets to the network functions, in the correct order, as quickly as possible. 

The network is split into several layers:

Core/Aggregate/Edge - These aren't particular exciting layers. These simply push packets to servers or to another switch, closer to the server.

Server/Virtual Switch - In a NFV enabled network each server can run several network functions. As a result the server needs a switch of its own, to make sure that the packets it receives go to the right network function. The virtual switch is run on the same server as the VNFs.

Virtual Network Functions - Finally we have the network functions themselves running on the servers.

Software Defined Networking (SDN) - Sitting next to the network and connected to all of the servers is the SDN controller. The SDN controller knows where all of the network functions are and gives instructions to the switches to ensure that packets arrive in the right place.

Fat tree networks can be defined If we assume that all of the switches have *k* ports then:

- There are (k/2)<sup>2</sup> core switches. 
- Each core switch connects to one switch in each of the k pods. 
- Each pod contains two layers (aggregation and edge) of k/2 switches.
- Each edge switch is connected to all of the aggregation switches in the pod
- Each edge switch is also connected to k/2 servers
- Each server has a virtual switch connected to k network functions

We'll call the total number of network functions, *n*. If you work it through it turns out n = (k<sup>3</sup> / 4) * k.

As an example, in the network above k = 4. So that means we should have 4 core switches, connected to one switch in each pod. Each pod should have 2 aggregate switches and 2 edge switches which are fully connected to each other. Each edge switch is connected to 2 servers and each of those contains 2 more virtual switches. Following our equation this would give us n = 64 network functions.

The structure of a Fat Tree network makes it very easy to route packets. We can also see from the figure that there are several different ways of getting through the network. In general we want to minimise the number of switches we have to visit, we will refer to this as taking an efficient path. At the aggregation and core layers we will also want to distribute packets over as many switches as is reasonable so that the work of handling the packets is balanced.

## Modelling the network
To get to grips with things at first we will just calculate the average latency of the network. That is the average time it takes for a packet to get from its source to its destination.

An important property of models is that they are simplifications. If a model is not a simplification then it's not a model - it's just the real thing. For this model we're going to pretend we have no idea on which servers the network functions are placed. Therefore we have to assume that the network functions are placed *on every server*. This isn't a realistic assumption to make but the resulting model can still provide some useful information.  

Similarily, switches and servers can be pretty complicated. However they tend to process packets as they arrive and usually at a fairly consistent rate. Hence we can just pretend that each switch and server is a first in first out queue where the service time for each packet is independent of the previous packets. We will say that each switch services packets at some mean rate $lambda_{sw}$. Also, as we don't know where the VNFs are placed, we can say that each VNF processes packets at a mean rate of $lambda_{sw}$; and that packets are produced from each VNF at a mean rate &mu;

Finally as memory is very cheap it's not unreasonable to assume that queues at a switch/server can be infinitely long. 

These assumptions let us build a pretty good model. Since we've modelled the network as a queue we can use formula from *queuing theory*. Further the other assumptions (formally: independant Poisson processes for arrival and service rates, infinite length queues) we can model each switch and server as an M/M/1 queue. Queueing theory tells us that the average waiting time, the time spent in the queue plus the time spent being serviced, is given by:

wait_time(λ, μ) = 1 / (μ - λ)

Something to note: the model will only work when the arrival rate (λ) is less than the service rate (μ). Equation 1 gives us the *average* waiting time. If messages arrive faster than they can be serviced then the queue will grow infinitely large and the waiting time will approach infinity as well.

Now we've got everything we need to calculate the latency in the network. If you want to have a crack at this yourself first then scroll no further!

## Calculating the latency
Calculating the latency isn't too tricky. We've assumed that a packet could be emitted from any virtual machine and that it could end up at any other virtual machine. As packets will take efficient paths, not all packets will visit every level. Therefore it makes sense that switches at different levels of switches will have different arrival rates and hence different waiting times. Further as all of the virtual machines are acting the same way, all switches on a given level will have the same arrival rate.

Looking at the fat tree graph again we can see there are only four different paths from any VM to any other:

The latency for a path is just the sum of the waiting time at each switch on the path. To calculate the average latency considering each possible path we have to consider the probability of taking that path. The expectated latency is given by:

Latency(\beta, μ) = 
  (wvnf + wvsw) · pvsw
+ (wvnf + wsdn + 2wvsw + wedge) · pedge
+ (wvnf + wsdn + 2wvsw + 2wedge + wagg) · pagg
+ (wvnf + wsdn + 2wvsw + 2wedge + 2wagg + wcore) · pcore

Where w_vnf, w_vsw, w_sdn, w_edge, w_agg and w_core are the waiting times at a VNF, virtual switch, SDN controller, edge switch, aggregate switch and core switch respectively. Similarily p_vsw, p_edge, p_agg and p_core are the probabilities that the highest level switch that a packet will visit is a virtual, edge, core or aggregate switch respectively.

## Probabilities
Now we need to calculate the probability of a packet taking any of these paths. Once again from the figure we can see that every time we go up a level we can visit many more VNFs:

[Figure of different paths]

The probability of visiting a level of switches then is the portion of VNFs that we can't visit via a more efficient route. For example the shortest route we can take is if the source and destination share the same virtual switch. Only k VNFs can be on under a virtual switch and 1 of those is the source. The probability of the destination being under the same virtual switch is then:

p_vsw = (k - 1) / (n - 1)

We can do the same thing if the source and destination VNFs share an edge switch. From the definition of the network, we know that the edge switch has k/2 * k VNFs under it but we also have to remember not to count the VNFs that could take a shorter path:

p_edge = ((k/2) * k - k) / (n - 1)

We can do the same for the aggregate and core switches:

p_agg = ((k/2)^2 * k - (k/2) * k) / (n - 1)

p_core = (n - (k/2)^2 * k) / (n - 1)

If you want to sanity check this you can add all those probabilities up and they will sum to 1.

There's only one more probability to calculate and that's p_sdn. We're given the probability of a packet visiting the SDN if it leaves the server in assumption 5 but that only appplies when the source and destination are not under the same virtual switch:

p_sdn = p_sdn_root * (1 - p_vsw)

That gives us the probabilities, now we can start to calculate the waiting times.

## Arrival Rates
So we know that this:

wait_time(λ, μ) = 1 / (μ - λ)

can give us the waiting time at each switch. We specify the service rates (μ) and the production rate (\beta) ourselves when we use the model. In order to calculating the waiting time we need to calculate the arrival rates (λ) for each of the network components.

First it's important to understand that as the arrival rate is less than the service rate then packets will leave from a switch at the same rate as they arrive.

### Server
Since packets are evenly distributed over the VNFs the arrival rate at each VNF, λ_vnf, will be the same. On average (n-1) VNFs will be sending 1/(n-1) * λ of a packet to our VNF each cycle so:

λvnf = (λ · (n − 1)) / (n − 1)
     = λ

### Virtual switch
The next level up, the virtual switch, is a bit more interesting. There are three places the virtual switch can receive packets from.

1. It'll get all of the packets sent by the VNFs in the server. There are k VNFs in the server each sending λ messages.

          kλ

2. It'll get a portion of the packets sent by the other VNFs. There are (n - k) other VNFs sending 1/(n-1) of their traffic to each of the k VNFs under the switch:

          (n - k) * k * 1/(n-1) * λ

3. And it'll get all of the packets that it sends to the SDN controller, reflected back to it.

          kλ * p_sdn

Adding it all up we get 

λ_vsw = kλ 
      + (n - k) * k * 1/(n-1) * λ
      + kλ * p_sdn

Note that only the virtual switches are impacted by the SDN controller. 

Say 1/2 of produced packets go to the SDN controller. The first cycle the edge switch will only receive λ/2 packets on average. The next cycle it will receive λ/2 new packets and λ/2 reflected packets so λ again. In the long run this averages out to λ arrival rate at the higher level switches.

### Edge switch
Following the same principle the edge switch will get all of the traffic from the VNFs under it that have to travel to the edge switch or higher. An edge switch has (k/2) * k VNFs underneath it. Communication between the k VNFs on the same server won't use the edge switch but all other communication will so that means there are (n-k) destinations for which messages will go through the edge switch. So for the outgoing traffic from the VNFs under the edge switch we get:

((k/2) * k) * (n-k)/(n-1) * λ

Similarily for the incoming traffic all (n - (k/2)*k) VNFs not under the edge switch will send an equal portion of their packets to the (k/2) * k under each edge switch:

(n - (k/2)*k) * ((k/2) * k) / (n-1) * λ

λ_edge = ((k/2) * k) * (n-k)/(n-1) * λ + (n - (k/2)*k) * ((k/2) * k) / (n-1) * λ

### Aggregate switch
The aggregate switch is a little more complicated. There are (k/2) * (k/2) * k VNFs under the aggregate switch and (k/2) * k VNFs that can be visited by a shorter path. Therefore for the outgoing traffic we get:

((k/2) * (k/2) * k) * (n-k) / n-1 * λ

Similarily for the incoming traffic:

n - ((k/2) * (k/2) * k) * (k/2) * (k/2) * k * (1/n-1) * λ

But there are (k/2) different aggregate switches that the packets can be distributed over. Hence we get:

λ_agg = (((k/2) * (k/2) * k) * (n-k) / n-1 * λ + n - ((k/2) * (k/2) * k) * (k/2) * (k/2) * k * (1/n-1) * λ) * 1/ (k/2)

### Core switch
All VNFs are under the core switch so the arrival rate is the sum of all packets that get as high as the core level, distributed over each of the core switches:

λ_core = p_core * nλ * 1 / ((k/2) ^2)

### SDN controller
Finally we can calculate the arrival rate at the controller. A portion of the packets being produced by all VNFs will visit the SDN controller.

λsdn = n · psdn · λ

## Waiting Times
Finally we can calculate the all important waiting times. For w_vnf, w_vsm, w_edge, w_agg and w_core it is as simple as substituting the arrival rates we just calculated into equation 1.

For the SDN we have to account for the additional time spent waiting at the virtual switch on the return trip and the probability of packets visiting the SDN in the first place. 

w_sdn = (MM1(μ, λ_sdn ) + w_vsw ) · p_sdn

Substitute that all back into equation 2 and it's done.

## Long and Many Services
Equation 2 only gives us the waiting time for chains where only one pass through the network is required i.e. a service with only two network functions. It can't tell us anything about services with several network functions and, more than likely, that's what we're going to see in reality.

The first difference that this makes is that packets will have to make more than one pass through the network. We already calculated the latency for a single pass through the network with equation 2. If one pass takes that long, several passes should just be that times the number of passes. As packets start at a VNF the number of passes is given by:



However longer services also means that packets stay in the network for longer. This also affects the arrival rate at each of the components. Imagine for a moment that all of the VNFs send a packet to another VNF every cycle. Imagine also that these packets have to visit two VNFs in order to complete the service:


After the first cycle all of the VNFs would have sent and received one packet:


At the second cycle they would all send two packets. One new packet, and one that they received before


At the third cycle they would all send two packets again. One new packet and one that they received in the second cycle. The packet from the first cycle will have visited three VNFs and will not be forwarded any further.


So the longer the service the more packets are being produced. From this example it seems to make sense that the *effective production rate* is increased the longer the service is. More precisely the effective production rate is given by the number of passes through the network a service requires.


What about if we have multiple services of different lengths in the same network? Imagine if half of the VNFs produced packets that belonged to a service that was two long and half that was three long. After the first cycle all of the VNFs would have sent and received one packet. But after the second cycle half of the VNFs would send two packets and half of them would only send one. The average effective production rate would be 1.5 packets per cycle.

If we say that when a packet is first produced it has probability p(service_i) of belonging to service i, the average effective production rate is dependant on the expected number of passes through the network. More formally:


Like the effective production rate, the average latency is dependant on the average number of passes through the network. Bringing everything together we get the average latency for one or more services of varying lengths with an SDN controller in the mix as:

Latency = latency_base(\beta_eff, \mu_vnf, \mu_vsw, \mu_sdn) * \sum_i length(i) * p_(service_i)

Nice.

## It works!
We can test the model by implementing it and comparing the results to a simulation that uses the same assumptions. The simulation works by modelling each event e.g. when a packet arrives at a switch and when it leaves. Since the model is just maths it can be implemented in about 8 lines of code and runs very fast whilst the simulation is a bit trickier and you need to run it for a while until it stabilises. For this work I used Matlab to program the model and OMNeT++, a network emulation tool, to build the simulation. Finally we can track the expected and actual latency and compare the results:

The match is pretty much perfect which is a very good sign. For the model, I've only plotted the points where it is stable - that is where the arrival rate is less than the service rate as past this point the queue will grow infinitely long. All we can really say in this case is that the latency is unbounded.

However there is more work to do. So far our model only considers the case where packets make one traversal through the network, that is where the service only has a length of two. However we know that NFV chains can be arbitrarily long. Also our VNFs are pretty uninspiring and don't have any impact on the amount of data that is arriving or leaving either. We'll fix these issues - and look at some additional objectives in the next post.