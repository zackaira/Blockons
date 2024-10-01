import QuickViewPopup from "./QuickViewPopup";
import "./venopopup.css";

const apiUrl = blockonsQuickviewObj.apiUrl;

document.addEventListener("DOMContentLoaded", () => {
	const quickviewBtns = document.querySelectorAll(".blockons-quickview-btn");

	if (quickviewBtns) {
		quickviewBtns.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				const productId = e.target.getAttribute("data-id");
				const originalButtonText = e.target.innerText;

				// Show loading state on the button
				e.target.innerText = "Loading...";

				// Fetch product data from the custom REST API endpoint
				fetch(`${apiUrl}blcns/v1/product-data/${productId}`)
					.then((response) => response.json()) // Expect JSON response
					.then((productData) => {
						// Create or reference a hidden div for React component content
						let tempDiv = document.getElementById("blockons-venobox-container");
						if (!tempDiv) {
							tempDiv = document.createElement("div");
							tempDiv.id = "blockons-venobox-container";
							tempDiv.className = "venobox-container";
							document.body.appendChild(tempDiv);
						}

						// Render the React component into the hidden container
						ReactDOM.render(
							<QuickViewPopup
								productData={productData}
								onClose={() => handleClose(tempDiv)}
							/>,
							tempDiv
						);

						// Trigger Venobox with the rendered content
						setTimeout(() => {
							const venobox = new VenoBox({
								selector: "#blockons-venobox-container",
								numeration: false,
								infinigall: false,
								share: false,
								titlePosition: "none",
								titleStyle: "pill",
								spinner: "flow",
								maxWidth: "800px",
								toolsColor: "#FFF",
								overlayColor: "rgb(255 255 255 / 75%)",
								onOpening: () => {
									tempDiv.style.display = "block"; // Make sure the container is visible
								},
								onClosed: () => {
									handleClose(tempDiv);
								},
							});

							// Open the Venobox after rendering
							venobox.open();

							// Restore the button text after data is fetched
							e.target.innerText = originalButtonText;
						}, 100); // Adjust this delay if needed
					})
					.catch((error) => {
						console.error("Error fetching product data: ", error);
						e.target.innerText = "Error";
					});
			});
		});
	}
});

// Handle popup close and cleanup
const handleClose = (tempDiv) => {
	ReactDOM.unmountComponentAtNode(tempDiv);
	tempDiv.style.display = "none"; // Hide the div on close
};
