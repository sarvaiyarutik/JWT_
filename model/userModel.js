
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
      email:{
        type:String,
        required:true
    },


    password:{
        type:String,
        required:true,
        trim:true,
        validate:(password)=>{
            if(password === "password"){
                throw new Error("password word not match")
            }
        },
    },
    tokens:[
        {
            token:{
                type:String
            }
        }
    ]
})

userSchema.pre("save",async function () {

    try {

        const user = this;

        if(user.isModified("password")){
            user.password = await bcrypt.hash(user.password,10)
        }
    
    } catch (error) {
       throw new Error("password  failed");
    }
})

userSchema.statics.findByCredential = async function(email,password) {
    
try {

    const user = await this.findOne({email});

    if(!user){
        throw new Error("unable to login");
    }
    
    const isMatched = await bcrypt.compare(password,user.password)

    if(!isMatched){
        throw new Error("unable to login");
    }

    return user;

} catch (error) {
    throw new Error("unable to login")
}
}

userSchema.methods.generateAuthToken = async function () {

    try {

        const user = this;

        const token = jwt.sign({_id: user._id.toString()},process.env.JSON_SECRET,{expiresIn:"10d"}) 

        user.tokens = user.tokens.concat({token});

        await user.save();

        return token;
        
    } catch (error) {   
        throw new Error(error);
        
    }

}

const User = mongoose.model("user data",userSchema);

export default User;