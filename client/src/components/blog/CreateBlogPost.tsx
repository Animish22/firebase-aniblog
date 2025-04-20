import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Assuming you added Label component
import { auth, db } from '@/firebase/config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';



function CreateBlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(''); // For displaying success or error messages

  // Get the current authenticated user
  const currentUser = auth?.currentUser; 


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setThumbnailFile(event.target.files[0]);
      setMessage(''); // Clear message when file changes
    } else {
      setThumbnailFile(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!currentUser) {
      setMessage('You must be logged in to create a blog post.');
      return;
    }

    if (!title || !content || !thumbnailFile) {
      setMessage('Please fill in all fields and select a thumbnail.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData();
    // Note: We are NOT sending title, content, or userId to the upload endpoint
    // as per your clarification that the backend only handles file upload.
    // Only send the file to the backend for Cloudinary upload.
    formData.append('thumbnailFile', thumbnailFile); // 'thumbnailFile' must match the field name your backend expects.

    let imageUrl = ''; // Variable to store the Cloudinary URL

    try {
      // --- Step 1: Upload file to backend (Multer + Cloudinary) ---
      const uploadEndpointUrl = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/imageUrl`; // Replace with your backend upload endpoint URL

      const uploadResponse = await fetch(uploadEndpointUrl, {
        method: 'POST',
        body: formData,
      });
      

      if (!uploadResponse.ok) {
        // If the file upload to backend/Cloudinary failed
        const errorData = await uploadResponse.json(); // Assuming backend returns JSON error
        throw new Error(`Upload failed: ${errorData.message || uploadResponse.statusText}`);
      }

      // Assuming the backend returns a JSON object with the imageUrl
      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.imageUrl; // Get the Cloudinary URL
      console.log(imageUrl) ; 


      // --- Step 2: Save blog post data to Firestore (Client-side) ---
      if (!imageUrl) {
          throw new Error("Did not receive image URL from backend.");
      }

      const blogPostData = {
        userID: currentUser.uid, // Get UID from the client-side authenticated user
        title: title,
        content: content,
        imageUrl: imageUrl, // Use the URL received from the backend
        rating: 5, // Set Total rating
        ratedBy: [], // userId of users who have rated this post 
        createdAt: serverTimestamp(), // Firestore server timestamp
        updatedAt: serverTimestamp(), // Firestore server timestamp
      };

      // Add a new document to the 'blogs' collection in Firestore
      const docRef = await addDoc(collection(db, 'blogs'), blogPostData);

      setMessage(`Blog post created successfully with ID: ${docRef.id}`);
      console.log("Blog post written with ID:", docRef.id);

      // Clear the form on success
      setTitle('');
      setContent('');
      setThumbnailFile(null);
      const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error: any) {
      // Handle any errors during upload or Firestore save
      setMessage(`An error occurred: ${error.message}`);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10} // Adjust rows as needed
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*" // Accept only image files
            onChange={handleFileChange}
            required
            disabled={isSubmitting}
          />
          {thumbnailFile && <p className="text-sm text-gray-500 mt-1">Selected file: {thumbnailFile.name}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting || !currentUser || !title || !content || !thumbnailFile}>
          {isSubmitting ? 'Creating...' : 'Create Blog Post'}
        </Button>

        {message && (
          <p className={`text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateBlogPost;