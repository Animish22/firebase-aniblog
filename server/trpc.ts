//this file is always rendered once an api request is made to the server so the context gets updated for each request . 

import { initTRPC , TRPCError} from '@trpc/server'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    return {
        req,
        res,
        // isUser : true 
    }
}
const t = initTRPC.context<typeof createContext>().create();

// const isUserMiddleware = t.middleware( ({ctx , next}) =>{
//     if(!ctx.isUser)
//     {
//         throw new TRPCError({ code : "UNAUTHORIZED"})
//     }
//     return next({ctx : { user : {id : 1}}}) ; 
// })

// export const UserProcedure = t.procedure.use(isUserMiddleware) 
export const router = t.router;
export const procedure = t.procedure;

