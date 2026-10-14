"use strict";

/*
 * Animal Adoption Board
 *
 * Complete the five TODO sections below, in order.
 *
 * The TODOs depend on each other, so some of them can't be fully tested
 * until a later TODO is complete. Each TODO has a note that tells you
 * what to expect when you test it.
 *
 * EXTRA CREDIT: If you build any extra credit features, list them here
 * (see README.md). Features that are not listed here will not be graded.
 *
 *   -
 *   -
 */

// ------------------------------------
// Animal Data
// ------------------------------------

const animals = [
	{ id: 1, name: "Luna", species: "cat", age: 3, adopted: false },
	{ id: 2, name: "Biscuit", species: "dog", age: 7, adopted: true },
	{ id: 3, name: "Pepper", species: "cat", age: 1, adopted: true },
	{ id: 4, name: "Moose", species: "dog", age: 5, adopted: false },
	{ id: 5, name: "Charly", species: "dog", age: 4, adopted: false },
	{ id: 6, name: "Bill", species: "cat", age: 0.5, adopted: true },
	{ id: 7, name: "Chompers", species: "rabbit", age: 0.5, adopted: false },
	{ id: 8, name: "Beowulf", species: "dog", age: 7, adopted: true },
];

// What the user currently wants to see. The page controls change these.
let activeFilter = "all";
let activeSort = "default";

// ------------------------------------
// Display Animals
// ------------------------------------

function displayAnimals(animalArray) {
	const animalList = document.querySelector("#animal-list");
	animalList.innerHTML = "";

	if (animalArray.length === 0) {
		const emptyMessage = document.createElement("p");
		emptyMessage.textContent = "There are no animals to show.";
		emptyMessage.classList.add("empty-message");
		animalList.appendChild(emptyMessage);
		return;
	}

	// Build one card per animal. The list was cleared above, so every redraw
	// starts from nothing and only shows the animals passed in this time.
	animalArray.forEach(function (animal) {
		const card = document.createElement("article");
		card.classList.add("animal-card");

		// The "adopted" class greys the card out (see style.css) so adopted
		// animals stand out from the available ones at a glance.
		if (animal.adopted) {
			card.classList.add("adopted");
		}

		const nameHeading = document.createElement("h3");
		nameHeading.textContent = animal.name;

		const speciesText = document.createElement("p");
		speciesText.textContent = `Species: ${animal.species}`;

		const ageText = document.createElement("p");
		ageText.textContent = `Age: ${animal.age}`;

		const statusText = document.createElement("p");
		statusText.textContent = animal.adopted ? "Status: Adopted" : "Status: Available";

		// An available animal can be adopted, and an adopted animal can be
		// returned, so the button label depends on the current status.
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = animal.adopted ? "Return" : "Adopt";

		// This callback doesn't run now while the cards are being built. It only
		// runs later, when the user actually clicks this button. It knows which
		// animal to change because it's a closure: it was created inside this
		// forEach() callback, so it remembers the `animal` variable from this
		// pass of the loop. Each button gets its own callback holding its own
		// animal, so clicking Moose's button always sends Moose's id.
		button.addEventListener("click", function () {
			toggleAdoption(animal.id);
		});

		card.append(nameHeading, speciesText, ageText, statusText, button);
		animalList.appendChild(card);
	});
}

// ------------------------------------
// Adopt or Return an Animal
// ------------------------------------

function toggleAdoption(animalId) {
	// find() gives back the actual object stored in the animals array, so
	// changing it here changes the real data, not a copy.
	const animal = animals.find(function (a) {
		return a.id === animalId;
	});

	// find() returns undefined when no id matches. Stop here instead of
	// trying to read .adopted on undefined, which would throw an error.
	if (!animal) {
		return;
	}

	// One function covers both buttons: flipping true/false means Adopt
	// marks the animal adopted and Return marks it available again.
	animal.adopted = !animal.adopted;

	// Redraw using the current filter and sort so the user's view stays put.
	updateDisplay();
}

// ------------------------------------
// Filter, Sort, and Update
// ------------------------------------

function updateDisplay() {
	// sort() rearranges the array it's called on instead of returning a new
	// one. If I sorted `animals` directly, its original order would be lost
	// for good, and picking "Original order" again would have nothing to go
	// back to. Working on a slice() copy keeps `animals` in its starting order
	// so every redraw can rebuild the view from the same untouched list.
	let visibleAnimals = animals.slice();

	// filter() returns a new array rather than changing this one, so the
	// result has to be saved back into visibleAnimals. "all" skips both.
	if (activeFilter === "available") {
		visibleAnimals = visibleAnimals.filter(function (animal) {
			return animal.adopted === false;
		});
	} else if (activeFilter === "adopted") {
		visibleAnimals = visibleAnimals.filter(function (animal) {
			return animal.adopted === true;
		});
	}

	// The compare callback tells sort() which of two animals goes first.
	// localeCompare() handles alphabetical order for strings, and subtracting
	// ages puts the younger animal first (a negative result means a before b).
	// "default" skips sorting, leaving the copy in the original order.
	if (activeSort === "name") {
		visibleAnimals.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		});
	} else if (activeSort === "age") {
		visibleAnimals.sort(function (a, b) {
			return a.age - b.age;
		});
	}

	displayAnimals(visibleAnimals);
	updateCount();
}

// ------------------------------------
// Available Count
// ------------------------------------

function updateCount() {
	/*
	 * TODO #4: Show how many animals are still available.
	 *
	 * 1. Select the #animal-count paragraph.
	 * 2. Use filter() on the full animals array (not just the visible
	 *    cards) to find the animals that are not adopted.
	 * 3. Set the paragraph's textContent to a message like:
	 *
	 *      4 of 8 animals are available for adoption.
	 *
	 *    Calculate both numbers. Do not type 4 or 8 directly.
	 *
	 * Note: When this TODO is complete, the message appears when the page
	 * opens and changes every time an animal is adopted or returned.
	 */
}

// ------------------------------------
// Page Controls
// ------------------------------------

const allButton = document.querySelector("#show-all");
const availableButton = document.querySelector("#show-available");
const adoptedButton = document.querySelector("#show-adopted");
const sortSelect = document.querySelector("#sort-animals");

/*
 * TODO #5: Connect the controls to updateDisplay().
 *
 * Add click listeners to the three filter buttons. Each callback should set
 * activeFilter to "all", "available", or "adopted", then call
 * updateDisplay().
 *
 * Add a change listener to sortSelect. Its callback should copy
 * sortSelect.value into activeSort, then call updateDisplay().
 *
 * Note: When this TODO is complete, every part of the app should work.
 * Go back and test the filter and sort code you wrote in TODO #3.
 */

// Display the original list and the count when the page first opens.
displayAnimals(animals);
updateCount();
