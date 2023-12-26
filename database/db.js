import mongoose from "mongoose"
const URL=`mongodb+srv://user:eduvoyage09@cluster0.ofubbv1.mongodb.net/?retryWrites=true&w=majority`;
export const Connection =async()=>{
    try{
        await mongoose.connect(URL,{ useNewUrlParser: true }); 
        console.log('Database connected successfully');
    }catch(error){
        console.log('Error while connecting to the database ', error);
    }
} 
export default Connection;