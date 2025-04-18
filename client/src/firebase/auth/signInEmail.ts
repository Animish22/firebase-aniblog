import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../config/firebase";

export const SignInEmail = async (email : string, password : string)=>{
    try {
        
        const userCrendentials  = await signInWithEmailAndPassword(auth , email , password);
        console.log(`User ${userCrendentials.user} and user credentials are ${userCrendentials}`)
        return userCrendentials.user
    } catch (error) {
        console.log(error)  
        return null
    }
}