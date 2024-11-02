const mongoose = require('mongoose')

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Conectado ao Banco Mongo")
    }catch(err){
        console.log("erro ao conectar ao banco", err)
    }
}

module.exports = connectDB
