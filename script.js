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
 *   - Name search: a search box (#search-name) that narrows the cards to
 *     names containing the typed text, ignoring case, as the user types.
 *   - Species filter: a menu (#filter-species) for All species, Dogs, Cats,
 *     and Rabbits that combines with the Available/Adopted filter.
 *   - Remove button: each card has a Remove button that deletes that animal
 *     from the data, and the count updates to match.
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

// Extra credit: the species menu and search box save their choices here,
// the same way the filter buttons use activeFilter.
let activeSpecies = "all";
let searchText = "";

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

		// Extra credit: Remove button. Like the Adopt/Return button, its
		// callback is a closure that remembers this card's animal, so it
		// passes the right id to removeAnimal() when clicked.
		const removeButton = document.createElement("button");
		removeButton.type = "button";
		removeButton.textContent = "Remove";
		removeButton.addEventListener("click", function () {
			removeAnimal(animal.id);
		});

		card.append(nameHeading, speciesText, ageText, statusText, button, removeButton);
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
// Extra Credit: Remove an Animal
// ------------------------------------

function removeAnimal(animalId) {
	// animals is a const, so I can't assign a filtered array back to it.
	// Instead I find the animal's position and use splice() to take it out
	// of the real array, which every other function reads from.
	const index = animals.findIndex(function (a) {
		return a.id === animalId;
	});

	// findIndex() returns -1 when nothing matches, and splice(-1, 1) would
	// wrongly delete the last animal, so stop here instead.
	if (index === -1) {
		return;
	}

	animals.splice(index, 1);

	// updateDisplay() also calls updateCount(), so both the cards and the
	// "X of Y" message reflect the smaller shelter right away.
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

	// Extra credit: species filter. It runs on whatever the availability
	// filter left behind, so the two stack (e.g. Available + Dogs).
	if (activeSpecies !== "all") {
		visibleAnimals = visibleAnimals.filter(function (animal) {
			return animal.species === activeSpecies;
		});
	}

	// Extra credit: name search. Both sides are lowercased so "lu", "LU",
	// and "Lu" all match Luna. An empty search box matches every name
	// because every string includes "", so this is skipped in that case.
	if (searchText !== "") {
		visibleAnimals = visibleAnimals.filter(function (animal) {
			return animal.name.toLowerCase().includes(searchText);
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
	const countText = document.querySelector("#animal-count");

	// Count from the full animals array, not the filtered cards, so the
	// numbers describe the whole shelter. That way filtering or sorting
	// never changes the message; only adopting or returning does.
	const availableAnimals = animals.filter(function (animal) {
		return !animal.adopted;
	});

	countText.textContent = `${availableAnimals.length} of ${animals.length} animals are available for adoption.`;
}

// ------------------------------------
// Page Controls
// ------------------------------------

const allButton = document.querySelector("#show-all");
const availableButton = document.querySelector("#show-available");
const adoptedButton = document.querySelector("#show-adopted");
const sortSelect = document.querySelector("#sort-animals");

// The controls never touch the cards directly. Each one just records what
// the user picked in activeFilter or activeSort, then asks updateDisplay()
// to rebuild the list. Keeping that choice in a variable is what lets the
// filter and sort stay in place after an animal is adopted or returned.
allButton.addEventListener("click", function () {
	activeFilter = "all";
	updateDisplay();
});

availableButton.addEventListener("click", function () {
	activeFilter = "available";
	updateDisplay();
});

adoptedButton.addEventListener("click", function () {
	activeFilter = "adopted";
	updateDisplay();
});

// "change" fires once the user picks a new option. The option values in
// index.html ("default", "name", "age") match what updateDisplay() checks.
sortSelect.addEventListener("change", function () {
	activeSort = sortSelect.value;
	updateDisplay();
});

// Extra credit controls. These follow the same pattern as above: save the
// user's choice, then let updateDisplay() combine it with everything else.
const speciesSelect = document.querySelector("#filter-species");
const searchInput = document.querySelector("#search-name");

speciesSelect.addEventListener("change", function () {
	activeSpecies = speciesSelect.value;
	updateDisplay();
});

// "input" fires on every keystroke (and when the box is cleared), so the
// cards update live while typing instead of waiting for Enter. trim() keeps
// a stray space from hiding every card.
searchInput.addEventListener("input", function () {
	searchText = searchInput.value.trim().toLowerCase();
	updateDisplay();
});

// Display the original list and the count when the page first opens.
displayAnimals(animals);
updateCount();
