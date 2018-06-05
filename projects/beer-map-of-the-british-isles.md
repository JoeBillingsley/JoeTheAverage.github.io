---
layout: project
title: Make a beer map of the British Isles
category: me
description: Create a map of the British Isles using bottle caps from regional beers
tags: [beer]
---
### The Project
I'm working (if it can be called working) to create a map of the British Isles using bottle caps from regional beers. That mainly involves getting obscure beers from across the country and drinking them. There are a few rules:

<ol>
    <li>Only one beer from each brewery</li>
    <li>The beer must have an interesting bottlecap</li>
    <li>I have to have actually drunk the beer the cap comes froms</li>
</ol>

The first two rules are make sure the map looks interesting. The last one is because I like beer.

### Progress
So far I've managed to get beers from {{ site.data.beers | size }} different breweries. A bit of rough maths puts the target at either 150 to to make an A3 sized map of britain or 300 for an A2 sized one.

{% include beer_map.html %}

The list contains a couple of beers as well as different breweries. This is because smaller breweries are always being bought up by bigger companies, particular in the last 20 years or so, but the beers seem too important to exclude. Currently I've got bottle caps from:
<ul class="split-list">
    {% assign beers = site.data.acquired_beers | sort: 'Brewery' %}
    {% for beer in beers %}
        <li>{{ beer.Brewery}}</li>
    {% endfor %}
</ul>
