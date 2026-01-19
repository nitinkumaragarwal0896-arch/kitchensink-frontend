/**
 * Frontend Validation Utilities
 * 
 * IMPORTANT: These validation rules MUST match the backend validation exactly!
 * Backend: PhoneValidationService.java, EmailValidationService.java
 * 
 * This ensures consistent validation whether called via UI or API directly.
 */

/**
 * Validates a phone number.
 * 
 * Rules (matches backend PhoneValidationService - Indian Mobile Numbers):
 * - Exactly 10 digits
 * - Must start with 6, 7, 8, or 9 (Indian mobile number prefixes)
 * - Only digits (no spaces, dashes, parentheses)
 * - No country code prefix (+91)
 * 
 * Examples:
 * - Valid: 9876543210, 8123456789, 7012345678, 6789012345
 * - Invalid: 1234567890 (starts with 1), 5123456789 (starts with 5)
 * 
 * @param {string} phoneNumber - The phone number to validate
 * @returns {{valid: boolean, error: string|null}} Validation result
 */
export const validatePhone = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { valid: false, error: 'Phone number is required' };
  }

  const trimmed = phoneNumber.trim();

  // Check for invalid characters (must be digits only)
  if (!/^\d+$/.test(trimmed)) {
    return { 
      valid: false, 
      error: 'Phone number must contain only digits (no spaces, dashes, or special characters)' 
    };
  }

  // Check exact length (Indian mobile numbers are exactly 10 digits)
  if (trimmed.length < 10) {
    return { valid: false, error: 'Phone number must be exactly 10 digits' };
  }

  if (trimmed.length > 10) {
    return { valid: false, error: 'Phone number must be exactly 10 digits (do not include +91 country code)' };
  }

  // Check if starts with valid prefix (6, 7, 8, or 9)
  const firstDigit = trimmed.charAt(0);
  if (firstDigit < '6' || firstDigit > '9') {
    return { valid: false, error: 'Phone number must start with 6, 7, 8, or 9 (Indian mobile numbers only)' };
  }

  // Final pattern check (exactly 10 digits starting with 6-9)
  if (!/^[6-9]\d{9}$/.test(trimmed)) {
    return { valid: false, error: 'Phone number format is invalid' };
  }

  return { valid: true, error: null };
};

