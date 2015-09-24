var evolvingElements = document.getElementsByClassName("evolve");

var initialWait = 5;
var maxWait = 100;

for(var i = 0; i < evolvingElements.length; i++) {	
	evolveTo(evolvingElements[i].getAttribute("data-target"), evolvingElements[i]);
}

function evolveTo(target, element) {
	var len = target.length;
		
	// Generate base with the same number of characters
	var original = generateBase(len);
	
	element.innerHTML = original;
	
	var originalFitness = fitnessEvaluation(original, target);
	
	if (originalFitness > 0) {
		window.setTimeout(evolveStep, initialWait, original, target, originalFitness, originalFitness, element);
	}
}

function evolveStep(current, target, prevFitness, maxFitness, element) {
	
	// Pick a random position
	var pos = randUnder(current.length);
		
	// Increment or decrement it
	var change = randUnder(2) ? 1 : -1;
	var newChar = nextChar(current.charAt(pos), change);
		
	// Replace it in the original string
	current = setCharAt(pos, newChar, current);
		
	// Evaluate it for fitness and if it is better replace it
	var newFitness = fitnessEvaluation(current, target);
	
	var currentWait = (1 - (newFitness / maxFitness)) * maxWait;
	
	if (newFitness < prevFitness) {
		
		element.innerHTML = current;
		
		if (newFitness > 0) {
			prevFitness = newFitness;
			window.setTimeout(evolveStep, currentWait, current, target, newFitness, maxFitness, element);
		}
	} else {
		evolveStep(element.innerHTML, target, prevFitness, maxFitness, element)
	}
}

function nextChar(c, i) {
    return String.fromCharCode(c.charCodeAt(0) + i);
}

function setCharAt(index, character, candidate) {
	return candidate.substr(0, index) + character + candidate.substr(index + character.length);
}

function generateBase(len) {
	var allowed = "abcdefghijklmnopqrstuvwxyz";
	var text = "";

    for (var i = 0; i < len; i++) {
        text += allowed.charAt(randUnder(allowed.length));
	}

    return text;
}

function fitnessEvaluation(current, target) {
	var fitness = 0;
	
	// See how far each character is from the ideal
	for (var i = 0; i < current.length; i++) {
		fitness += Math.abs(target.charCodeAt(i) - current.charCodeAt(i));
	}

	return fitness;
}

function randUnder(len) {
	return Math.floor(Math.random() * len)
}