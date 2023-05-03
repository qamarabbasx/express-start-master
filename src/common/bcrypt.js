const bcrypt = require("bcrypt");


module.exports={

    encryptPassword: async (password)=>{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password,salt);

    },
    comparePassword: async (password,recievedPassword)=>{
        return await bcrypt.compare(password,recievedPassword);
    }

}