/**
 * Validates an email address.
 * 
 * Rules (matches backend EmailValidationService):
 * - Must follow standard email format (user@domain.tld)
 * - Domain must have at least one dot
 * - No spaces or special characters (except @, ., _, -, +)
 * 
 * @param {string} email - The email address to validate
 * @returns {{valid: boolean, error: string|null}} Validation result
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email address is required' };
  }

  const trimmed = email.trim();

  // Check for spaces
  if (trimmed.includes(' ')) {
    return { valid: false, error: 'Email address cannot contain spaces' };
  }

  // Check for @ symbol
  if (!trimmed.includes('@')) {
    return { valid: false, error: 'Email address must contain @ symbol' };
  }

  // Check for multiple @ symbols
  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount > 1) {
    return { valid: false, error: 'Email address can only contain one @ symbol' };
  }

  // Split into local and domain parts
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Email format is invalid' };
  }

  const [localPart, domain] = parts;

  // Validate local part
  if (!localPart) {
    return { valid: false, error: 'Email address must have a username before @' };
  }

  if (localPart.length > 64) {
    return { valid: false, error: 'Email username is too long (max 64 characters)' };
  }

  // Validate domain
  if (!domain) {
    return { valid: false, error: 'Email address must have a domain after @' };
  }

  if (!domain.includes('.')) {
    return { valid: false, error: 'Email domain must contain at least one dot (e.g., example.com)' };
  }

  if (domain.startsWith('.') || domain.endsWith('.')) {
    return { valid: false, error: 'Email domain cannot start or end with a dot' };
  }

  if (domain.length > 253) {
    return { valid: false, error: 'Email domain is too long' };
  }

  // Additional check: no consecutive dots
  if (trimmed.includes('..')) {
    return { valid: false, error: 'Email cannot contain consecutive dots' };
  }

  // Check domain structure
  const domainParts = domain.split('.');
  
  // Domain must have at least 2 parts (e.g., example.com)
  if (domainParts.length < 2) {
    return { valid: false, error: 'Email domain must have at least two parts (e.g., example.com)' };
  }

  // Domain should have maximum 3 parts (e.g., mail.google.com)
  // Prevents: example.com.com or test.example.com.org
  if (domainParts.length > 3) {
    return { valid: false, error: 'Email domain has too many parts (max: subdomain.domain.com)' };
  }

  const tld = domainParts[domainParts.length - 1];
  const secondLevelDomain = domainParts[domainParts.length - 2];
  
  // Common TLDs that should only appear once at the end
  const commonTLDs = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'co', 'io', 'ai', 'app', 'dev'];
  
  // Check if second-level domain is a common TLD (e.g., .com.com)
  if (commonTLDs.includes(secondLevelDomain.toLowerCase())) {
    return { valid: false, error: 'Email domain format is invalid (double extension detected like .com.com)' };
  }
  
  // Ensure TLD is valid (2-7 letters, no numbers)
  if (!/^[a-zA-Z]{2,7}$/.test(tld)) {
    return { valid: false, error: 'Email domain extension must be 2-7 letters only' };
  }

  // Ensure second-level domain is valid (letters, numbers, hyphens)
  if (!/^[a-zA-Z0-9-]+$/.test(secondLevelDomain)) {
    return { valid: false, error: 'Email domain contains invalid characters' };
  }

  // Validate format with regex (after structure checks)
  const emailPattern = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,7}$/;
  if (!emailPattern.test(trimmed)) {
    return { valid: false, error: 'Email format is invalid (must be like user@example.com)' };
  }

  return { valid: true, error: null };
};

/**
 * Validates a name (professional standard).
 * 
 * Rules:
 * - Must contain only letters, spaces, hyphens, and apostrophes
 * - Must not contain numbers or special characters
 * - Must be 2-50 characters
 * - Required
 * 
 * @param {string} name - The name to validate
 * @returns {{valid: boolean, error: string|null}} Validation result
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }

  const trimmed = name.trim();

  // Check minimum length
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  // Check maximum length
  if (trimmed.length > 50) {
    return { valid: false, error: 'Name must not exceed 50 characters' };
  }

  // Check for numbers
  if (/\d/.test(trimmed)) {
    return { valid: false, error: 'Name must not contain numbers' };
  }

  // Check for invalid special characters (allow only letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true, error: null };
};

/**
 * Validates a password (professional security standard).
 * 
 * Rules:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 digit (0-9)
 * - At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
 * 
 * @param {string} password - The password to validate
 * @returns {{valid: boolean, error: string|null}} Validation result
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { valid: false, error: 'Password is required' };
  }

  const trimmed = password.trim();

  // Check minimum length
  if (trimmed.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(trimmed)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter (A-Z)' };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(trimmed)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter (a-z)' };
  }

  // Check for digit
  if (!/\d/.test(trimmed)) {
    return { valid: false, error: 'Password must contain at least one number (0-9)' };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(trimmed)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&* etc.)' };
  }

  return { valid: true, error: null };
};

/**
 * Validates all member fields at once.
 * Returns an object with field-specific errors.
 * 
 * @param {{name: string, email: string, phoneNumber: string}} member 
 * @returns {{valid: boolean, errors: {name?: string, email?: string, phoneNumber?: string}}}
 */
export const validateMember = (member) => {
  const errors = {};

  // Validate name
  const nameResult = validateName(member.name);
  if (!nameResult.valid) {
    errors.name = nameResult.error;
  }

  // Validate email
  const emailResult = validateEmail(member.email);
  if (!emailResult.valid) {
    errors.email = emailResult.error;
  }

  // Validate phone
  const phoneResult = validatePhone(member.phoneNumber);
  if (!phoneResult.valid) {
    errors.phoneNumber = phoneResult.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Real-time validation hook for React forms.
 * Call this as user types for instant feedback.
 * 
 * @param {string} field - Field name ('name', 'email', 'phoneNumber', 'password', 'firstName', 'lastName')
 * @param {string} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (field, value) => {
  switch (field) {
    case 'name':
    case 'firstName':
    case 'lastName':
      return validateName(value).error;
    case 'email':
      return validateEmail(value).error;
    case 'phoneNumber':
      return validatePhone(value).error;
    case 'password':
      return validatePassword(value).error;
    default:
      return null;
  }
};

