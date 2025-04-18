import { z } from "zod";
import { procedure, router } from "./trpc";

export const appRouter = router({
    //Parse image using multer and then store it in cloudinary and then get the imageUrl from cloudinary 

})

export type AppRouter = typeof appRouter;