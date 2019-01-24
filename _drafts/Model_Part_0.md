TLDR: All modelling approaches have their trade offs but we'll start with a queueing theory based model since it can be made fast and is approximately accurate

In the last post we discussed the requirements for our solution. Without going into it too much we decided that we will need a fast and accurate model that can deduce the following metrics:

- End-to-End Latency
- Throughput
- Packet Loss
- Energy Consumption
- Network Resilience

There are three different techniques that may meet our requirements: simulation, heuristics or a mathematical model.

### Simulations
Pros: Accurate, simple
Cons: Slow

The easiest way of getting very accurate models of a network is to simulate every packet and run the simulation until it becomes stable. There are some great free tools that we can use to build network simulations that would allow us to build any network we want from which we can simply record all of the properties we are interested in.

Unfortunately no matter what we do these simulations are going to be fairly slow. Typically I would expect a small network (~100 servers) to take 30-40 seconds to stabilise with the time taken to stabilise increasing drastically as we scale the network up. It is possible to work around this in our optimisation algorithm but in doing so we may just be pushing the complexity to a later stage.

### Heuristics
Pros: Very fast, simple
Cons: Inaccurate (possibly)

At the other end of the spectrum are heuristics. With heuristics we take our ideas about what a good solution would look like, for example we might say that a network that doesn't use many servers wouldn't use very much energy or that a network that has lots of VNFs will have low latency and high throughput. These statements are probably true - to some extent anyway. If we're careful with the design of our heuristic these can be very fast and may push our optimisation algorithm towards good solutions.

Heuristics take a lot of complexity out of a problem but this is a double edged sword. At some point we have to implement our solution on a real set of servers. Until this point we can't say whether the solution we have found is a good solution for the 'real' problem or just for our simplified version of it. In the worst case the solution we find might not even be feasible in practice. 

### Queueing Theory
Pros: Fast, approximately accurate
Cons: Complex

Theres more mathematical models for networks than you can shake a stick at - and that's assuming we don't try and create something of our own from scratch - but I'm more interested in making things better than fiddling around too much with the model so I'm happy to work from one of the established areas

Queueing theory is the study of queues, surprisingly enough. It was first developed to model queues at telephone switches and has since been applied to all sorts of different problems but it has never forgotten it's roots in networking. Researchers in this field have systematically broken down queues with different properties so that metrics such as the mean waiting time, throughput and variance can be calculated with simple expressions.

Unfortunately queueing theory has a tendency to get very hard, very quickly. Particularly as soon as you start to stray too far from the well studied models or venture into modelling networks of queues. Deducing new properties of a queue can be a PhD in and of itself.

In summary: fast, simple, accurate - pick two.

We can pretty much rule out a simulation based approach; current implementations are necessarily too slow for the scale we'd like to reach. That said they will still be very useful for validating any metrics we derive from either of the other two approaches.

At this stage we cannot rule out a heuristic approach completely and indeed a lot of optimisation research in this field has relied on simple heuristics like these. Personally I've not found any of these implementations convincing. Heuristics are generally only as good as the authors understanding of the problem is complete. So that may be a good approach to come back to at some point in the future once we have a better understanding of how different variables affect each metrics.

Our best (or only remaining) option then is a mathematical model based in queueing theory. The next post will introduce the fundamentals of queueing theory in more detail and discusses how we could potentially implement our five metrics.