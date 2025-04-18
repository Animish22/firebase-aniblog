import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";


export const SignOut = async ()=>{
    try {
        await signOut(auth) ;
        console.log("Signout Success!") 
        return {sucess: true} ; 
    } catch (error) {
        console.log(error) ; 
        return {success: false } ; 
    }
}