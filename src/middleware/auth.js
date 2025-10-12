import jwt from "jsonwebtoken";

/**
 * Optional JWT middleware.
 * It doesn’t block requests — it only attaches decoded user info if token exists.
 * You can make it mandatory later if needed.
 */
export const authOptional = (req, _res, next) => {
    const header = req.headers.authorization;

    if (header?.startsWith("Bearer ")) {
        const token = header.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // attach decoded token to request
        } catch (err) {
            // ignore invalid tokens (assignment says JWT is optional)
        }
    }
    next();
};

/**
 * Strict version (optional bonus):
 * Uncomment below if you want to protect employee routes with JWT.
 */
// export const authRequired = (req, res, next) => {
//   const header = req.headers.authorization;
//   if (!header?.startsWith("Bearer ")) {
//     return res.status(401).json({ status: false, message: "Unauthorized" });
//   }
//   try {
//     const token = header.split(" ")[1];
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch (err) {
//     return res.status(401).json({ status: false, message: "Unauthorized" });
//   }
// };
