---
layout: project
title: 100 Bottlecaps Collected!
category: me
description: Beers to celebrate!
tags: [beer, map]
---
In this historic moment, surely to be met with celebrations around the globe - I've collected roughly a third of the material needed to build a map of the British Isles out of beer bottle caps. Now seems a good a time as any to have a quick look the progress that has been made over the last year and a half (-ish).

## The Map
<!-- Beer map  -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="
crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"
integrity="sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log=="
crossorigin=""></script>

<div class="map" id="beer_map"></div>

<script>
    var beer_map = L.map('beer_map').setView([54.428845, -3.727167], 5);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 16,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam9lYmlsbGluZ3NsZXkiLCJhIjoiY2o5djYzdDNnMWhxMjJ2cG9iYzZmZzl5MyJ9.hOoHCtzze8-YCBodh8tkFQ'
    }).addTo(beer_map);

    var src = "http://www.josephbillingsley.co.uk/public_data/beer_100.json";

    function onEachFeature(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(feature.properties.name);
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET",src,true);
    xhr.onload = function(e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var beers = JSON.parse(xhr.responseText);
                L.geoJSON(beers,{
                    onEachFeature: onEachFeature
                }).addTo(beer_map);
            } else {
                console.error(xhr.statusText);
            }
        }
    }

    xhr.send(null);
</script>
<!-- /Beer map  -->

Overall the map is looking diverse with caps from all over the place. I was worried that there would be a bit of a bias towards the south (since that's where I've been living) and while that is present it doesn't look like it'll be too much of an issue. A bigger problem is that (surprisingly enough) breweries tend to congregate near large population centres  so whilst I've got far too many bottlecaps from London already getting beers from the Scottish highlands is proving a bit of a challenge.

## The Progress
I've been tracking the progress of this map on github which means I can look at the revision history and see what beers I drank and when. Unfortunately I didn't think to start documenting everything properly until I was about 40 beers. Anyway, here's a graph: 

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js"></script>

<canvas id="progress_line" width="400" height="200"></canvas>
<script>
var ctx = document.getElementById("progress_line").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: '# of Beers',
            data: [ {x: new Date(2017, 11, 12), y: 42},
                    {x: new Date(2017, 11, 23), y: 43},
                    {x: new Date(2018, 01, 8), y: 48},
                    {x: new Date(2018, 02, 9), y: 49},
                    {x: new Date(2018, 02, 15), y: 51},
                    {x: new Date(2018, 02, 18), y: 53},
                    {x: new Date(2018, 02, 23), y: 54},
                    {x: new Date(2018, 02, 25), y: 55},
                    {x: new Date(2018, 03, 05), y: 57},
                    {x: new Date(2018, 03, 07), y: 59},
                    {x: new Date(2018, 03, 22), y: 60},
                    {x: new Date(2018, 03, 25), y: 61},
                    {x: new Date(2018, 04, 05), y: 62},
                    {x: new Date(2018, 04, 09), y: 63},
                    {x: new Date(2018, 04, 15), y: 65},
                    {x: new Date(2018, 05, 07), y: 69},
                    {x: new Date(2018, 05, 14), y: 70},
                    {x: new Date(2018, 05, 23), y: 71},
                    {x: new Date(2018, 06, 06), y: 72},
                    {x: new Date(2018, 06, 14), y: 73},
                    {x: new Date(2018, 06, 20), y: 74},
                    {x: new Date(2018, 06, 21), y: 75},
                    {x: new Date(2018, 06, 24), y: 77},
                    {x: new Date(2018, 07, 02), y: 78},
                    {x: new Date(2018, 07, 07), y: 80},
                    {x: new Date(2018, 07, 16), y: 84},
                    {x: new Date(2018, 07, 19), y: 85},
                    {x: new Date(2018, 07, 23), y: 87},
                    {x: new Date(2018, 07, 26), y: 88},
                    {x: new Date(2018, 07, 31), y: 89},
                    {x: new Date(2018, 08, 02), y: 90},
                    {x: new Date(2018, 08, 06), y: 91},
                    {x: new Date(2018, 08, 26), y: 93},
                    {x: new Date(2018, 09, 12), y: 94},
                    {x: new Date(2018, 10, 04), y: 95},
                    {x: new Date(2018, 10, 09), y: 96},
                    {x: new Date(2018, 10, 21), y: 98},
                    {x: new Date(2018, 10, 24), y: 99},
                    {x: new Date(2018, 11, 14), y: 100},
            ],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
              type: 'time',
              time: {
                  unit: 'month'
              }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
</script>

## Awards
I don't believe in bad beer but there are certainly some that are more excellent than others. So despite me being vastly underqualified for the position - it's time for the 1st Official Billingsley Beer Awards!

#### &#9733; 100th Beer
Also the winner of the questionably prestigious <i>Most Expensive</i> beer award, this one goes to Beavertown and their Tempus Project beer Metamorph. At around £24 a litre (~£8 for 330ml bottle) it's probably the most expensive drink I've bought sober. That said it was very good - perhaps not £8 a bottle good - but very good.

#### &#9733; Best Caps
There's a lot of good caps in this list but to my mind there's only two real contenders here: Robinsons with their collection of Iron Maiden caps, and Weird Beard who have some crazy but clever designs. Weird Beard wins out for me just because of the madness of the designs (and I like their beers more).

#### &#9733; Best Hidden
This one really took me by surprise. Hidden away in a narrow shelf next to the counter of  Hopsters bottleshop in Ipswich, was a fairly generic looking traditional ale from Old Chimney's. More knowledgeable drinkers than me might know that this isn't any ordinary brewery. The Old Chimneys stout currently tops the RateBeer rankings for England and was at one time the only British beer in the top 50 worldwide. The beers are apparently particularly tricky to get hold of as, as far as I can tell, it's a one man passion project in a small town north of Ipswich. It deserves an honourary mention for <i>best cap</i> too - someone has put a sticker on by hand on each and every one.

#### &#9733; Desert Island Beer
If I really had to choose just the one beer to have for ever more, it would be have to one of the Adnams Brewery beers. I know it's not particularly exciting as far as beer goes but I could drink Ghost Ship for days and never get tired of it.

#### &#9733; Most Unusual
We don't do many fruit beers in this country but Samuel Smith's do a few fruit beers that are nice to mix things up - especially if you're not a typical beer drinker or don't like something too bitter. They can be a bit tricky to come across here but are apparently pretty well known up north. Maybe it's not as grim up there as I've been told...

#### &#9733; Best with Mint Ice Cream
Cheddar Brewery. Just trust me with this one. I think mine was Gorge Best but I'm not 100% sure about that. If you get the opportunity just buy a bunch of their beer and ice cream. Honestly, even if they weren't such a good match that'll never be a bad decision.

#### &#9733; Best Beer?
Don't make me choose. Maybe when we get to 300. Maybe.

## 100 down. 200 to go
I've got a long way to go to make this map a reality and it's only going to get more difficult from here. If you know of any beers that I'm missing or you can help in some other way - please get in touch! My contact details should be just down there &darr;&darr;&darr;