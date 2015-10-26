var src 
	= "http://blogs.birmingham.k12.mi.us/piercewearetheworld/files/2013/11/world-map-19mn2mn.gif";

function onLoad() {
	var hero = document.getElementById("hero-background");
	
	hero.style.backgroundImage = 'url(' + src + ')';
	hero.className += " fade-in";
	
	var role = document.getElementById("role-content");
	
	role.textContent = "";
	
	updateRole(role, "Hello world!", 0);
}

function updateRole(target, newText, i) {
		
	if(i < newText.length) {
		
		setTimeout(function() {
			
			target.textContent += newText[i];
			updateRole(target, newText, ++i);
			
		}, 100);
	}
}

// Cache the image
var image = new Image();
image.onload = onLoad;
image.onerror = onLoad;
image.src = src;