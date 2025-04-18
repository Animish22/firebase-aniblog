import { User } from "firebase/auth";
import { createContext, useContext } from "react";


type authProp =
    {
        user: (User | null  | undefined);
        setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>
    }

const authContext = createContext<authProp>({
    user: null,
    setUser: ()=>{}
});

export const useAuth = () => {
    return useContext(authContext);
};

const AuthProvider = authContext.Provider;
export default AuthProvider

