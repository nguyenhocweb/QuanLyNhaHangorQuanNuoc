import { hash, compare } from "bcryptjs";
const saltRounds = Math.floor(Math.random() * 3) + 10; // 10, 11, hoặc 12
export const hashPass = async (pass) => {
    try {
        return await hash(pass, saltRounds);
    } catch (error) {
        console.error("Error hashing password:", error);
        return error;
    }
};
export const comparePass = async (pass,hashPass) => {
    try {
        // compare trả về true nếu pass trùng hashPass, false nếu không
        const isMatch = await compare(pass, hashPass);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        return false;
    }
}