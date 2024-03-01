import React, { useState, useEffect } from "react";
import { blockonsConvertToSlug } from "../../../helpers";

const InputRange = (props) => {
	const rangeTitleSlug = blockonsConvertToSlug(props.slug)
		? blockonsConvertToSlug(props.slug)
		: blockonsConvertToSlug(props.title);
	const [rangeValue, setRangeValue] = useState(0);
	const theDefault = props.defaultValue ? props.defaultValue : props.min;

	useEffect(() => {
		props.value ? setRangeValue(props.value) : setRangeValue(theDefault);
	}, [props.value]);

	return (
		<React.Fragment>
			<div className="blockonsRange">
				<div className="blockonsRangeInput">
					<span>{props.min}</span>
					<input
						type="range"
						id={rangeTitleSlug}
						name={rangeTitleSlug}
						onChange={props.onChange}
						value={rangeValue}
						min={props.min ? props.min : 0}
						max={props.max ? props.max : 500}
						step={props.step ? props.step : 1}
					/>
					<span>{props.max ? props.max : 500}</span>
				</div>
				<div className="blockonsRangeInputVal">
					<input type="text" value={rangeValue} readOnly />
					{props.suffix ? props.suffix : ""}
				</div>
			</div>
		</React.Fragment>
	);
};

export default InputRange;
