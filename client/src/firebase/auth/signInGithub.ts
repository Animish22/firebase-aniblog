import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
export const SignInGithub = async()=>{
    try {
        provider.addScope('repo') ; 
        const result = await signInWithPopup(auth , provider);
        // const credential = GithubAuthProvider.credentialFromResult(result) ;
        // console.log(credential) ; 
        //this token can then be used to access github API
        // const token = credential?.accessToken 
    
        const user = result.user;


        console.log(`User has  signed in  using github` , user) 

        return user ; 
    } catch (error) {
        console.log(error) ; 
        return null
    }
}
