import { useState, useEffect } from "@wordpress/element";

const QuickViewPopup = ({ productData, onClose }) => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate a delay to show the loading spinner or any delay needed
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500); // Adjust the timeout as needed

		return () => clearTimeout(timer); // Clean up the timer on unmount
	}, []);

	return (
		<div className="quickview-popup">
			<div className="quickview-header">
				<h2>{isLoading ? "Loading Product..." : productData.title}</h2>
				<button onClick={onClose} className="close-button">
					Close
				</button>
			</div>

			{isLoading ? (
				// Show loading indicator while fetching the product data
				<div className="quickview-loading">
					<p>Loading...</p>
				</div>
			) : (
				// Display product content once loaded
				<div className="quickview-body">
					{productData.image && (
						<img
							src={productData.image}
							alt={productData.title}
							className="quickview-image"
						/>
					)}

					<p className="product-price">{productData.price}</p>
					<p className="product-sku">SKU: {productData.sku}</p>
					<p className="product-desc">{productData.short_desc}</p>

					<a
						href={productData.permalink}
						className="button view-product-button"
					>
						View Full Product
					</a>
				</div>
			)}
		</div>
	);
};

export default QuickViewPopup;
