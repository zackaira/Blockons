document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM fully loaded and parsed");

	// Function to close all select boxes except the current one
	function closeAllSelect(currentElement) {
		const items = document.getElementsByClassName("select-items");
		const selectedItems = document.getElementsByClassName("select-selected");
		for (let i = 0; i < selectedItems.length; i++) {
			if (currentElement !== selectedItems[i]) {
				selectedItems[i].classList.remove("select-arrow-active");
			}
		}
		for (let i = 0; i < items.length; i++) {
			if (!Array.from(selectedItems).includes(currentElement)) {
				items[i].classList.add("select-hide");
			}
		}
	}

	// Function to handle option click
	function optionClickHandler(event) {
		const selectElement =
			this.parentNode.parentNode.getElementsByTagName("select")[0];
		const selectedDiv = this.parentNode.previousSibling;

		for (let i = 0; i < selectElement.length; i++) {
			if (selectElement.options[i].innerHTML === this.innerHTML) {
				selectElement.selectedIndex = i;
				selectedDiv.innerHTML = this.innerHTML;

				const sameAsSelected =
					this.parentNode.getElementsByClassName("same-as-selected");
				for (let k = 0; k < sameAsSelected.length; k++) {
					sameAsSelected[k].removeAttribute("class");
				}
				this.setAttribute("class", "same-as-selected");
				break;
			}
		}
		selectedDiv.click();
	}

	// Initialize custom select elements
	const customSelects = document.getElementsByClassName("custom-select");
	for (let i = 0; i < customSelects.length; i++) {
		const selectElement = customSelects[i].getElementsByTagName("select")[0];

		// Create the selected item div
		const selectedDiv = document.createElement("DIV");
		selectedDiv.setAttribute("class", "select-selected");
		selectedDiv.innerHTML =
			selectElement.options[selectElement.selectedIndex].innerHTML;
		customSelects[i].appendChild(selectedDiv);

		// Create the options div
		const optionsDiv = document.createElement("DIV");
		optionsDiv.setAttribute("class", "select-items select-hide");

		for (let j = 1; j < selectElement.length; j++) {
			const optionDiv = document.createElement("DIV");
			optionDiv.innerHTML = selectElement.options[j].innerHTML;
			optionDiv.addEventListener("click", optionClickHandler);
			optionsDiv.appendChild(optionDiv);
		}

		customSelects[i].appendChild(optionsDiv);

		// Add click event to selected item
		selectedDiv.addEventListener("click", function (e) {
			e.stopPropagation();
			closeAllSelect(this);

			console.log("clicked");

			this.nextSibling.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
		});
	}

	// Close all select boxes if user clicks outside
	document.addEventListener("click", closeAllSelect);
});
