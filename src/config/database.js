const mongoose=require('mongoose');
const connectDB=async()=>{
    try{
        mongoose.set('debug',process.env.MONGO_DEBUG);
        mongoose.set('allowDiskUse',true);
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('MongoDB connected...');
    }catch(err){
        console.log(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
}
module.exports={connectDB}