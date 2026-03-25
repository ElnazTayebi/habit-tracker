// Email validation
export const validateEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
};

// Password rules
export const validatePassword = (password: string) => {
    return {
        minLength: password.length >= 6,
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password),
    };
};

// Confirm password match
export const validatePasswordMatch = (
    password: string,
    confirmPassword: string
) => {
    return password === confirmPassword;
};