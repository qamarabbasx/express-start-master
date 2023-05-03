const jwt=require('jsonwebtoken');



module.exports = {
    generateToken: (id) => {
        const token = jwt.sign({id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        return token;
    },
    verifyToken: (token) => {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
};

