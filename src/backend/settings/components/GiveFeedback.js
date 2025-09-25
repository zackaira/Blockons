import { __ } from '@wordpress/i18n';
import InputToggleSwitch from './inputs/InputToggleSwitch';

const GiveFeedback = ({ blockonsOptions, clickClose }) => {
	const question = document.querySelector('.ask-feedback');
	const happy = document.querySelector('.blockons-reply.happy');
	const sad = document.querySelector('.blockons-reply.sad');

	const handleYesClick = () => {
		question.classList.remove('show');
		sad.classList.remove('show');
		happy.classList.add('show');
		reset();
	};
	const handleNoClick = () => {
		question.classList.remove('show');
		happy.classList.remove('show');
		sad.classList.add('show');
		reset();
	};

	function reset() {
		setTimeout(() => {
			happy.classList.remove('show');
			sad.classList.remove('show');
			question.classList.add('show');
		}, 12000);
	}

	return (
		<div className="blockons-feedback">
			<div className="ask-feedback show">
				<b>{__('Quick question... ', 'blockons')}</b>
				{__('Are you enjoying using the Blockons plugin?', 'blockons')}
				<a onClick={handleYesClick}>{__('Yes', 'blockons')}</a>
				<a onClick={handleNoClick}>{__('No', 'blockons')}</a>
				<div className="blockons-feedback-dismiss dashicons dashicons-no">
					<InputToggleSwitch
						title="X"
						slug="global_disablerating"
						value={blockonsOptions.disablerating}
						onChange={clickClose}
					/>
				</div>
			</div>
			<div className="blockons-reply happy">
				{__(
					'Great! Please help us with a 5 star review 🙏 It will really help users to gain trust in our product and help us grow.',
					'blockons',
				)}
				<a href="https://blockons.com/go/review/" target="_blank">
					{__('Give 5 Stars :)', 'blockons')}
				</a>
			</div>
			<div className="blockons-reply sad">
				{__(
					'Oh no! Did something break or not work as expected? Please contact us so we can fix and improve the plugin for you.',
					'blockons',
				)}
				<a href="https://blockons.com/go/contact-us/" target="_blank">
					{__('Get In Contact', 'blockons')}
				</a>
			</div>
		</div>
	);
};

export default GiveFeedback;
