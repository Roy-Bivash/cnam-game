function verifyTextInput(input: string): { correct: boolean; message: string } {
    let result = { correct: false, message: "" };

    // Check if input is null, undefined or an empty string
    if (input === null || input === undefined || input.trim() === "") {
        result.message = "Erreur: Champ incomplet";
        return result;
    }

    // If the input is valid, set correct to true
    result.correct = true;
    result.message = ""; // Clear the message if input is valid
    return result;
}

function verifyPasswordInput(input: string): { correct: boolean; message: string } {
    let result = { correct: false, message: "" };

    // Check if input is null, undefined, or an empty string
    if (input === null || input === undefined || input.trim() === "") {
        result.message = "Erreur: Champ incomplet";
        return result;
    }

    // Check password length
    if (input.length < 8) {
        result.message = "Erreur: Mot de passe trop court";
        return result;
    }

    // Additional checks can be added here, such as checking for uppercase letters, numbers, etc.
    const hasUpperCase = /[A-Z]/.test(input);
    const hasLowerCase = /[a-z]/.test(input);
    const hasNumber = /\d/.test(input);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        result.message = "Erreur: Mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, et un chiffre";
        return result;
    }

    // If the password is valid, set correct to true
    result.correct = true;
    result.message = ""; // Clear the message if input is valid
    return result;
}


export {
    verifyPasswordInput,
    verifyTextInput
}