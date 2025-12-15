/**
 * Validators
 * Input validation functions with consistent patterns
 */

// ============================================================
// Validation Result Type
// ============================================================

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// ============================================================
// Email Validation
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' }
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

/**
 * Simple email format check (returns boolean only)
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email?.trim() || '')
}

// ============================================================
// Password Validation
// ============================================================

export interface PasswordRequirements {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumber?: boolean
  requireSpecial?: boolean
}

const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumber: false,
  requireSpecial: false,
}

/**
 * Validate password with configurable requirements
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS,
): ValidationResult {
  const {
    minLength = 6,
    requireUppercase,
    requireLowercase,
    requireNumber,
    requireSpecial,
  } = requirements

  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    }
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    }
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    }
  }

  if (requireNumber && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    }
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character',
    }
  }

  return { isValid: true }
}

/**
 * Validate password confirmation matches
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' }
  }

  return { isValid: true }
}

// ============================================================
// Name Validation
// ============================================================

/**
 * Validate name (non-empty, reasonable length)
 */
export function validateName(
  name: string,
  fieldName: string = 'Name',
): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  const trimmed = name.trim()

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters`,
    }
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: `${fieldName} must be less than 100 characters`,
    }
  }

  return { isValid: true }
}

// ============================================================
// Phone Validation
// ============================================================

const PHONE_REGEX = /^[\d\s\-+()]{7,20}$/

/**
 * Validate phone number format (basic validation)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: true } // Phone is optional
  }

  if (!PHONE_REGEX.test(phone.trim())) {
    return { isValid: false, error: 'Please enter a valid phone number' }
  }

  return { isValid: true }
}

// ============================================================
// OTP Validation
// ============================================================

/**
 * Validate OTP code (6 digits)
 */
export function validateOTP(
  code: string,
  length: number = 6,
): ValidationResult {
  if (!code || code.trim() === '') {
    return { isValid: false, error: 'Verification code is required' }
  }

  const cleaned = code.replace(/\s/g, '')

  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Code must contain only numbers' }
  }

  if (cleaned.length !== length) {
    return { isValid: false, error: `Code must be ${length} digits` }
  }

  return { isValid: true }
}

// ============================================================
// General Validation
// ============================================================

/**
 * Validate required field
 */
export function validateRequired(
  value: unknown,
  fieldName: string = 'This field',
): ValidationResult {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  return { isValid: true }
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string = 'Value',
): ValidationResult {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    }
  }

  return { isValid: true }
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string = 'Value',
): ValidationResult {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be less than ${maxLength} characters`,
    }
  }

  return { isValid: true }
}

// ============================================================
// Form Validation Helper
// ============================================================

export type FieldValidators = Record<
  string,
  (value: unknown) => ValidationResult
>

/**
 * Validate entire form and return all errors
 */
export function validateForm<T extends Record<string, unknown>>(
  values: T,
  validators: Partial<Record<keyof T, (value: unknown) => ValidationResult>>,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [field, validator] of Object.entries(validators)) {
    if (validator) {
      const result = validator(values[field])
      if (!result.isValid && result.error) {
        errors[field] = result.error
      }
    }
  }

  return errors
}
