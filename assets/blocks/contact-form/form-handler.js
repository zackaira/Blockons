document.addEventListener('DOMContentLoaded', function () {
	// Check if reCAPTCHA is enabled and key exists
	const recaptchaEnabled = blockonsFormObj.recaptcha || false;
	const recaptchaSiteKey = blockonsFormObj.recaptcha_key || '';

	// Load reCAPTCHA if enabled
	if (recaptchaEnabled && recaptchaSiteKey) {
		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
		document.head.appendChild(script);
	}

	const forms = document.querySelectorAll('.blockons-cf-form');

	forms.forEach((form) => {
		const submitBtn = form.querySelector('.blockons-cf-submit-btn');
		const successMsg = form.querySelector('.blockons-cf-msg-success');
		const errorMsg = form.querySelector('.blockons-cf-msg-error');
		const honeypot = form.querySelector('input[name="asite"]');

		if (!submitBtn || !successMsg || !errorMsg) {
			console.error('Required form elements not found');
			return;
		}

		// Add input event listeners to clear errors on typing
		const allInputs = form.querySelectorAll('input, textarea, select');
		allInputs.forEach((input) => {
			input.addEventListener('input', function () {
				const errorDiv =
					this.closest('.form-field')?.querySelector('.field-error');
				if (errorDiv) {
					errorDiv.remove();
				}
			});
		});

		// Store original button text
		const originalBtnText = submitBtn.textContent;

		// Prevent default form submission
		form.addEventListener('submit', (e) => {
			e.preventDefault();
		});

		submitBtn.addEventListener('click', async function (e) {
			e.preventDefault();

			// Check honeypot - if it's filled out, silently return
			if (honeypot && honeypot.value) {
				console.log('Honeypot triggered');
				return;
			}

			// Hide any existing messages
			successMsg.style.display = 'none';
			errorMsg.style.display = 'none';

			// Get form settings from wrapper div
			const formWrapper = form.closest('.blockons-cf-wrap');
			if (!formWrapper) {
				console.error('Form wrapper not found');
				return;
			}

			// Collect form fields (excluding honeypot and hidden fields)
			const fields = [];
			const inputs = form.querySelectorAll(
				'input:not([name="asite"]):not([type="hidden"]), textarea, select',
			);
			let hasErrors = false;
			let firstErrorField = null;

			// Reset previous error states
			form.querySelectorAll('.field-error').forEach((el) => el.remove());

			// Collect and validate form fields
			inputs.forEach((input) => {
				const fieldWrapper = input.closest('.form-field');
				const field = {
					name: input.name || input.id || '',
					label:
						fieldWrapper
							?.querySelector('.form-label')
							?.textContent.replace('*', '')
							.trim() || input.name,
					value: input.value,
					required: input.required,
					type: input.type || input.tagName.toLowerCase(),
				};

				// Client-side validation
				if (field.required) {
					if (
						field.type === 'select' ||
						field.type === 'select-one'
					) {
						const selectedOption =
							input.options[input.selectedIndex];
						const isValidSelection =
							selectedOption &&
							selectedOption.value &&
							selectedOption.value !== '' &&
							!selectedOption.disabled;

						if (!isValidSelection) {
							hasErrors = true;
							showFieldError(input, 'Please select an option');
							if (!firstErrorField) firstErrorField = input;
						}
					} else if (!field.value.trim()) {
						hasErrors = true;
						showFieldError(input, 'This field is required');
						if (!firstErrorField) firstErrorField = input;
					}
				}

				// Type-specific validation
				if (field.value.trim()) {
					switch (field.type) {
						case 'email':
							if (!isValidEmail(field.value)) {
								hasErrors = true;
								showFieldError(
									input,
									'Please enter a valid email address',
								);
								if (!firstErrorField) firstErrorField = input;
							}
							break;
						case 'url':
							if (!isValidUrl(field.value)) {
								hasErrors = true;
								showFieldError(
									input,
									'Please enter a valid URL',
								);
								if (!firstErrorField) firstErrorField = input;
							}
							break;
						case 'number':
							if (isNaN(field.value)) {
								hasErrors = true;
								showFieldError(
									input,
									'Please enter a valid number',
								);
								if (!firstErrorField) firstErrorField = input;
							}
							break;
					}
				}

				fields.push(field);
			});

			if (hasErrors) {
				errorMsg.style.display = 'block';
				if (firstErrorField) {
					firstErrorField.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
				return;
			}

			// Find the email and name fields
			const fromEmail =
				fields.find((field) => field.type === 'email')?.value || '';
			const fromName =
				fields.find(
					(field) =>
						field.type === 'text' &&
						(field.name.toLowerCase().includes('name') ||
							field.label.toLowerCase().includes('name')),
				)?.value || '';

			// Prepare form settings
			const formSettings = {
				emailTo: formWrapper.dataset.emailTo || '',
				emailSubject:
					formWrapper.dataset.emailSubject ||
					'New Contact Form Submission',
				fromEmail: fromEmail, // Use actual email from form
				fromName: fromName, // Use actual name from form
				ccEmails: formWrapper.dataset.ccEmails || '',
				bccEmails: formWrapper.dataset.bccEmails || '',
				includeMetadata: formWrapper.dataset.includeMetadata === 'true',
				formId: form.dataset.formId || '',
			};

			// Disable submit button and show loading state
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sending...';

			try {
				// Get reCAPTCHA token if enabled
				let recaptchaToken = '';
				if (recaptchaEnabled && recaptchaSiteKey && window.grecaptcha) {
					try {
						recaptchaToken = await grecaptcha.execute(
							recaptchaSiteKey,
							{
								action: 'submit',
							},
						);
					} catch (recaptchaError) {
						console.error('reCAPTCHA error:', recaptchaError);
					}
				}

				// Prepare form data
				const formData = {
					...formSettings,
					fields,
					...(recaptchaToken && { recaptchaToken }),
				};

				console.log('Sending form data:', formData);

				const response = await fetch(
					`${blockonsFormObj.apiUrl}blcns/v1/submit-form`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(formData),
					},
				);

				const data = await response.json();

				if (response.ok) {
					// Clear form
					inputs.forEach((input) => (input.value = ''));
					// Show success message
					successMsg.style.display = 'block';
					successMsg.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				} else {
					throw new Error(data.message || 'Form submission failed');
				}
			} catch (error) {
				console.error('Form submission error:', error);
				errorMsg.textContent =
					error.message || 'An error occurred. Please try again.';
				errorMsg.style.display = 'block';
				errorMsg.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			} finally {
				// Reset submit button
				submitBtn.disabled = false;
				submitBtn.textContent = originalBtnText;
			}
		});
	});
});

// Helper functions
function showFieldError(input, message) {
	const fieldWrapper = input.closest('.form-field');
	const existingError = fieldWrapper?.querySelector('.field-error');
	if (existingError) {
		existingError.remove();
	}

	const errorDiv = document.createElement('div');
	errorDiv.className = 'field-error';
	errorDiv.textContent = message;
	errorDiv.setAttribute('role', 'alert');
	errorDiv.setAttribute('aria-live', 'polite');
	input.setAttribute('aria-invalid', 'true');

	if (fieldWrapper) {
		fieldWrapper.appendChild(errorDiv);
	}
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function isValidUrl(url) {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'http:' || parsed.protocol === 'https:';
	} catch {
		return false;
	}
}
