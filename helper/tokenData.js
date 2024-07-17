import jwt from "jsonwebtoken";

export const tokenData = (request) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        console.log("Token from cookies:", token); // Log the token

        if (!token) {
            throw new Error("Token not found");
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("Decoded Token:", decodedToken); // Log the decoded token

        return decodedToken.id;
    } catch (error) {
        throw new Error(error.message);
    }
};
