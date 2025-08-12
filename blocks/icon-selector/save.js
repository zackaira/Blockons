/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	const {
		alignment,
		icon,
		prefix,
		iconLibrary,
		customIconUrl,
		iconSize,
		url,
		linkTarget,
		rel,
		iconBorder,
		borderWidth,
		borderColor,
		borderRadius,
	} = attributes;

	const iconWrapperStyle = {
		...(iconLibrary === 'fontawesome' &&
			icon && {
				width: iconSize ? `${iconSize}px` : '88px',
				height: iconSize ? `${iconSize}px` : '88px',
				fontSize: iconSize ? `${iconSize}px` : '88px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				aspectRatio: '1/1',
			}),
		borderRadius: borderRadius || '0',
		border: iconBorder ? `${borderWidth}px solid ${borderColor}` : 'none',
		...(iconLibrary === 'custom' && {
			width: iconSize ? `${iconSize}px` : '88px',
			height: iconSize ? `${iconSize}px` : '88px',
			fontSize: iconSize ? `${iconSize}px` : '88px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			aspectRatio: '1/1',
		}),
	};

	const blockProps = useBlockProps.save({
		className: `blockons-icon`,
		style: iconWrapperStyle,
	});

	const iconContent = () => {
		if (iconLibrary === 'fontawesome') {
			return (
				<i
					className={`${prefix} fa-${icon} blockons-icon`}
					style={{
						lineHeight: 1,
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '100%',
					}}
				/>
			);
		} else if (customIconUrl) {
			if (customIconUrl.endsWith('.svg')) {
				// SVG will be handled by PHP render callback for security
				return null;
			}
			return (
				<img
					src={customIconUrl}
					alt=""
					className="blockons-icon"
					style={{
						width: '80%',
						height: '80%',
						objectFit: 'contain',
						aspectRatio: '1/1',
					}}
				/>
			);
		}
		return null;
	};

	const wrapperProps = {
		className: `blockons-icon-selector align-${alignment}`,
	};

	const content = iconContent();
	if (!content) {
		return <div {...wrapperProps} />;
	}

	// Handle link rel attribute
	let linkRel = undefined;
	if (rel || linkTarget === '_blank') {
		const relArray = (rel || '')
			.split(' ')
			.filter((r) => r !== 'nofollow' && r !== 'noopener');

		// Add nofollow first if present
		if (rel?.includes('nofollow')) {
			relArray.unshift('nofollow');
		}

		// Add noopener if opening in new tab
		if (linkTarget === '_blank') {
			relArray.push('noopener');
		}

		linkRel = relArray.length ? relArray.join(' ') : undefined;
	}

	if (url) {
		return (
			<div {...wrapperProps}>
				<a
					href={url}
					target={linkTarget}
					rel={linkRel}
					className="blockons-icon-link"
					{...blockProps}
				>
					{content}
				</a>
			</div>
		);
	}

	return (
		<div {...wrapperProps}>
			<div {...blockProps}>{content}</div>
		</div>
	);
};

export default Save;
