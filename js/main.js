var src 
	= "/img/background.jpg";

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