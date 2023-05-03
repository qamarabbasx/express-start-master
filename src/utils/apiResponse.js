module.exports={
    Success: (res, data, message) => {
        res.status(200).json({
            success: true,
            data: data,
            message: message
        });
    },
    NotFound: (res, message) => {
        res.status(404).json({
            success: false,
            data: null,
            message: message
        });
    },
    BadRequest: (res, message) => {
        res.status(400).json({
            success: false,
            data: null,
            message: message
        });
    },
    Unauthorized: (res, message) => {
        res.status(401).json({
            success: false,
            data: null,
            message: message
        });
    }
}