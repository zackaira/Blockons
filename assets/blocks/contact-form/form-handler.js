document.addEventListener('DOMContentLoaded', function () {
	// Initialize reCAPTCHA if enabled
	const recaptchaEnabled = blockonsFormObj.recaptcha || false;
	const recaptchaSiteKey = blockonsFormObj.recaptcha_key || '';
	const translations = blockonsFormObj.translations;

	if (recaptchaEnabled && recaptchaSiteKey) {
		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
		document.head.appendChild(script);
	}

	// Helper functions
	const showFieldError = (element, message) => {
		// Find the appropriate wrapper
		const fieldWrapper =
			element.closest('.form-field') ||
			element.closest('.checkbox-group') ||
			element;

		if (!fieldWrapper) return;

		// Remove any existing errors
		const existingError = fieldWrapper.querySelector('.field-error');
		if (existingError) {
			existingError.remove();
		}

		// Create and add error message
		const errorDiv = document.createElement('div');
		errorDiv.className = 'field-error';
		errorDiv.textContent = message;
		errorDiv.setAttribute('role', 'alert');
		errorDiv.setAttribute('aria-live', 'polite');

		// Set aria-invalid on appropriate element
		if (element instanceof HTMLInputElement) {
			element.setAttribute('aria-invalid', 'true');
		}

		fieldWrapper.appendChild(errorDiv);
	};

	const clearFieldError = (element) => {
		const fieldWrapper =
			element.closest('.form-field') ||
			element.closest('.checkbox-group') ||
			element;

		if (!fieldWrapper) return;

		const errorDiv = fieldWrapper.querySelector('.field-error');
		if (errorDiv) {
			errorDiv.remove();
		}

		if (element instanceof HTMLInputElement) {
			element.setAttribute('aria-invalid', 'false');
		}
	};

	const isValidEmail = (email) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(String(email).toLowerCase());
	};

	const isValidUrl = (url) => {
		try {
			const parsed = new URL(url);
			return parsed.protocol === 'http:' || parsed.protocol === 'https:';
		} catch {
			return false;
		}
	};

	// Field data collection and validation
	const collectFieldData = (form) => {
		const fields = [];
		const processedFields = new Set();

		// Get all form inputs
		const inputs = form.querySelectorAll(
			'input:not([name="asite"]):not([type="hidden"]), textarea, select',
		);

		inputs.forEach((input) => {
			// Skip if we've already processed this field
			if (processedFields.has(input.name)) {
				return;
			}

			const fieldWrapper = input.closest('.form-field');
			const label =
				fieldWrapper
					?.querySelector(
						'.form-label, .acceptance-label, .checkbox-group-label-txt',
					)
					?.textContent.replace('*', '')
					.trim() || input.name;

			// Handle file inputs specifically
			if (input.type === 'file') {
				console.log('File input found:', input);
				const file = input.files[0];
				fields.push({
					name: input.name || input.id,
					label: label,
					value: file
						? {
								name: file.name,
								size: file.size,
								type: file.type,
							}
						: null,
					type: 'file',
					required: input.required,
					maxSize: input.dataset.maxSize,
					accept: input.accept,
				});
				return;
			}

			// Handle different input types
			if (input.type === 'checkbox') {
				// Check if this is part of a checkbox group
				if (input.name.includes('[]')) {
					const groupName = input
						.getAttribute('name')
						.replace('[]', '');
					if (!processedFields.has(groupName)) {
						processedFields.add(groupName);

						// Get all checkboxes in this group
						const groupInputs = form.querySelectorAll(
							`input[name="${input.getAttribute('name')}"]`,
						);
						const checkedValues = Array.from(groupInputs)
							.filter((cb) => cb.checked)
							.map((cb) => ({
								value: cb.value,
								label:
									cb.nextElementSibling?.textContent.trim() ||
									cb.value,
							}));

						fields.push({
							name: groupName,
							label: label,
							value: checkedValues,
							type: 'checkbox_group',
							required: input.required,
						});
					}
				} else {
					// Single checkbox (like acceptance)
					fields.push({
						name: input.name || input.id,
						label: label,
						value: input.checked ? 1 : 0,
						type: 'checkbox',
						required: input.required,
					});
				}
			} else {
				// Handle text, email, textarea, select, etc.
				fields.push({
					name: input.name || input.id,
					label: label,
					value: input.value,
					type: input.type || input.tagName.toLowerCase(),
					required: input.required,
				});
			}

			// Mark this field as processed
			processedFields.add(input.name);
		});

		return fields;
	};

	const validateField = (input, fieldData) => {
		if (!fieldData.required) return true;

		// Handle file inputs
		if (fieldData.type === 'file') {
			if (!input.files || input.files.length === 0) {
				showFieldError(input, translations.required);
				return false;
			}
			return true;
		}

		// Handle single checkboxes (like acceptance)
		if (fieldData.type === 'checkbox') {
			const isAcceptanceField = input.closest(
				'.blockons-form-acceptance',
			);
			const isCheckboxGroup = input.closest('.blockons-form-checkbox');

			if (isAcceptanceField || (!isAcceptanceField && !isCheckboxGroup)) {
				// This is a single checkbox
				if (!input.checked) {
					showFieldError(input, translations.required);
					return false;
				}
				return true;
			} else if (isCheckboxGroup) {
				// Checkbox group validation
				const groupName = input.getAttribute('name').replace('[]', '');
				const checkboxGroup = input
					.closest('form')
					.querySelectorAll(`input[name="${groupName}[]"]`);

				const hasChecked = Array.from(checkboxGroup).some(
					(cb) => cb.checked,
				);

				if (!hasChecked) {
					showFieldError(
						input.closest('.checkbox-group'),
						translations.select_option,
					);
					return false;
				}
				return true;
			}
			return true;
		}

		// Handle checkbox groups (already validated above)
		if (fieldData.type === 'checkbox_group') {
			return true;
		}

		// Handle select fields
		if (fieldData.type === 'select' || fieldData.type === 'select-one') {
			const selectedOption = input.options[input.selectedIndex];
			const isValidSelection =
				selectedOption &&
				selectedOption.value &&
				selectedOption.value !== '' &&
				!selectedOption.disabled;

			if (!isValidSelection) {
				showFieldError(input, translations.select_option);
				return false;
			}
			return true;
		}

		// Handle text-based fields
		if (fieldData.value === undefined || fieldData.value === null) {
			showFieldError(input, translations.required);
			return false;
		}

		// Convert to string for trim if needed
		const value = String(fieldData.value).trim();
		if (value === '') {
			showFieldError(input, translations.required);
			return false;
		}

		// Type-specific validation for non-empty fields
		switch (fieldData.type) {
			case 'email':
				if (!isValidEmail(value)) {
					showFieldError(input, translations.required_email);
					return false;
				}
				break;
			case 'url':
				if (!isValidUrl(value)) {
					showFieldError(input, translations.required_url);
					return false;
				}
				break;
			case 'number':
				if (isNaN(value)) {
					showFieldError(input, translations.required_number);
					return false;
				}
				break;
		}

		return true;
	};

	// Form processing
	const processForms = () => {
		const forms = document.querySelectorAll('.blockons-cf-form');

		forms.forEach((form) => {
			// Get the wrapper
			const wrapper = form.closest('.blockons-cf-wrap');
			if (!wrapper) {
				console.error('Form wrapper not found');
				return;
			}

			// Initialize elements object
			const elements = {
				submitBtn: form.querySelector('.blockons-cf-submit-btn'),
				successMsg: form.querySelector('.blockons-cf-msg-success'),
				errorMsg: form.querySelector('.blockons-cf-msg-error'),
				honeypot: form.querySelector('input[name="asite"]'),
				inputs: form.querySelectorAll(
					'input:not([name="asite"]):not([type="hidden"]), textarea, select',
				),
			};

			// Verify required elements exist
			if (
				!elements.submitBtn ||
				!elements.successMsg ||
				!elements.errorMsg
			) {
				console.error('Required form elements missing');
				return;
			}

			// Store original button text
			const originalBtnText = elements.submitBtn.textContent;

			// Setup input event listeners
			setupInputListeners(elements.inputs);

			// Handle form submission
			form.addEventListener('submit', (e) => e.preventDefault());

			elements.submitBtn.addEventListener('click', async (e) => {
				e.preventDefault();

				// Check honeypot
				if (elements.honeypot?.value) {
					console.log('Honeypot triggered');
					return;
				}

				try {
					// Validate form
					const { isValid, fields } = validateForm(
						form,
						elements.inputs,
					);
					if (!isValid) {
						if (elements.errorMsg) {
							elements.errorMsg.style.display = 'block';
							elements.errorMsg.scrollIntoView({
								behavior: 'smooth',
								block: 'center',
							});
						}
						return;
					}

					// Submit form
					await submitForm(form, elements, originalBtnText);
				} catch (error) {
					console.error('Form processing error:', error);
					handleSubmissionError(error, elements);
				}
			});
		});
	};

	const setupInputListeners = (inputs) => {
		inputs.forEach((input) => {
			input.addEventListener('input', function () {
				clearFieldError(this);

				// For checkbox groups, clear group error when any checkbox is clicked
				if (this.type === 'checkbox') {
					const checkboxGroup = this.closest(
						'.blockons-form-checkbox',
					);
					if (checkboxGroup) {
						const groupError =
							checkboxGroup.querySelector('.field-error');
						if (groupError) {
							groupError.remove();
						}
					}
				}
			});

			// Add change event listener specifically for checkboxes
			if (input.type === 'checkbox') {
				input.addEventListener('change', function () {
					const checkboxGroup = this.closest(
						'.blockons-form-checkbox',
					);
					if (checkboxGroup) {
						const groupName = this.getAttribute('name').replace(
							'[]',
							'',
						);
						const allCheckboxes = checkboxGroup.querySelectorAll(
							`input[name="${groupName}[]"]`,
						);
						const isRequired = Array.from(allCheckboxes).some(
							(cb) => cb.required,
						);
						const hasChecked = Array.from(allCheckboxes).some(
							(cb) => cb.checked,
						);

						// Clear error if at least one is checked
						if (hasChecked) {
							const groupError =
								checkboxGroup.querySelector('.field-error');
							if (groupError) {
								groupError.remove();
							}
						}
					}
				});
			}
		});
	};

	const validateForm = (form, inputs) => {
		console.log('Starting form validation');

		// Clear existing errors
		form.querySelectorAll('.field-error').forEach((el) => el.remove());

		let isValid = true;
		let firstErrorField = null;

		// Collect fields data
		const fields = collectFieldData(form);
		console.log('Collected fields:', fields);

		if (!fields || fields.length === 0) {
			console.error('No fields found in form');
			return { isValid: false, fields: [] };
		}

		fields.forEach((fieldData) => {
			const input =
				form.querySelector(`[name="${fieldData.name}"]`) ||
				form.querySelector(`[name="${fieldData.name}[]"]`);

			if (!input) {
				console.error('Input not found for field:', fieldData);
				return;
			}

			console.log('Validating field:', fieldData.name);
			if (!validateField(input, fieldData)) {
				isValid = false;
				if (!firstErrorField) {
					firstErrorField = input;
				}
			}
		});

		if (firstErrorField) {
			firstErrorField.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}

		return { isValid, fields };
	};

	const submitForm = async (form, elements, originalBtnText) => {
		// Check if elements object and submit button exist
		if (!elements || !elements.submitBtn) {
			console.error('Form elements not properly initialized', {
				elements,
			});
			return;
		}

		try {
			// Debug form state
			console.log('Starting form submission', {
				form,
				elements,
				originalBtnText,
			});

			// Disable submit button and update text
			elements.submitBtn.disabled = true;
			elements.submitBtn.textContent =
				translations.sending || 'Sending...';

			// Clear previous messages
			if (elements.successMsg) elements.successMsg.style.display = 'none';
			if (elements.errorMsg) elements.errorMsg.style.display = 'none';

			// Get form wrapper
			const wrapper = form.closest('.blockons-cf-wrap');
			if (!wrapper) {
				throw new Error('Form wrapper not found');
			}

			// Debug wrapper data
			console.log('Form wrapper data:', {
				emailTo: wrapper.dataset.emailTo,
				formName: wrapper.dataset.formName,
				emailSubject: wrapper.dataset.emailSubject,
				fromName: wrapper.dataset.fromName,
				fromEmail: wrapper.dataset.fromEmail,
				ccEmails: wrapper.dataset.ccEmails,
				bccEmails: wrapper.dataset.bccEmails,
				includeMetadata: wrapper.dataset.includeMetadata,
			});

			// Validate form first
			console.log('Validating form...');
			const { isValid, fields } = validateForm(form, elements.inputs);

			if (!isValid) {
				console.error('Form validation failed');
				if (elements.errorMsg) {
					elements.errorMsg.style.display = 'block';
					elements.errorMsg.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
				throw new Error('Form validation failed');
			}

			if (!fields || fields.length === 0) {
				console.error('No form fields collected');
				throw new Error('No form fields found');
			}

			console.log('Form validation passed. Fields:', fields);

			// Prepare form data
			console.log('Preparing form data...');
			const formData = new FormData();

			// Add main form data
			formData.append('emailTo', wrapper.dataset.emailTo || '');
			formData.append('formName', wrapper.dataset.formId || '');
			formData.append(
				'emailSubject',
				wrapper.dataset.emailSubject || translations.subject,
			);
			formData.append('fromName', wrapper.dataset.fromName || '');
			formData.append('fromEmail', wrapper.dataset.fromEmail || '');
			formData.append('ccEmails', wrapper.dataset.ccEmails || '');
			formData.append('bccEmails', wrapper.dataset.bccEmails || '');
			formData.append(
				'includeMetadata',
				wrapper.dataset.includeMetadata === 'true',
			);

			// Process and add fields data
			const processedFields = fields.map((field) => {
				if (field.type === 'file') {
					const input = form.querySelector(`[name="${field.name}"]`);
					if (input && input.files[0]) {
						const file = input.files[0];
						return {
							...field,
							value: {
								name: file.name,
								size: file.size,
								type: file.type,
							},
						};
					}
				}
				return field;
			});

			// Add processed fields to FormData
			formData.append('fields', JSON.stringify(processedFields));

			// Handle file uploads
			const fileFields = fields.filter((field) => field.type === 'file');
			fileFields.forEach((field) => {
				const input = form.querySelector(`[name="${field.name}"]`);
				if (input && input.files.length > 0) {
					// Append the file using the field name instead of a generic index
					formData.append(field.name, input.files[0]);
					console.log(
						`Added file: ${input.files[0].name} with field name: ${field.name}`,
					);
				}
			});

			// Log the final FormData
			console.log('Final FormData entries:');
			for (let pair of formData.entries()) {
				console.log(pair[0], pair[1]);
			}

			// Submit the form
			console.log(
				'Submitting to:',
				`${blockonsFormObj.apiUrl}blcns/v1/submit-form`,
			);
			const response = await fetch(
				`${blockonsFormObj.apiUrl}blcns/v1/submit-form`,
				{
					method: 'POST',
					body: formData,
				},
			);

			console.log('Response status:', response.status);
			const data = await response.json();
			console.log('Response data:', data);

			if (!response.ok) {
				throw new Error(data.message || translations.error);
			}

			// Handle successful submission
			console.log('Form submitted successfully');
			handleSuccessfulSubmission(form, elements);
		} catch (error) {
			console.error('Form submission error details:', {
				message: error.message,
				stack: error.stack,
				error,
			});
			handleSubmissionError(error, elements);
		} finally {
			// Always re-enable submit button and restore text
			if (elements && elements.submitBtn) {
				elements.submitBtn.disabled = false;
				elements.submitBtn.textContent = originalBtnText || '';
			}
		}
	};

	// Helper function for successful submission
	const handleSuccessfulSubmission = (form, elements) => {
		if (!form || !elements) return;

		// Clear form
		form.reset();

		// Show success message if it exists
		if (elements.successMsg) {
			elements.successMsg.style.display = 'block';
			elements.successMsg.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	};

	// Helper function for submission errors
	const handleSubmissionError = (error, elements) => {
		if (!elements) return;

		// Show error message if it exists
		if (elements.errorMsg) {
			elements.errorMsg.textContent = error.message || translations.error;
			elements.errorMsg.style.display = 'block';
			elements.errorMsg.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	};

	// Initialize form processing
	processForms();
});
