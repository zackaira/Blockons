import { __ } from "@wordpress/i18n";
import parse from "html-react-parser";

const PreviewProduct = ({ postData }) => {
	if (!postData) return <div>{__("No post found", "blockons")}</div>;

	return (
		<div className="blockons-search-preview">
			<div className="blockons-search-preview-inner">
				{postData.featured_media && (
					<img src={postData.featured_media} alt={postData.title} />
				)}
				{postData.title && (
					<h4 className="blockons-spreview-title">{postData.title}</h4>
				)}
				{postData.price && (
					<div className="blockons-spreview-price">{parse(postData.price)}</div>
				)}

				{postData.short_desc && (
					<p className="blockons-spreview-desc">{parse(postData.short_desc)}</p>
				)}
				{postData.permalink && (
					<div className="blockons-spreview-btns">
						<a href={postData.permalink}>{__("View Product", "blockons")}</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewProduct;
