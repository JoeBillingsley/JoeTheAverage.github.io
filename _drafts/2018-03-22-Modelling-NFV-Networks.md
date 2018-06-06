Recently I've been working on developing a mathematical model of a datacentre network with the help of Wang Miao. The idea is you can say how you would configure the network and the model will tell you how it would perform. This model is a small part of a larger solution to a huge problem. The grand goal of this particular line of work is to develop a fast model of a telecommunications network that spans across the whole of the UK. I want to build a model that we will be able to chuck into a supercomputer to try out thousands of different configurations of the network in a blink of an eye. That will give everyone a whole lot more freedom towards how we find the best configuration of the network. Whether that is possible or not - well we'll see.

Why is this important? Well we don't have the resources to run networks like we used to. It's hard to pin down exactly how much energy telecommunications networks and connected devices use but estimates have put it anywhere from [1.8% of world energy consumption in 2012](http://www.internet-science.eu/sites/eins/files/biblio/oe-20-26-B513.pdf) growing to from [23% to 53% depending on how efficient we can make them](http://www.mdpi.com/2078-1547/6/1/117/htm). There is a trade off of the amount of energy a network uses and the performance it provide. Future models will be able to help us find the solutions that balance these trade offs, providing the best performance we can whilst minimising the energy consumption.

## Background
Before we dive into the model there are a few concepts I need to introduce:

Packets - In modern telecommunications networks everything that goes over the network from phone calls to webpages gets digitised and broken down into small parcels of data called 'packets'. Each packet is labelled with it's destination in the network:

[FigurFinallye of packet. Destiation Address. Other Stuff. Data]

Network Function Virtualisation (NFV) - Network functions are a part of the network that perform a particular task. An example is a firewall which deletes packets that have destination addresses that they should not be allowed into. The 'virtual' refers to them being implemented in software rather than in hardware. Network functions are often connected in a sequence like so:

[Figure of service chain]

The Network - In this work we modelled a particular kind of network. An *SDN and NFV Enabled Datacentre Communications Network*. Unfortunately, everything in my field has long names but it's not that complicated. First, here is an example of the complete network:

[fig:network]

The network is constructed from *switches* and *servers*. Each switch has a number of ports that allow it to connect to other devices in the network. Switches look at each packets destination and decide which port to send them out of. Servers run our network functions. Each server can run any number of these network functions. The job of the network is to get packets to the network functions, in the correct order, as quickly as possible. 

The network is split into several layers:

Core/Aggregate/Edge - These aren't particular exciting layers. These simply push packets to servers or to another switch, closer to the server. Take note of how the switches are arranged - this will be important later. 

Server/Virtual Switch - In a NFV enabled network each server can run several network functions. As a result the server needs a switch of it's own, to make sure that the packets it receives go to the right network function. This important job falls to a virtual switch which runs on the same server as the network functions.

Virtual Network Functions - Finally we have the network functions themselves running on the servers.

Software Defined Networking (SDN) - Right last one. Sitting next to the network and connected to all of the servers is the SDN controller. The SDN controller gives network engineers more control over how packets move through the network. Most importantly it lets them decide on the destination of different packets. This particular layout is just one flavour of SDN and it's a little similar to how [VMware NSX](https://www.vmware.com/uk/products/nsx.html) looks.

## A little maths
The network is laid out in a very particular way. If we assume that all of the physical switches have *k* ports then:

- There are (k/2)<sup>2</sup> core switches. 
- Each core switch connects to one switch in each of the k pods. 
- Each pod contains two layers (aggregation and edge) of k/2 switches.
- Each edge switch is connected to all of the aggregation switches in the pod
- Each edge switch is also connected to k/2 servers
- Each server has a virtual switch connected to k network functions

We'll call the total number of network functions, *n*. If you work it through it turns out n = (k<sup>3</sup> / 4) * k.

As an example, in the network above k = 4. So that means we should have 4 core switches, connected to one switch in each pod. Each pod should have 2 aggregate switches and 2 edge switches which are fully connected to each other. Each edge switch is connected to 2 servers and each of those contains 2 more virtual switches.

This brings us to a grand total of 64 network functions and everything lines up.

## ...and a lot of assumptions
In this model we just want to calculate one property of the network: the average latency. That is the average time it takes for a message to get from it's source to it's destination.

There are several assumptions we have to make about how packets are going to get sent around to do this. Some of these might not make sense at first but I'll explain them all in a sec:

1. Each VNF generates packets according to an independant Poisson process with a mean rate of &lambda; packets a cycle
2. Each network component services packets according to an independant Poisson process with a mean rate of &mu; packets a cycle
3. Queues at each network component have infinite capacity
4. Packets take the shortest path between two destinations and are evenly distributed over the network
5. Packets **leaving** a server may need to visit the SDN controller with probability p_sdn_root 

So assumptions 1 and 2 sound fairly complicated but they just mean that packets arrive at a predictable rate (assumption 1) and take a predictable amount of time to get processed (assumption 2) at each server/switch. Modelling the network with Poisson processes just simplifies calculating the waiting time. With assumptions 1 - 3, a packet will on average take:

wait_time(λ, μ) = 1 / (μ - λ)

I won't go into how that's derived here but if you want to find out more you can look up [Queueing Theory](https://en.wikipedia.org/wiki/Queueing_theory#Queueing_networks). 

Something to note: the model will only work when the arrival rate (λ) is less than the service rate (μ). Equation 1 gives us the *average* waiting time. If messages arrive faster than they can be serviced then the queue will grow infinitely large and the waiting time will approach infinity as well.

Now we've got everything we need to calculate the latency in the network. If you want to have a crack at this yourself first then scroll no further! It's spoilers from here on out now.

## Calculating the latency
Given that we know from assumption 4 that messages will take the shortest path they can, we can calculate the average time taken to go down each path and the probability of a message going down that path and then calculate the expectation.

For example consider the following case where the source and destination VNF are on the same server:

In this case the shortest path the packet can take means it has to wait twice, once at the virtual switch and then at the destination VNF. If the destination is under the same edge switch, in the same pod but a different server or a different pod entirely then it would have to go through more switches:

The latency for a path is just the sum of the waiting time. To calculate the average latency considering each possible path we have to consider the probability of taking that path. The expectated latency is given by:

Latency(\beta, μ) = 
  (wvnf + wvsw) · pvsw
+ (wvnf + wsdn + 2wvsw + wedge) · pedge
+ (wvnf + wsdn + 2wvsw + 2wedge + wagg) · pagg
+ (wvnf + wsdn + 2wvsw + 2wedge + 2wagg + wcore) · pcore

Where w_vnf, w_vsw, w_sdn, w_edge, w_agg and w_core are the waiting times at a VNF, virtual switch, root SDN, edge switch, aggregate switch and core switch respectively. Similarily p_vsw, p_edge, p_agg and p_core are the probabilities that the highest level switch that a packet will visit is a virtual, edge, core or aggregate switch respectively.

## Probabilities
Now we need to calculate the probability of a packet taking a path and the average waiting time at each part of the network.

In order to get from the source to the destination efficiently a packet has to travel to the lowest level switch that they both share. For example here's the shortest path from VNF 0 to all other destinations:

So if the message goes no higher than the virtual switch then the source and destination share the virtual switch. Only k VNFs can be on under a virtual switch and 1 of those is the source. The probability of the destination being under the same virtual switch is then:

p_vsw = (k - 1) / (n - 1)

Similarily if a packet has to go no higher than the edge switch then the source and destination VNFs must share an edge switch. We know from the definition of the network that the edge switch has k/2 * k VNFs but we also have to remember not to count the VNFs that could take a shorter path.

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

First it's important to understand that as the arrival rate is less than the service rate then the production rate from a switch will be the same as the arrival rate.

### Server
Since packets are evenly distributed over the VNFs then to calculate the arrival rate at each VNF, λ_vnf, we only need to calculate the arrival rate for a single VNF.

On average (n-1) VNFs will be sending 1/(n-1) * λ of a packet to our VNF each cycle so:

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
That was a long read. If you've made it this far you might like to see some proof that this is actually correct. In this field they tend to do this by building simulations of the network, using the same assumptions as we defined earlier, and measuring the average latency in the simulation. If the model is accurate then the simulation and model should be fairly similar. 

As it turns out the model and simulation produce almost exactly the same results:


That is a very good sign that we didn't miss anything which is good because this post is long enough already. For the model, I've only plotted the points where it is stable - that is where the arrival rate is less than the service rate. If the average arrival rate is more than the service rate then the size of the queues at each component will grow larger and larger forever. The only useful thing to say when the arrival rate is consistently more than the service rate and the queue is unbounded, is that the latency is infinite.

Knowing that we can see spot some interesting things by looking at these graphs. All of the lines eventually rise very steeply. This is the region where the arrival rate is starting to approach the service rate. As there are many different components in our network, each with different arrival rates and service rates, it is interesting to see which ones get overloaded first.

It turns out that the edge switches have the highest arrival rates on average. This seems reasonable since they have the most VNFs underneath them and can't share the load with any other switches. More problematicaly though as the length of the service chain increases the effective production rate rapidly increases. Despite all switches receiving proportionaly the same traffic, edge switches can get overloaded very early in the presence of long services - even when other switches have lots of spare capacity.

## Conclusions
So that is how you calculate the average latency of NFV and SDN enabled datacentre with a fat tree interconnection topolgy. We could of course have just used the simulation in the first place and skipped all this hassle. The problem with these simulations is there slow. On average I'd say the simulation takes ~100 seconds on my work PC to get accurate measurements for latency. The model is around 8 lines of code all implemented and could run in under a millisecond on a calculator.

There is still more work to do of course. There are three more problems I'd like to fix in future models:

1. Whilst the model is a good match for the simulation, it won't match with the real world. We made too many simplifying assumptions at the start. The big ones are number 1 and 2 where we assume the packets are produced in a very particular way that's not a good match with reality. There are more accurate ways of calculating the waiting time for this kind of system but the maths is tricky and I need to get my head around it first.
2. Another assumption we made at the beginning is that packets are sent to all VNFs evenly. In practice it seems sensible to put VNFs that are part of the same service chain near to each other so that there is less load on the switches higher up in the network. The next model I make will consider the placement (it's actually really easy, I've done it already).
3. Last but certainly not least we've got some fairly boring VNFs in this model which just forward on the traffic they receive. Real world VNFs affect the production rate in more interesting ways. Filtering VNFs like firewalls reduce the effective production rate. Other VNFs like video decoders can increase it. It turns out that whilst it's very easy to accurately model filtering VNFs, encoding ones are much more tricky.

I'll be working my way through that list along with a few other things that are in the pipeline. Watch this space.