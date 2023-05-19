import mongoose from 'mongoose';

const connectDB = (url) =>{
    mongoose.set('strictQuery', true);

    mongoose.connect(url)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.log("Erro connect.js = " + err))

}

export default connectDB