import bcrypt from "bcrypt";

async function hashPassword(rawPassword) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
}

async function comparePassword(raw, hash) {
    try {
        const isMatch = await bcrypt.compare(raw, hash);
        return isMatch;
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
}

export {
    hashPassword,
    comparePassword
}