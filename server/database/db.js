import mongoose from 'mongoose';
//const mongoose = require('mongoose');



 const  Connection = async (username,password)=>{
    const URL = `mongodb+srv://${username}:${password}@blog-app.0vngbur.mongodb.net/blogapp?retryWrites=true&w=majority`;
    try{
     await  mongoose.connect(URL,{useNewUrlParser:true});
     console.log('Database connected successfully');
    }catch(error){
       console.log("Error while connecting with the database",error);
    }
}
export default Connection;