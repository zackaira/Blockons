import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import "./sidecart.css";

const SideCart = ({ sidecartOptions, isAdmin }) => {
	const sidecart = sidecartOptions
		? sidecartOptions
		: wcCartObj.sidecart
		? wcCartObj.sidecart
		: { enabled: false };

	if (!sidecart?.enabled) return null;

	useEffect(() => {
		const sideCartOpen = document.querySelectorAll(".blockons-opencart");

		if (sideCartOpen.length > 0) {
			sideCartOpen.forEach((item) => {
				item.addEventListener("click", (e) => {
					e.preventDefault();
					const body = document.body;

					if (body.classList.contains("blockons-show-sidecart")) {
						body.classList.remove("blockons-show-sidecart");
					} else {
						body.classList.add("blockons-show-sidecart");
					}
				});
			});
		}

		// Cleanup function to remove event listeners when component unmounts
		return () => {
			if (sideCartOpen.length > 0) {
				sideCartOpen.forEach((item) => {
					item.removeEventListener("click", (e) => {
						e.preventDefault();
					});
				});
			}
		};
	}, []);

	return (
		<React.Fragment>
			{sidecart.has_icon && (
				<div
					id="blockons-sidecart-icon"
					className={`blockons-side-cart-icon blockons-opencart ${sidecart.position}`}
					style={{
						...(sidecart.icon_bgcolor !== "#333"
							? { backgroundColor: sidecart.icon_bgcolor }
							: {}),
						...(sidecart.icon_color !== "#FFF"
							? { color: sidecart.icon_color }
							: {}),
						...(sidecart.icon_size !== 24
							? { fontSize: sidecart.icon_size + "px" }
							: {}),
						...(sidecart.icon_padding !== 60
							? {
									width: sidecart.icon_padding + "px",
									height: sidecart.icon_padding + "px",
							  }
							: {}),
					}}
				>
					{sidecart.has_amount && (
						<span
							className="blockons-notification"
							style={{
								...(sidecart.amount_bgcolor !== "#000"
									? { backgroundColor: sidecart.amount_bgcolor }
									: {}),
								...(sidecart.amount_fcolor !== "#FFF"
									? { color: sidecart.amount_fcolor }
									: {}),
							}}
						>
							{isAdmin ? "2" : ""}
						</span>
					)}
					<span
						className={`fa-solid fa-${
							sidecart.icon ? sidecart.icon : "cart-shopping"
						}`}
					></span>
				</div>
			)}

			<div
				className={`blockons-side-cart-block ${sidecart.position}`}
				style={{
					...(sidecart.bgcolor !== "#FFF"
						? { backgroundColor: sidecart.bgcolor }
						: {}),
					...(sidecart.color !== "#000" ? { color: sidecart.color } : {}),
				}}
			>
				<div className="blockons-side-cart-block-inner">
					{(sidecart.header_title || sidecart.header_text) && (
						<div className="blockons-side-cart-header">
							{sidecart.header_title ? <h6>{sidecart.header_title}</h6> : ""}
							{sidecart.header_text ? <p>{sidecart.header_text}</p> : ""}
						</div>
					)}
					<div
						className={`blockons-side-cart-content ${isAdmin ? "center" : ""}`}
					>
						{isAdmin ? __("Products Displayed Here", "blockons") : ""}
					</div>
				</div>
			</div>
			<div
				className="blockons-side-cart-overlay blockons-opencart"
				style={{
					...(sidecart.overlay_color !== "#000"
						? { backgroundColor: sidecart.overlay_color }
						: {}),
					...(sidecart.overlay_opacity !== 0.6
						? { opacity: sidecart.overlay_opacity }
						: {}),
				}}
			></div>
		</React.Fragment>
	);
};

export default SideCart;
