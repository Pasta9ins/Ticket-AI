import jwt from "jsonwebtoken"
import {inngest} from "../inngest/client.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"

export const signup = async (req, res) =>{
    const {email, password, skills=[], role} = req.body//edit cursor role----------  

    try {
        const hashed = await bcrypt.hash(password, 10);//changed from otiginal-------------------------
        const user = await User.create({email, password:hashed, skills, role});//edit cursor role----------

        //inngest event
        await inngest.send({
            name:"user/signup",
            data:{email}
        });

        const token = jwt.sign({_id:user._id, role:user.role}, process.env.JWT_SECRET);
        res.json({user, token})
    } 
    catch (error) {
        res.status(500).json({error:"signup error", details: error.message})   
    }
}

export const login = async (req, res) =>{
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user)
            return res.status(404).json({error:"email not found"})
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch)
            return res.status(401).json({error:"invalid password"})

        const token = jwt.sign({_id:user._id, role:user.role}, process.env.JWT_SECRET);

        //new fix-----------------------------------------------
        const userObject = user.toObject(); // Convert Mongoose document to plain JS object
        delete userObject.password; // Remove password before sending
        delete userObject.__v; 

        res.json({user:userObject, token});
    } 
    catch (error) {
        res.status(500).json({error:"login error", details: error.message})
    }
}

export const logout = async (req, res) =>{
    try {
    
    const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({error:"Authorization header missing"});
        }

        // 2. Safely split the header to get the token
        // Expected format: "Bearer TOKEN_VALUE"
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({error:"Invalid Authorization header format"});
        }

        const token = parts[1];
    
    // const token = req.headers.authorization.split(" ")[1] //bearer_tokenValue    
    // if(!token)
    //     res.status(401).json({error:"unauthorized"})

    
    
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err)
            return res.status(401).json({error:"unauthorized"});
        res.json({message:"logout successful"})
    })
    } 
    catch (error) {
        res.status(500).json({error:"logout error", details: error.message})
    }
}

export const updateUser = async (req, res) =>{
    const {skills=[], email, role} = req.body;
    try {
        if(req.user?.role!== "admin"){
            return res.status(403).json({error:"forbidden updation"})
        }

        const user = await User.findOne({email})
        if(!user) 
            return res.status(401).json({error:"user not found"})

        await User.updateOne({email},
            {skills: skills.length? skills : user.skills , role}
        )
        return res.json({message:"updated successfully"});
    } 
    catch (error) {
        res.error(500).json({error:"updateUser error", details: error.message});       
    }
}

export const getUsers = async (req, res) =>{
    try {
        if(req.user?.role !== "admin"){     //---------maybeError-------here
            return res.status(403).json({error:"forbidden access to get users"})
        }
        
        const users = await User.find().select("-password");
        return res.json(users);
    } 
    catch (error) {
        res.error(500).json({error:"getUsers error", details: error.message});
    }
}