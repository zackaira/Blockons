import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import 'animate.css';

// Initialize SweetAlert2 with React content support
const MySwal = withReactContent(Swal);

const showGalleryPopup = ({ images, startIndex = 0 }, isSingle = false) => {
	let currentIndex = startIndex;

	const updatePopup = () => {
		const { imageUrl, imageCaption } = images[currentIndex];

		MySwal.fire({
			html: `
				<div class="blockons-popup-wrap">
					<img src="${imageUrl}" alt="${imageCaption}" class="blockons-popup-img" />
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
				currentIndex = (currentIndex + 1) % images.length;
				updatePopup();
			} else if (result.isDenied) {
				// Move to the previous image
				currentIndex = (currentIndex - 1 + images.length) % images.length;
				updatePopup();
			}
		});
	};

	// Start the popup gallery
	updatePopup();
};

export default showGalleryPopup;
