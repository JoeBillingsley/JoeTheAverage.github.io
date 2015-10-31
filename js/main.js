var src 
	= "http://blog-pickcrew.s3.amazonaws.com/wp-content/uploads/2015/10/09171001/writing-retina.jpg";

function onLoad() {
	var hero = document.getElementById("hero-background");
	
	hero.style.backgroundImage = 'url(' + src + ')';
	hero.className += " fade-in";
}

// Cache the image
var image = new Image();
image.onload = onLoad;
image.onerror = onLoad;
image.src = src;