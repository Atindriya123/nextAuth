import mongoose from "mongoose";

export async function connect (){
    try{
        await mongoose.connect(process.env.MONGODB_URI )
        const connection = mongoose.connection

      

        connection.on('connected',()=>{
            console.log("MONGO DB CONNECTED");
        })

        connection.on('error',(err)=>{
            console.log("mongo db connection error: "+ err);
            process.exit()
        })

    }catch(error){
         console.log("Something went wrong in connected to DB")
         console.log("error");
    }

}