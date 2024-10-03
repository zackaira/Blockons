import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "animate.css";

// Initialize SweetAlert2 with React content support
const MySwal = withReactContent(Swal);

const showGalleryPopup = ({ images, startIndex = 0 }, isSingle = false) => {
	let currentIndex = startIndex;

	const updatePopup = () => {
		const { imageUrl, imageCaption } = images[currentIndex];

		MySwal.fire({
			html: `
				<div class="blockons-popup-wrap">
					<img id="blockons-popup-img" src="${imageUrl}" alt="${imageCaption}" class="blockons-popup-img animate__animated animate__fadeIn" />
					${imageCaption ? `<p class="blockons-popup-caption">${imageCaption}</p>` : ""}
				</div>
			`,
			showCloseButton: true,
			showConfirmButton: isSingle ? false : true,
			showDenyButton: isSingle ? false : true,
			confirmButtonText: "",
			denyButtonText: "",
			width: "auto",
			imageWidth: "100%",
			position: "center",
			customClass: {
				container: "blockons-popup-container",
				popup: "blockons-popup-swal",
				confirmButton: "blockons-popup-btn fa-solid fa-chevron-right next",
				denyButton: "blockons-popup-btn fa-solid fa-chevron-left prev",
			},
			showClass: {
				popup: `
					animate__animated
					animate__zoomIn
					animate__faster`,
			},
			hideClass: {
				popup: `
					animate__animated
					animate__zoomOut
					animate__faster`,
			},
		}).then((result) => {
			if (result.isConfirmed) {
				// Move to the next image
				transitionToNextImage(1);
			} else if (result.isDenied) {
				// Move to the previous image
				transitionToNextImage(-1);
			}
		});
	};

	const transitionToNextImage = (direction) => {
		// Add a smooth fade-out animation
		const imageElement = document.getElementById("blockons-popup-img");
		if (imageElement) {
			imageElement.classList.remove("animate__zoomIn");
			imageElement.classList.add("animate__zoomOut");

			// Wait for the fade-out animation to complete
			setTimeout(() => {
				// Update the current index
				currentIndex = (currentIndex + direction + images.length) % images.length;
				
				// Update image with a smooth fade-in effect
				updatePopup();
			}, 300); // Match the duration of the fade-out animation
		}
	};

	// Start the popup gallery
	updatePopup();
};

export default showGalleryPopup;
