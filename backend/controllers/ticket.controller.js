import {inngest} from "../inngest/client.js"
import Ticket from "../models/ticket.model.js"

export const createTicket = async(req, res)=>{
    try {
        const {title, description} = req.body;
        // console.log("re.body details:", req.body);//---------------------------------
        if(!title || !description || title.trim() === "" || description.trim() === ""){//addition cursor-----------------------------
            return res.status(400).json({message:"Title and Description needed!"});
        }
        const newTicket = await Ticket.create({//added await cursor
            title,
            description,
            createdBy: req.user._id.toString()
        });

        await inngest.send({
            name:"ticket/created",
            data:{
                ticketId: (await newTicket)._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        });

        return res.status(201).json({message:"Ticket created and processing started", ticket: newTicket});

    } 
    catch (error) {
        console.error("Error creating ticket",error.message);
        return res.status(500).json({message:"Internal Server Error: createTicket controller"});
    }
}

export const getTickets = async(req,res)=>{
    try {
    const user = req.user;
    let tickets = [];
    
    //old schema
    // if(user.role !== "user"){
    //     tickets = await Ticket.find({})
    //     .populate("assignedTo", ["email", "_id"])
    //     .sort({createdAt:-1});
    // }
    // else{
    //     tickets = await Ticket.find({createdBy:user._id})
    //         .select("title description status createdAt")
    //         .sort({createdAt:-1});
    // }

    // new routing for admin-all, for moderator-assigned to them, user-createdBy
    if(user.role === "admin"){
        tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({createdAt:-1});
    }
    else if(user.role === "moderator"){
        tickets = await Ticket.find({assignedTo:user._id})
        .populate("assignedTo", ["email", "_id"])
        .sort({createdAt:-1});
    }
    else{
        tickets = await Ticket.find({createdBy:user._id})
            .select("title description status createdAt")
            .sort({createdAt:-1});
    }


    return res.status(200).json({tickets});//cursor edit------------------
    } 
    catch (error) {
        console.error("Error getting tickets",error.message);
        return res.status(500).json({message:"Internal Server Error: getTickets controller"});
    }
}

export const getTicket = async(req,res)=>{
    try {
        const user = req.user;
        let ticket;
        if(user.role !== "user"){
            ticket = await Ticket.findById(req.params.id)
            .populate("assignedTo", ["email", "_id"]);
        }
        else{
            ticket = await Ticket.findOne({createdBy:user._id, _id:req.params.id})
            .select("title description status createdAt assignedTo")
            .populate("assignedTo", ["email", "_id"])//extra----------------------
        }

        if(!ticket){
            return res.status(404).json({message:"No Ticket Found"});
        }

        return res.status(200).json({ticket});

    } catch (error) {
        console.error("Error getting a ticket",error.message);
        return res.status(500).json({message:"Internal Server Error: getTicket controller"});
    }
}