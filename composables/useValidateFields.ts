import type { typesOfValidation } from "~/types/TypeValidate"

export function useValidateForm() {

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 

    const validateEmail = (email: string): typesOfValidation => {

        if (email.trim().length === 0) {
            return {isValid: false, errorType: "empty"}
        } 

        if (!regexEmail.test(email)) {
            return {isValid: false, errorType: "format"}
        }

        return {isValid: true, errorType: ""}
    }

    const validatePassword = (password: string): typesOfValidation => {

        if (password.trim().length === 0) {
            return { isValid: false, errorType: "empty" }
        }

        if (password.trim().length < 6) {
            return { isValid: false, errorType: "format" }
        }

        return {isValid: true, errorType: ""}
    }

    const validateName = (name: string): typesOfValidation => {

        if (name.trim().length === 0) {
            return { isValid: false, errorType: "empty" }
        }

        if (name.trim().length > 45) {
            return { isValid: false, errorType: "format" }
        }

        return {isValid: true, errorType: ""}
    }

    const checkPasswords = (password: string, repeatPassword: string) => {

        if (repeatPassword.trim().length === 0) {
            return { isValid: false, errorType: "empty" }
        }

        if (repeatPassword !== password) {
            return { isValid: false, errorType: "incompatiblePasswords" }
        }

        return {isValid: true, errorType: ""}
    }

    return {
        validateEmail,
        validatePassword,
        validateName,
        checkPasswords
    }
}