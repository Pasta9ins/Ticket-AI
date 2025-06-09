import { inngest } from "../client.js";
import User from "../../models/user.model.js"
import { NonRetriableError } from "inngest"
import { sendMail } from "../../utils/mailer.js";


export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({event, step})=>{
        try {
            const {email} = event.data
            const user = await step.run("get-user-email", async()=>{
                const userObject = await User.findOne({email})
                if(!userObject)
                    throw new NonRetriableError("user not found in database")
                return userObject;
            });

            await step.run("send-welcome-email", async()=>{
                const subject = `Welcome to the App`
                const message = `Hi,
                \n
                Thanks for signing up! We’re excited to have you.
                🧑‍💻 Users can raise tickets anytime they need help.
                🛠️ Moderators can start resolving queries to assist our growing community.`

                await sendMail(user.email, subject, message);
            });

            return {success: true};
        } 
        
        catch (error) {
            console.error("error in step", error.message);
            return {success: false};
        }
    }
);
