TODO: Add figures
      Add mathjax

TLDR: We built a mathematical model of a modern datacentre that can tell you interesting things about performance under different configurations.

In this post I am going to explain in detail the logic behind a model of virtual network placement in modern datacentres. This model doesn't consider the actual placements like later models will but it can still provide some useful insights and more importantly some intuition about the problem. First I will provide some basic background about the particulars of the problem, then we will solve it and finally show it works and draw some insights.

I've written a much more detailed explanation of the virtual network function (VNF) placement problem before over here but as a quick summary:
- In modern networks, services are provided by chaining together sequences of 'network functions' e.g. firewalls, encoding, quality of service management etc.
- Previously, these network functions where provided by purpose built computers but increasingly it is preferable to run these network functions in software in virtual machines to create: virtual network functions
- Now the challenge becomes how we allocate resources (processor time, memory, storage space etc) to these virtual machines so as to provide a good quality of service 

If you are familiar with it this will sound similar to the issues when managing a cloud computing environment and in many ways it is very similar. In cloud computing the challenge is similar, people pay you to be able to provide a certain amount of computing resource whenever you need it. So for example if you need a server that has 16 processors in it, Amazon will happily rent you one from one of their datacentres. With cloud computing we don't generally have to worry about where in the datacentre we place the network functions because we are just selling resources. However when we're placing VNFs we are not usually selling resources but selling a certain quality of service. So instead of buying a server your buying a guarantee that the service you are providing will have low latency, high throughput and 99.99999% uptime. This moves the hard decision of choosing how much resources are needed from the consumer to the service provider. Now to make these decisions at a huge scale we need to move this intelligent decision making from humans to computers. And the first step to doing this, in my mind at least, is to model it and to really understand how the problem fits together.

So finally we need to talk a little about how a datacentre is wired up. Datacentres have thousands of servers, to keep things organised and make sure that routing (the process of getting a message from one server to another) is efficient, it helps to have a well defined structure. One very common structure is called a **fat tree**, for this work we've augmented this structure a bit to look like this:

[fig:network]

Datacentre networks are constructed from *switches* and *servers*. Each switch has a number of ports that allow it to connect to other devices in the network. Switches look at each packets destination and decide which port to send them out of. Servers run our network functions. Each server can run any number of these network functions - provided it has enough resources. The job of the network is to get packets to the network functions, in the correct order, as quickly as possible. 

The network is split into several layers:

Core/Aggregate/Edge - These aren't particular exciting layers. These simply push packets to servers or to another switch, closer to the server.

Server/Virtual Switch - In a NFV enabled network each server can run several network functions. As a result the server needs a switch of its own, to make sure that the packets it receives go to the right network function. The virtual switch is run on the same server as the VNFs.

Virtual Network Functions - Finally we have the network functions themselves running on the servers.

Fat tree networks can be defined If we assume that all of the switches have *k* ports then:

- There are (k/2)<sup>2</sup> core switches. 
- Each core switch connects to one switch in each of the k pods. 
- Each pod contains two layers (aggregation and edge) of k/2 switches.
- Each edge switch is connected to all of the aggregation switches in the pod
- Each edge switch is also connected to k/2 servers
- Each server has a virtual switch connected to k network functions

We'll call the total number of network functions, *n*. If you work it through it turns out n = (k<sup>3</sup> / 4) * k.

As an example, in the network above k = 4. So that means we should have 4 core switches, connected to one switch in each pod. Each pod should have 2 aggregate switches and 2 edge switches which are fully connected to each other. Each edge switch is connected to 2 servers and each of those contains 2 more virtual switches. Following our equation this would give us n = 64 network functions.

The structure of a Fat Tree network makes it very easy to route packets. We can also see from the figure that there are several different ways of getting through the network. In general we want to minimise the number of switches we have to visit; we will refer to this as taking an efficient path. At the aggregation and core layers we will also want to distribute packets over as many switches as is reasonable so that the work of handling the packets is balanced.

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

## It works!
We can test the model by implementing it and comparing the results to a simulation that uses the same assumptions. The simulation works by modelling each event e.g. when a packet arrives at a switch and when it leaves. Since the model is just maths it can be implemented in about 8 lines of code and runs very fast whilst the simulation is a bit trickier and you need to run it for a while until it stabilises. For this work I used Matlab to program the model and OMNeT++, a network emulation tool, to build the simulation. Finally we can track the expected and actual latency and compare the results:

The match is pretty much perfect which is a very good sign. For the model, I've only plotted the points where it is stable - that is where the arrival rate is less than the service rate as past this point the queue will grow infinitely long. All we can really say in this case is that the latency is unbounded.

However there is more work to do. So far our model only considers the case where packets make one traversal through the network, that is where the service only has a length of two. However we know that NFV chains can be arbitrarily long. Also our VNFs are pretty uninspiring and don't have any impact on the amount of data that is arriving or leaving either. We'll fix these issues - and look at some additional objectives in the next post.