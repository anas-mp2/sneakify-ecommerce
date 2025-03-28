const mongoose=require('mongoose');
const {Schemaa}=mongoose;

const addressSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    address:[{
        addressType:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        landMark:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        altPhone:{
            type:String,
            required:true
        
        }
    }]
})

const Address=mongoose.model("Address",addressSchema);
module.exports=Address;