import mongoose from 'mongoose';

const connecttodb=async()=>{
    
    await mongoose.connect('mongodb+srv://lci2021021:pranjal123@cluster0.psscjoi.mongodb.net', {
   
})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });
}
export default connecttodb;