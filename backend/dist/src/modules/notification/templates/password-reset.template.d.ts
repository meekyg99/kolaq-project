interface PasswordResetData {
    customerName: string;
    resetUrl: string;
}
export declare function passwordResetTemplate(data: PasswordResetData): string;
export {};
