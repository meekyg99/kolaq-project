export function validateNigerianPhone(phone: string): boolean {
  if (!phone) return false;
  
  // Remove all spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Pattern accepts:
  // 08012345678 (11 digits starting with 0)
  // +2348012345678 (14 digits starting with +234)
  // 2348012345678 (13 digits starting with 234)
  const pattern = /^(\+?234|0)?[789][01]\d{8}$/;
  
  return pattern.test(cleaned);
}

export function formatNigerianPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If starts with 234, format as +234 XXX XXX XXXX
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  // If starts with 0, convert to +234 format
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // If just 10 digits (missing leading 0), add +234
  if (cleaned.length === 10 && /^[789][01]/.test(cleaned)) {
    return `+234 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  // Return original if can't format
  return phone;
}

export function normalizeNigerianPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Convert to +234XXXXXXXXXX format
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+234${cleaned.slice(1)}`;
  }
  
  if (cleaned.length === 10 && /^[789][01]/.test(cleaned)) {
    return `+234${cleaned}`;
  }
  
  return phone;
}

export function extractNigerianPhoneDigits(phone: string): string {
  // Returns just the 10 digits after country code (e.g., 8012345678)
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return cleaned.slice(3);
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return cleaned.slice(1);
  }
  
  if (cleaned.length === 10) {
    return cleaned;
  }
  
  return cleaned;
}
