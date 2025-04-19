//this file is always rendered once an api request is made to the server so the context gets updated for each request . 

import { initTRPC} from '@trpc/server'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    return {
        req,
        res, 
    }
}
const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;

