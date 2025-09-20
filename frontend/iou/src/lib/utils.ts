import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Form validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}

export function getFieldError(field: string, value: string, confirmValue?: string): string {
  if (!validateRequired(value)) {
    return `${field} is required`
  }
  
  if (field === 'Email' && !validateEmail(value)) {
    return 'Please enter a valid email address'
  }
  
  if (field === 'Confirm Password' && confirmValue && !validatePasswordMatch(confirmValue, value)) {
    return 'Passwords do not match'
  }
  
  return ''
}