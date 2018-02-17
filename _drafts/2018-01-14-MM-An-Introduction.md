---
layout: post
title: An Introduction to Modern Metaheuristics
excerpt: An introduction to my favourite topic in computer science
category: travel
tags: [metaheuristics, practical, example]
include_leaflet: true
include_leaflet_routing: true
---

Metaheuristics are a tool for solving hard and hard to define problems. They've been used to solve complex problems in [space](https://www.nasa.gov/centers/ames/research/technology-onepagers/evolvable_systems.html), [robotics](https://hackaday.com/2016/03/14/making-dumb-robots-evolve/) and [machine learning](https://deepmind.com/blog/population-based-training-neural-networks). **A good metaheuristics can find near optimal solutions to any problem you can throw at it**.

This series of posts is intended to introduce you to the fundamentals of this powerful tool. I want to provide a simple foundation that we can build on in future posts, exploring more complex parts of this fascinating topic. We'll also be laying out the many caveats to that bold statement I made a moment ago. Most importantly though we'll be applying these algorithms to real world problems wherever possible. In this first post we'll be discussing the most important property of metaheuristics: their complete *apathy* about your problems.

<hr>

We'll start with the most important real world problem I can think of. For a long time I've been meaning to build a tool to combine two of my passions and produce a pub crawl planner. In the first part of this series that dream will finally be realised. In computer science this is called the 'travelling salesman problem' but I think this particular variant is probably better described as the 'stumbling student problem'

Below is a map with all the best pubs in Exeter marked onto it. Your task is to find the shortest route that stops at every pub, starting from a pub of your choosing.

*Click to select a pub, click another to path to it.*

<p>
    Distance walked <span id="dist"></span> metres
</p>
<div class="map hide_routes" id="exeter_pub_map"></div>

<input type="Button" onclick="reset()" value="Reset">

<script>
    var pub_map = L.map('exeter_pub_map', {
        maxZoom: 20,
        minZoom: 14
    })

    var defaultIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var usedIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    pub_map.setView([50.726774,-3.528914], 15);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam9lYmlsbGluZ3NsZXkiLCJhIjoiY2o5djYzdDNnMWhxMjJ2cG9iYzZmZzl5MyJ9.hOoHCtzze8-YCBodh8tkFQ'
    }).addTo(pub_map);

    var control = L.Routing.control({
        draggableWaypoints: false,
        routeWhileDragging: false
    }).addTo(pub_map);

    control.hide();

    pubs = [
        {
            title: "The Imperial",
            coordinates: L.latLng(50.7302616, -3.5420546),
        },
        {
            title: "Mill on the Exe",
            coordinates: L.latLng(50.7220074,-3.5404234),
        },
        {
            title: "The Chevalier Inn",
            coordinates: L.latLng(50.7226647,-3.5350497),
        },
        {
            title: "The Angel",
            coordinates: L.latLng(50.7247973,-3.5341429),
        },
        {
            title: "Black Horse",
            coordinates: L.latLng(50.7252184,-3.5315411)
        },
        {
            title: "The Globe",
            coordinates: L.latLng(50.7288359,-3.5279128)
        },
        {
            title: "Stoke Arms",
            coordinates: L.latLng(50.7310101,-3.5279378)
        },
        {
            title: "Ram Bar",
            coordinates: L.latLng(50.735416,-3.536568)
        },
        {
            title: "Victoria Inn",
            coordinates: L.latLng(50.7334461,-3.5246085)
        }
    ]

    var osrm = L.Routing.osrmv1();
    var path_markers = []
    var route; 

    var placed_markers = [];

    for (var i = 0; i < pubs.length; i++) {
        var marker = L.marker(pubs[i].coordinates);
        marker.bindTooltip(pubs[i].title);
        marker.id = i;

        marker.on('click', function(e) {
            var pub = pubs[this.id];

            if(pub.selected)
                return;

            this.setIcon(usedIcon);

            var waypoint = new L.Routing.Waypoint(pubs[this.id].coordinates);
            path_markers.push(waypoint);

            osrm.route(path_markers, function(err, routes) {
                if(routes == null)
                    return

                document.getElementById("dist").textContent 
                    = Math.round(routes[0].summary.totalDistance);

                if(pub_map.hasLayer(route))
                    pub_map.removeLayer(route);
                
                route = L.Routing.line(routes[0]);
                route.addTo(pub_map);
            });

            pub.selected = true;
        });

        marker.addTo(pub_map);
        placed_markers.push(marker);
    }

    function reset() {
        for (var i = 0; i < pubs.length; i++) {
            pubs[i].selected = false;
            path_markers = [];

            placed_markers[i].setIcon(defaultIcon);

            if(pub_map.hasLayer(route))
                pub_map.removeLayer(route);
        }

        document.getElementById("dist").textContent = 0;
    }
