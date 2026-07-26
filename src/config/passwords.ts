/// <reference types="vite/client" />
import { UserRole } from '../types';

// Default initial role passwords loaded from hidden environment variables or secure defaults
const ENV_ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const ENV_DOCTOR_PASS = import.meta.env.VITE_DOCTOR_PASSWORD || 'doc123';
const ENV_ASSISTANT_PASS = import.meta.env.VITE_ASSISTANT_PASSWORD || 'assist123';

export const INITIAL_ROLE_PASSWORDS: Record<UserRole, string> = {
  admin: ENV_ADMIN_PASS,
  doctor: ENV_DOCTOR_PASS,
  assistant: ENV_ASSISTANT_PASS,
};

export const getStoredRolePasswords = (): Record<UserRole, string> => {
  try {
    const saved = localStorage.getItem('ds_role_passwords');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        admin: parsed.admin || INITIAL_ROLE_PASSWORDS.admin,
        doctor: parsed.doctor || INITIAL_ROLE_PASSWORDS.doctor,
        assistant: parsed.assistant || INITIAL_ROLE_PASSWORDS.assistant,
      };
    }
  } catch (err) {
    console.error('Error reading stored passwords:', err);
  }
  return INITIAL_ROLE_PASSWORDS;
};

export const saveRolePasswords = (passwords: Record<UserRole, string>): void => {
  try {
    localStorage.setItem('ds_role_passwords', JSON.stringify(passwords));
  } catch (err) {
    console.error('Error saving role passwords:', err);
  }
};
