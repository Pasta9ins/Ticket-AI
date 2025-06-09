import { inngest } from "../client.js";
import  Ticket from "../../models/ticket.model.js"
import { NonRetriableError } from "inngest"
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";
import User from "../../models/user.model.js"


export const onTicketCreated = inngest.createFunction(
    { id: "on-ticket-created", retries: 2 },
    { event: "ticket/created" },
    async ({event, step})=>{
        try {
            const {ticketId} = event.data;
            const ticket = await step.run("fetch-ticket", async()=>{
                const ticketObject = await Ticket.findById(ticketId);
                if(!ticketObject){
                    throw new NonRetriableError("no ticket found");
                }
                return ticketObject;
            });

            await step.run("update-ticket-status", async ()=>{
                await Ticket.findByIdAndUpdate(ticket._id, {status:"todo"});
            })

            const aiResponse = await analyzeTicket(ticket);

            const relatedSkills = await step.run("ai-processing", async()=>{
                let skills=[];
                if(aiResponse){
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority:!["low", "medium", "high"]
                        .includes(aiResponse) ? "medium" : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status:"in_process",
                        relatedSkills: aiResponse.relatedSkills

                    })
                    skills = aiResponse.relatedSkills;
                }
                return skills;
            });

            const moderator = await step.run("assign-moderator", async()=>{
                let user = await User.findOne({
                    role:"moderator",
                    skills:{
                        $elemMatch:{$regex: new RegExp(relatedSkills.join("|"), "i")}
                    }
                });
                
                if(!user){
                    user = await User.findOne({
                        role:"admin"
                    })
                }

                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null,
                })

                // console.log("Assigned Moderator/Admin:", user); // Add this line
                // console.log("Assigned Moderator Email:", user?.email); // Add this line

                return user;
            });

            await step.run("send-notification", async()=>{
                if(moderator){
                    const finalTicket = await Ticket.findById(ticket._id);
                    await sendMail(moderator.email,"New Ticket Incoming", `a new ticket id assigned to you -> ${finalTicket.title}`);
                }
            });

            return {success:true};
            
        } 
        catch (err) {
            // console.error("Error running the step", err.message);
            // return {success:false};

            console.error("Error in onTicketCreated Inngest function:", err.message); // Modify this line
            return {success:false, error: err.message}; // Optionally return the error message
        }
    }
)