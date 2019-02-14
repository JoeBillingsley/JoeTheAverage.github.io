TLDR: We extended a model of a modern datacentre to consider long services, the presence of several services using the same network and the impact of a SDN controller.

Software Defined Networking (SDN) - Sitting next to the network and connected to all of the servers is the SDN controller. The SDN controller knows where all of the network functions are and gives instructions to the switches to ensure that packets arrive in the right place.

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

## Other notes
So for example if you need a server that has 16 processors in it, Amazon will happily rent you one from one of their datacentres. The trick with cloud computing is oversubscription. Most people don't need that much power all at once. More often than not their peak load, the time when they need the most resources, is far larger than their average load. Hence, if you are smart about things, you can sell one server to several people - you just have to be careful that you don't push it too far and ensure people can still get what they've paid for when they do need it.

With VNFs we want to do this too - more so to save energy as anything else - however we face an additional challenge.