document.addEventListener('DOMContentLoaded', async function () {
	// Initialize reCAPTCHA if enabled
	const apiUrl = blockonsFormObj.apiUrl || '';
	const siteUrl = blockonsFormObj.siteUrl || '';
	const recaptchaEnabled = blockonsFormObj.recaptchaEnabled || false;
	const translations = blockonsFormObj.translations;
	const isPremium = Boolean(blockonsFormObj.isPremium) || false;

	// Fetch reCAPTCHA key and initialize it immediately
	let recaptchaSiteKey = '';
	let recaptchaInitialized = false;

	const loadReCaptchaScript = (siteKey) => {
		return new Promise((resolve, reject) => {
			// If reCAPTCHA is already loaded, resolve immediately
			if (window.grecaptcha && window.grecaptcha.ready) {
				window.grecaptcha.ready(() => resolve(window.grecaptcha));
				return;
			}

			// Create callback function
			window.onRecaptchaLoad = () => {
				if (!window.grecaptcha) {
					reject(new Error('grecaptcha not available after load'));
					return;
				}
				window.grecaptcha.ready(() => {
					resolve(window.grecaptcha);
				});
			};

			// Check if script already exists
			if (document.querySelector('script[src*="recaptcha/api.js"]')) {
				return;
			}

			// Add the script
			const script = document.createElement('script');
			script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&onload=onRecaptchaLoad`;
			script.async = true;
			script.defer = true;

			script.onerror = (error) => {
				reject(new Error('Failed to load reCAPTCHA script'));
			};

			document.head.appendChild(script);
		});
	};

	const initializeReCaptcha = async () => {
		if (!recaptchaEnabled) {
			debug('reCAPTCHA not enabled');
			return;
		}

		try {
			const headers = new Headers({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-WP-Nonce': blockonsFormObj.nonce,
			});

			const response = await fetch(
				`${apiUrl}blcns/v1/get-api-key?key_type=recaptcha`,
				{
					method: 'GET',
					headers: headers,
					credentials: 'include',
					mode: 'cors',
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				debug('API Error:', {
					status: response.status,
					statusText: response.statusText,
					error: errorText,
				});
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (!data.api_key) {
				debug('No API key in response:', data);
				throw new Error('No reCAPTCHA key found in response');
			}

			recaptchaSiteKey = data.api_key;

			try {
				const grecaptcha = await loadReCaptchaScript(recaptchaSiteKey);
				recaptchaInitialized = true;
				return grecaptcha;
			} catch (loadError) {
				throw loadError;
			}
		} catch (error) {
			debug('Error in reCAPTCHA initialization:', error);
			throw error;
		}
	};

	// Initialize reCAPTCHA immediately if enabled
	if (recaptchaEnabled) {
		try {
			await initializeReCaptcha();
		} catch (error) {
			debug('Initial reCAPTCHA initialization failed:', error);
		}
	}

	// Initialize all datepickers
	const datepickers = document.querySelectorAll('.blockons-datepicker');
	if (isPremium && datepickers.length > 0) {
		datepickers.forEach((input) => {
			flatpickr(input, {
				enableTime: input.dataset.enableTime === 'true',
				dateFormat: input.dataset.dateFormat || 'Y-m-d',
				minDate: input.dataset.minDate || undefined,
				maxDate: input.dataset.maxDate || undefined,
				placeholder:
					input.placeholder || __('Select date...', 'blockons'),
				disableMobile: true,
				theme: 'dark',
			});
		});
	}

	// Helper functions
	const showFieldError = (element, message) => {
		// Find the appropriate wrapper
		const fieldWrapper = element.closest('.form-field') || element;

		if (!fieldWrapper) return;

		// Add error state class to wrapper
		fieldWrapper.classList.add('has-error');

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

		// Find elements
		const labelElement = fieldWrapper.querySelector('.form-label');
		const descriptionElement =
			fieldWrapper.querySelector('.form-description');

		// Insert after label if it exists, otherwise after description, or at start of wrapper
		if (labelElement) {
			labelElement.insertAdjacentElement('afterend', errorDiv);
		} else if (descriptionElement) {
			descriptionElement.insertAdjacentElement('afterend', errorDiv);
		} else {
			fieldWrapper.insertAdjacentElement('afterbegin', errorDiv);
		}
	};

	const clearFieldError = (element) => {
		const fieldWrapper =
			element.closest('.form-field') ||
			element.closest('.checkbox-group') ||
			element;

		if (!fieldWrapper) return;

		// Remove error state class
		fieldWrapper.classList.remove('has-error');

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

			// Ensure the protocol is HTTP or HTTPS
			if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
				return false;
			}

			// Ensure there's at least one dot in the hostname (to avoid "https://haha")
			if (
				!parsed.hostname.includes('.') ||
				parsed.hostname.startsWith('.') ||
				parsed.hostname.endsWith('.')
			) {
				return false;
			}

			// Ensure domain is at least two characters long after the last dot (e.g., .com, .org, .net)
			const domainParts = parsed.hostname.split('.');
			const tld = domainParts[domainParts.length - 1];
			if (tld.length < 2) {
				return false;
			}

			return true;
		} catch (e) {
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
			} else if (input.type === 'radio') {
				// Get all radio buttons in this group
				const groupInputs = form.querySelectorAll(
					`input[name="${input.name}"]`,
				);
				const selectedRadio = Array.from(groupInputs).find(
					(radio) => radio.checked,
				);

				fields.push({
					name: input.name,
					label: label,
					value: selectedRadio
						? {
								value: selectedRadio.value,
								label:
									selectedRadio.nextElementSibling?.textContent.trim() ||
									selectedRadio.value,
							}
						: null,
					type: 'radio_group',
					required: input.required,
				});
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

		if (fieldData.type === 'radio_group') {
			const groupInputs = input
				.closest('form')
				.querySelectorAll(`input[name="${fieldData.name}"]`);
			const hasSelection = Array.from(groupInputs).some(
				(radio) => radio.checked,
			);

			if (!hasSelection && fieldData.required) {
				showFieldError(
					input.closest('.radio-group'),
					translations.select_option,
				);
				return false;
			}
			return true;
		}

		// Handle checkbox groups (already validated above)
		if (fieldData.type === 'checkbox_group') {
			const checkboxGroup = input
				.closest('.form-field')
				.querySelector('.checkbox-group');
			const groupInputs = input
				.closest('form')
				.querySelectorAll(
					`input[name="${input.getAttribute('name')}"]`,
				);
			const hasChecked = Array.from(groupInputs).some((cb) => cb.checked);

			if (!hasChecked && fieldData.required) {
				showFieldError(
					input.closest('.form-field'),
					translations.select_option,
				);
				return false;
			}
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
			const wrapper = form.closest('.blockons-cf-wrap');
			if (!wrapper) return;

			const elements = {
				submitBtn: form.querySelector('.blockons-cf-submit-btn'),
				successMsg: form.querySelector('.blockons-cf-msg-success'),
				errorMsg: form.querySelector('.blockons-cf-msg-error'),
				honeypot: form.querySelector('input[name="asite"]'),
				inputs: form.querySelectorAll(
					'input:not([name="asite"]):not([type="hidden"]), textarea, select',
				),
			};

			if (
				!elements.submitBtn ||
				!elements.successMsg ||
				!elements.errorMsg
			) {
				console.error('Required form elements missing');
				return;
			}

			setupInputListeners(elements.inputs);

			form.addEventListener('submit', (e) => e.preventDefault());

			elements.submitBtn.addEventListener('click', async (e) => {
				e.preventDefault();

				if (elements.honeypot?.value.trim() !== '') {
					console.log('Honeypot triggered');
					return;
				}

				if (recaptchaEnabled && recaptchaSiteKey) {
					try {
						const grecaptcha = await initializeReCaptcha();

						if (!grecaptcha) {
							throw new Error('reCAPTCHA not initialized');
						}

						// Execute reCAPTCHA and get token with unique action per form
						const formId =
							form.getAttribute('data-form-id') || 'contact_form';
						const token = await grecaptcha.execute(
							recaptchaSiteKey,
							{
								action: `submit_${formId}`,
							},
						);

						if (!token) {
							throw new Error(
								'reCAPTCHA token generation failed.',
							);
						}

						// Add token to form
						let recaptchaInput = form.querySelector(
							'input[name="recaptchaToken"]',
						);
						if (!recaptchaInput) {
							recaptchaInput = document.createElement('input');
							recaptchaInput.type = 'hidden';
							recaptchaInput.name = 'recaptchaToken';
							form.appendChild(recaptchaInput);
						}
						recaptchaInput.value = token;

						// Submit form
						submitForm(form, elements);
					} catch (error) {
						console.error('reCAPTCHA error:', error);
						handleSubmissionError(
							{ message: translations.recaptcha_error },
							elements,
						);
					}
				} else {
					submitForm(form, elements);
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
					const formField = this.closest('.form-field');
					const checkboxGroup =
						formField.querySelector('.checkbox-group');

					if (checkboxGroup) {
						const groupInputs = formField.querySelectorAll(
							'input[type="checkbox"]',
						);
						const hasChecked = Array.from(groupInputs).some(
							(cb) => cb.checked,
						);

						if (hasChecked) {
							clearFieldError(formField);
						}
					}
				});
			}
		});
	};

	const validateForm = (form, inputs) => {
		// Clear existing errors
		form.querySelectorAll('.field-error').forEach((el) => el.remove());

		let isValid = true;
		let firstErrorField = null;

		// Collect fields data
		const fields = collectFieldData(form);

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

	const submitForm = async (form, elements) => {
		if (!elements || !elements.submitBtn) return;

		try {
			elements.submitBtn.disabled = true;
			elements.submitBtn.classList.add('submitting');

			if (elements.successMsg) elements.successMsg.style.display = 'none';
			if (elements.errorMsg) elements.errorMsg.style.display = 'none';

			const wrapper = form.closest('.blockons-cf-wrap');
			if (!wrapper) throw new Error('Form wrapper not found');

			const { isValid, fields } = validateForm(form, elements.inputs);
			if (!isValid) {
				if (elements.errorMsg) {
					elements.errorMsg.style.display = 'block';
					elements.errorMsg.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
				throw new Error('Form validation failed');
			}

			if (!fields || fields.length === 0)
				throw new Error('No form fields found');

			const formData = new FormData();
			formData.append('emailTo', wrapper.dataset.emailTo || '');
			formData.append('formName', wrapper.dataset.formId || '');
			formData.append(
				'emailSubject',
				wrapper.dataset.emailSubject || translations.subject,
			);
			formData.append('fromName', wrapper.dataset.fromName || '');
			formData.append('fromEmail', wrapper.dataset.fromEmail || '');
			formData.append(
				'ccEmails',
				isPremium && wrapper.dataset.ccEmails
					? wrapper.dataset.ccEmails
					: '',
			);
			formData.append(
				'bccEmails',
				isPremium && wrapper.dataset.bccEmails
					? wrapper.dataset.bccEmails
					: '',
			);
			formData.append(
				'includeMetadata',
				wrapper.dataset.includeMetadata === 'true',
			);

			// For [page_title] shortcode
			const pageTitle = document.title;
			formData.append('pageTitle', pageTitle);

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

			formData.append('fields', JSON.stringify(processedFields));

			const fileFields = fields.filter((field) => field.type === 'file');
			fileFields.forEach((field) => {
				const input = form.querySelector(`[name="${field.name}"]`);
				if (input && input.files.length > 0) {
					formData.append(field.name, input.files[0]);
				}
			});

			// Ensure reCAPTCHA token is included
			const recaptchaInput = form.querySelector(
				'input[name="recaptchaToken"]',
			);
			if (recaptchaInput && recaptchaInput.value) {
				formData.append('recaptchaToken', recaptchaInput.value);
			} else if (recaptchaEnabled) {
				throw new Error('reCAPTCHA token missing');
			}

			const response = await fetch(
				`${blockonsFormObj.apiUrl}blcns/v1/submit-form`,
				{
					method: 'POST',
					body: formData,
				},
			);
			const data = await response.json();

			if (!response.ok)
				throw new Error(data.message || translations.error);

			handleSuccessfulSubmission(form, elements);
		} catch (error) {
			handleSubmissionError(error, elements);
		} finally {
			if (elements && elements.submitBtn) {
				elements.submitBtn.disabled = false;
				elements.submitBtn.classList.remove('submitting');
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
