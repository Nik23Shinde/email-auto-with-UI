const mongoose = require ('mongoose')
const validator = require ('validator')

const emailSchema = mongoose.Schema({
    userid:{
        type:Number,
        required:true
    },
    from:{
        type:String,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                console.log('Email id is not valid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    to:{
        type:String,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                console.log('Email id is not valid')
            }
        }

    },
    subject:{
        type:String,
        required:true,
        trim:true
    },
    message:{
        type:String,
        required:true,
        trim:true
    },
    datestring:{
        type:String,
        required:true,
        trim:true
    }
})


module.exports = new mongoose.model('EMAIL',emailSchema)