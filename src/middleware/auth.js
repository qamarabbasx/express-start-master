const {userService}= require('../services');
const {verifyToken}=require('../common/jwt');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');


module.exports = {
    Auth: asyncHandler(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new ErrorResponse('Not authorized to access this route', 400));
        }
        try {
            const decoded = verifyToken(token);
            const user = await userService.findById(decoded.id);
            if (!user) {
                return next(new ErrorResponse('User not found', 404));
            }
            if(user.blocked===true){
                return next(new ErrorResponse('User is blocked', 400));
            }
            req.user = user;
            next();
        } catch (error) {
            return next(new ErrorResponse('Not authorized to access this route', 400));
        }
    }),
};
