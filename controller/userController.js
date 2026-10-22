import httpError from "../middleware/httpError.js";
import User from "../model/userModel.js"


const add = async(req,res,next)=>{

    try {

        const {name,email,password}= req.body;

        const newUser = await User.create({
            name,
            email,
            password
        })

        return res.status(200).json({success:true,message:"user added successfully",newUser})

        
    } catch (error) {
        return next(new httpError(error.message))
    }

}

const getAllUser = async(req,res,next)=>{

    try {

        const {id} = req.params;

        const user = await User.find({});

        if(user.length === 0){
          
            return next(new httpError("user not found",404))
        }

        res.status(200).json({success:true,message:"all user found successfully",total:user.length,user})
        
    } catch (error) {
        return next(new httpError(error.message))

    }

}

const login = async(req,res,next)=>{

    try {

        const {email,password} = req.body

        const user = await User.findByCredential(email,password);

        const token = await user.generateAuthToken();

        res.status(200).json({success:true,message:"user login successfully",token,user})
        
    } catch (error) {
        return next(new httpError(error.message,500))

    }

}

const authLogin = async(req,res,next)=>{

    try {

        const user = req.user;

                res.status(200).json({success:true,message:"auth login successfully",user})


        
    } catch (error) {
       return next(new httpError(error.message,500))
 
    }

}

const deleteUser = async(req,res,next)=>{

    try {

const user = req.user;
        const deleteOne = await User.deleteOne()

       res.status(200).json({success:true,message:"user deleted successfully"})

        
    } catch (error) {
       return next(new httpError(error.message,500))

    }

}

export default {add,getAllUser,login,authLogin,deleteUser};