</script>

I'm going to guess that you tried one of three things just now:

1. You randomly connected a bunch of pubs
2. You picked the closest next pub each time
3. You tried every possible combination of pubs

I sincerely hope you didn't try option 3 as by my calculations there is 362880 different combinations even for this simple problem. For a computer thats not too bad and we can evaluate all of the different combinations fairly quickly.



But Exeter is a pretty boozy town and there's around 60 places you can get a drink within reasonable walking distance of the town centre. That works out at about 8.3x10<supscript>81</supscript> (or 8 followed by 81 zeros) different combinations. Maybe a supercomputer could calculate that in an acceptable amount of time but on my old laptop we'd be waiting a lifetime.

A good idea would be to think of some sensible process of choosing the pubs. In computer science this is called a heuristic. It's a way of solving a particular problem that gives us a sufficiently good solution, if not an optimal one, fast. The most obvious heuristic is to go to the nearest pub from the previous one. Running this on the full platter of pubs gives us a decent result within _ % of the optimal solution:


The problem is there's no guarantee that such a simple algorithm will find the true best solution, or even a particularly good one. As an example consider this theoretical layout of pubs:

<img class="center" src = "{{ site.baseurl }}/img/MBE/greedy_trap_case.svg" alt = "An example of a problem where the simple heuristic does not work. Several pubs are placed near to each other in a sequence. One pub is placed in the middle, further from the others. The simple heuristic will not be able to find the optimal path.">

In this scenario if we always go to the nearest pub then we'll inevitably have to backtrack to the pub we missed earlier.

So what can we do about it? Well I've good news for the option 1 people! This simple algorithm is the first thing that we could arguably call a *metaheuristic*. We can formalise this approach into a simple algorithm if we just choose a random pub that we haven't visited yet at each step. The results are probably as you'd expect.

But whats really interesting is the progression of the results.

Sure the results are terrible but *they're improving* and given enough time the algorithm will eventually hit on the optimal result. In fact if we didn't allow the algorithm to generate the same solution more than once then it would be no slower than the brute force solution. 

We're doing something a little odd so far though. If we generate a 1000 solutions then it seems reasonable to assume that the best solution we've seen must have something in common with the optimal solution. Yet currently we make the 1001th solution the same way we make the 1st.

This is the idea behind all metaheuristics. If we can make some assumptions about the problem then we can use the results of earlier solutions to be more likely to produce better solutions in the future. This is the principle behind metaheuristics that allows us to get some excellent results very quickly.

I hope that has given you a bit of an intuition into what a metaheuristic is and the kind of problems they might be suitable for. In the next post I'm going to formally introduce some of the key important concepts in metaheuristics that you need to know for whatever direction you go in this field and then we'll dive into some algorithms.








The really cool bit is that none of the approaches (other than the heuristic) are problem specific. So long as you can define some objective to minimise or maximise then you can use these algorithms to solve them.

We can still improve this algorithm. Imagine the optimal solution for a moment. Now imagine a solution that is one step away from the optimum. This new solution must be worse than the optimum. We can use this information to find the best local optimum.

Instead of generating a new solution each time we could instead swap the order of two random pubs. If this new path is better then we're heading in the right direction and we repeat the process on the new path. If the new path is worse or the same we can keep the old one. By following these approach we're guaranteed to find the best solution in the vicinity.

Quite often in computer science you can't remove the complexity from a problem. The best you can hope to do is to transform it from a problem you don't understand into one which you sort of understand.