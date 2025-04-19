import express from "express"
import multer from "multer"
import cors from "cors"
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './index'
import asyncHandler from 'express-async-handler';
import { createContext } from "./trpc";
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import dotenv from "dotenv"

dotenv.config();
const app = express()
app.use(express.json());
// app.use(express.urlencoded()) ; 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors({ origin: `${process.env.FRONTEND_BASEURL}` }));


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// We cannot use multer within trpc as multer is an express Middleware which needs to be executed before we hand control to trpc , therefore we always have to create a separate file endpoint when using multer a

// @ts-ignore 
app.post('/imageUrl', upload.single('thumbnailFile'), asyncHandler(async (req, res) => {
  // Access the file buffer from req.file
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  // --- Optional: File Validation ---
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({ message: 'Invalid image file type.' });
  }

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxFileSize) {
    return res.status(400).json({ message: 'File size exceeds 5MB limit.' });
  }
  // --- End Validation ---
  // --- Upload the image buffer to Cloudinary using upload_stream (Type-safe) ---
  // Specify that this Promise resolves with a Cloudinary UploadApiResponse
  const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    

    //If i had used diskStorage instead of memory storage then the method would have become easier as i had to use .upload and not upload_Stream which is dealing with binary .
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // 'auto' detects the file type
      // Explicitly type the error and result parameters of the callback
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error); // Log the specific Cloudinary error
          // Reject the promise with the error
          return reject(error);
        }
        if (!result) {
             // This case should ideally not happen on success without an error,
             // but handling potential undefined makes it more robust based on types.
            return reject(new Error('Cloudinary upload result is undefined'));
        }
        // Resolve the promise with the successful result
        resolve(result);
      }
    );

    // Pipe the file buffer (from memory storage) to the upload stream
    stream.end(file.buffer); // <-- Use file.buffer
  });
  // --- End Cloudinary Upload ---

  // Send back the Cloudinary response (contains secure_url, public_id, etc.)
  return res.status(200).json({
    message: 'Upload successful',
    public_id: uploadResult.public_id,
    imageUrl: uploadResult.secure_url,

  });
})
);


app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  }),
);


app.listen(3000, () => {
  console.log("Server is Running")
})