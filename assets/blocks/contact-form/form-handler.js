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
			console.log('Required form elements not found');
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
				console.log('Form wrapper not found');
				return;
			}

			const formSettings = {
				emailTo: formWrapper.dataset.emailTo,
				emailSubject: formWrapper.dataset.emailSubject,
				fromEmail: formWrapper.dataset.fromEmail,
				fromName: formWrapper.dataset.fromName,
				replyToEmail: formWrapper.dataset.replyToEmail,
				ccEmails: formWrapper.dataset.ccEmails,
				bccEmails: formWrapper.dataset.bccEmails,
				includeMetadata: formWrapper.dataset.includeMetadata === 'true',
				formId: form.dataset.formId,
			};

			// Collect form fields (excluding honeypot and hidden fields)
			const fields = [];
			const inputs = form.querySelectorAll(
				'input:not([name="asite"]):not([type="hidden"]), textarea, select',
			);
			let hasErrors = false;
			let firstErrorField = null;

			// Reset previous error states
			form.querySelectorAll('.field-error').forEach((el) => el.remove());

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
						// For select elements, check if a real option is selected
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
						// For all other inputs
						hasErrors = true;
						showFieldError(input, 'This field is required');
						if (!firstErrorField) firstErrorField = input;
					}
				}

				// Additional type-specific validation for non-empty fields
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
									'Please enter a valid URL (must start with http:// or https://)',
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
				// Scroll to the first error field instead of the error message
				if (firstErrorField) {
					firstErrorField.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
				return;
			}

			// Disable submit button and show loading state
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sending...';

			try {
				// Get reCAPTCHA token only if enabled
				let recaptchaToken = '';
				if (recaptchaEnabled && recaptchaSiteKey) {
					try {
						if (window.grecaptcha) {
							recaptchaToken = await grecaptcha.execute(
								recaptchaSiteKey,
								{
									action: 'submit',
								},
							);
						} else {
							console.warn('reCAPTCHA script not loaded');
						}
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

				console.log('Submitting form data:', formData);

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
				console.log('Server response:', data);

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
					// Show specific error message from server if available
					throw new Error(data.message || 'Form submission failed');
				}
			} catch (error) {
				console.error('Form submission error:', error);
				// Show error message
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

document.addEventListener('DOMContentLoaded', function () {
	const selects = document.querySelectorAll('select');
	selects.forEach((select) => {
		select.addEventListener('change', function () {
			const fieldWrapper = this.closest('.form-field');
			const errorDiv = fieldWrapper?.querySelector('.field-error');

			// Clear existing error
			if (errorDiv) {
				errorDiv.remove();
				this.setAttribute('aria-invalid', 'false');
			}

			// Check if valid option is selected
			if (this.required) {
				const selectedOption = this.options[this.selectedIndex];
				const isValidSelection =
					selectedOption &&
					selectedOption.value &&
					selectedOption.value !== '' &&
					!selectedOption.disabled;

				if (!isValidSelection) {
					showFieldError(this, 'Please select an option');
				}
			}
		});
	});
});

// Helper functions
function showFieldError(input, message) {
	// Remove any existing error first
	const fieldWrapper = input.closest('.form-field');
	const existingError = fieldWrapper?.querySelector('.field-error');
	if (existingError) {
		existingError.remove();
	}

	// Create new error message
	const errorDiv = document.createElement('div');
	errorDiv.className = 'field-error';
	errorDiv.textContent = message;

	// Set ARIA attributes
	errorDiv.setAttribute('role', 'alert');
	errorDiv.setAttribute('aria-live', 'polite');
	input.setAttribute('aria-invalid', 'true');

	fieldWrapper?.appendChild(errorDiv);
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

function isValidSelectValue(value) {
	// Add any additional invalid values to this array
	const invalidValues = ['', 'default', 'select', '-1'];
	return value && !invalidValues.includes(value.toLowerCase());
}

// Update the form field validation with more specific select validation
function validateFormField(input) {
	const field = {
		name: input.name || input.id || '',
		label:
			input
				.closest('.form-field')
				?.querySelector('.form-label')
				?.textContent.replace('*', '')
				.trim() || input.name,
		value: input.value,
		required: input.required,
		type: input.type,
		valid: true,
		error: '',
	};

	if (field.required) {
		if (field.type === 'select-one' && !isValidSelectValue(field.value)) {
			field.valid = false;
			field.error = 'Please select an option';
		} else if (!field.value) {
			field.valid = false;
			field.error = 'This field is required';
		}
	}

	return field;
}
