import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export const SignUpEmail = async (email : string, password : string) =>{
    try {
        const userCrendentials = await createUserWithEmailAndPassword(auth , email , password);
        console.log(`User ${userCrendentials.user.displayName} and user credentials are ${userCrendentials}`)
        return userCrendentials.user
    } catch (error) {
        console.log(error)  
        return null
    }
}