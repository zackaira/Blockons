import { __ } from "@wordpress/i18n";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
	const pageNumbers = [];

	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	return (
		<div className="blockons-results-pagination">
			<div className="pag-item">
				<button
					className="pag-link"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					{__("Previous", "blockons")}
				</button>
			</div>
			<div className="pag-item pages">
				{pageNumbers.map((number) => (
					<button
						key={number}
						className={`pag-link${currentPage === number ? " active" : ""}`}
						onClick={() => onPageChange(number)}
					>
						{number}
					</button>
				))}
			</div>
			<div className="pag-item">
				<button
					className="pag-link"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					{__("Next", "blockons")}
				</button>
			</div>
		</div>
	);
};

export default Pagination;
