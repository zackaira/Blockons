import { RangeControl, Button, ButtonGroup } from "@wordpress/components";

const BlockonsNumberRange = (props) => {
	const {
		label,
		value,
		onChange,
		min,
		max,
		btnValue,
		buttonOptions,
		onBtnClick,
	} = props;

	return (
		<div className="blockonsNumRange">
			<ButtonGroup className="blockonsNumRange-btns">
				{buttonOptions.map((btn) => (
					<Button
						key={btn.key}
						isSmall
						isPrimary={btnValue === btn}
						onClick={onBtnClick}
						className="blockonsNumRange-btn"
						value={btn}
					>
						{btn}
					</Button>
				))}
			</ButtonGroup>
			<RangeControl
				label={label}
				value={value}
				onChange={onChange}
				min={btnValue === "px" ? min : 10}
				max={btnValue === "px" ? max : 100}
			/>
		</div>
	);
};

export default BlockonsNumberRange;
