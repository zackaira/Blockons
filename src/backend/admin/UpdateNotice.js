import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import axios from "axios";
import Loader from "../Loader";

const Settings = () => {
	const blockonsObject = blockonsObj;
	const url = `${blockonsObject.apiUrl}blcns/v1`;
	const [loader, setLoader] = useState(false);
	const [blockonsDefaults, setBlockonsDefaults] = useState({});
	const [blockonsOptions, setBlockonsOptions] = useState({});

	// Get Settings from db
	useEffect(() => {
		setLoader(true);

		axios.get(url + "/defaults").then((res) => {
			const blockonsDefaults = res.data.blockonsDefaults
				? JSON.parse(res.data.blockonsDefaults)
				: console.log("Blockons Options Empty");

			setBlockonsDefaults(blockonsDefaults); // Set settings to defaults if not found
			console.log("Defaults Done");
		});

		axios.get(url + "/settings").then((res) => {
			const blockonsOptions = res.data.blockonsOptions
				? JSON.parse(res.data.blockonsOptions)
				: console.log("Blockons Options Empty");

			setBlockonsOptions(blockonsOptions); // Set settings to defaults if not found
			console.log("Options Done");
		});

		setLoader(false);
	}, []);

	// Submit form
	const handleUpdate = async (e) => {
		e.preventDefault();
		setLoader(true);

		// console.log(blockonsDefaults);
		// console.log(blockonsOptions);

		const mergedOptions = { ...blockonsDefaults, ...blockonsOptions };

		await axios
			.post(
				url + "/settings",
				{
					blockonsOptions: JSON.stringify(mergedOptions),
				},
				{
					// Add Nonce to prevent this working elsewhere
					headers: {
						"content-type": "application/json",
						"X-WP-NONCE": blockonsObject.nonce,
					},
				}
			)
			.then((res) => {
				// const blockonsOptions = JSON.parse(res.data.blockonsOptions);
				setLoader(false);
			});
	};

	return (
		<div className="blockons-updatenotice">
			<div className="blockons-updatenotice-txt">
				{__("Thanks for updating! Please run the updater now", "blockons")}
			</div>
			<div className="blockons-updatenotice-btn">
				{loader ? (
					<Loader />
				) : (
					<a onClick={(e) => handleUpdate(e)}>{__("Run Update", "blockons")}</a>
				)}
			</div>
		</div>
	);
};

export default Settings;
