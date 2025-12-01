export function formatNigerianPhone(phone: string): string {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  if (cleaned.length === 10 && /^[789][01]/.test(cleaned)) {
    return `+234 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
}

export function validateNigerianPhone(phone: string): boolean {
  if (!phone) return false;
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const pattern = /^(\+?234|0)?[789][01]\d{8}$/;
  
  return pattern.test(cleaned);
}

export function normalizePhoneForSubmit(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
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
