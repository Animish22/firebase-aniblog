import React, { useState, FormEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { db } from '@/firebase/config/firebase'; 
import { doc, getDoc, updateDoc, serverTimestamp, DocumentSnapshot } from 'firebase/firestore'; 
import { User } from 'firebase/auth'; 
import { Button } from '../ui/button';
import { useAuth } from '@/context/context';


interface BlogPostData {
  userID: string;
  title: string;
  content: string;
  imageUrl: string;
  updatedAt?: any;
}

function EditBlogPost() {
  const { id } = useParams<{ id: string }>();
  const {user} = useAuth() ; 
  const navigate = useNavigate();

  // --- State for Form Fields ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState(''); 

  // --- State for Component Status ---
  const [isFetchingData, setIsFetchingData] = useState(true); // To indicate initial data loading
  const [isSubmitting, setIsSubmitting] = useState(false); // To indicate form submission status
  const [message, setMessage] = useState(''); // For displaying status messages
  const [error, setError] = useState<string | null>(null); // For displaying errors (fetch or auth)

  // Get the current authenticated user

  const currentUser: User | null | undefined = user;


  // --- Effect to Fetch Existing Blog Post Data ---
  useEffect(() => {
    setMessage('');
    setError(null);
    setIsFetchingData(true);
    setThumbnailFile(null); 

    if (!id) {
      setError("Blog post ID is missing from the URL.");
      setIsFetchingData(false);
      return;
    }

    const fetchBlogPost = async () => {
      try {
        const blogRef = doc(db, "blogs", id);
        const blogSnap: DocumentSnapshot<BlogPostData> = await getDoc(blogRef) as DocumentSnapshot<BlogPostData>; 

        if (!blogSnap.exists()) {
          setError(`Blog post with ID "${id}" not found.`);
          navigate('/dashboard'); // Or navigate to a 404 page
          return;
        }

        const blogData = blogSnap.data();

        if (!blogData) {
          setError("Error fetching blog data.");
          return;
        }

        // --- Authorization Check ---
        if (!currentUser) {
          setError("You must be logged in to edit blog posts.");
          navigate('/signin');
          return;
        }
        if (blogData.userID !== currentUser.uid) {
          setError("You are not authorized to edit this blog post.");
          navigate('/dashboard');
          return;
        }
        // --- End Authorization Check ---


        // Populate form states with fetched data
        setTitle(blogData.title);
        setContent(blogData.content);
        setExistingImageUrl(blogData.imageUrl); // Store the existing image URL


      } catch (err: any) {
        console.error("Error fetching blog post for editing:", err);
        setError(`Failed to load blog post: ${err.message}`);
      } finally {
        setIsFetchingData(false); // Stop fetching indicator
      }
    };

    fetchBlogPost();

  }, [id, currentUser]); 


  // --- Handler for File Input Change ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      setThumbnailFile(selectedFile);
      setMessage(''); 
    } else {
      setThumbnailFile(null);
    }
  };

  // --- Handler for Form Submission ---
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Basic validation and checks before submitting
    if (!currentUser) {
      setMessage('Authentication error. Please log in again.');
      return;
    }
    if (error) { // Prevent submission if there's a fetch/auth error
      setMessage(`Cannot save due to previous error: ${error}`);
      return;
    }
    if (!title || !content) {
      setMessage('Title and Content cannot be empty.');
      return;
    }

    // Determine the image URL to save
    let finalImageUrl = existingImageUrl; // Start with the existing URL

    setIsSubmitting(true);
    setMessage('');

    try {
      // --- Step 1: Upload New File if one was selected ---
      if (thumbnailFile) {
        const uploadEndpointUrl = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/imageUrl`; 

        const formData = new FormData();
        formData.append('thumbnailFile', thumbnailFile); 

        console.log("Uploading new thumbnail...");
        const uploadResponse = await fetch(uploadEndpointUrl, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(`Thumbnail upload failed: ${errorData.message || uploadResponse.statusText}`);
        }

        const uploadResult = await uploadResponse.json();
        finalImageUrl = uploadResult.imageUrl; 

        if (!finalImageUrl) {
          throw new Error("Did not receive new image URL from backend after upload.");
        }
        console.log("New thumbnail uploaded:", finalImageUrl);

      } else {
        console.log("No new thumbnail selected, keeping existing image.");
        // If no new file, finalImageUrl remains the existing one.
        // Add a check to ensure we have *an* image URL if one is required for posts
        // if (!existingImageUrl) {
        //      throw new Error("An image is required for blog posts, but no existing image or new file provided.");
        // }
      }


      // --- Step 2: Update blog post data in Firestore ---
      const blogRef = doc(db, 'blogs', id!); // Get the document reference using the ID (id is guaranteed by useParams check)

      const updatedData: Partial<BlogPostData> = {
        title: title,
        content: content,
        imageUrl: finalImageUrl, 
        updatedAt: serverTimestamp(),
      };

      console.log("Updating Firestore document:", id, updatedData);
      await updateDoc(blogRef, updatedData);

      setMessage('Blog post updated successfully!');
      console.log("Blog post updated with ID:", id);

      // Redirect after successful update
      navigate(`/blog/${id}`); // Navigate to the single blog post view


    } catch (err: any) {
      setMessage(`An error occurred during update: ${err.message}`);
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false); // End submission status
    }
  };

  // --- Render Logic ---

  // Show loading state while fetching initial data
  if (isFetchingData) {
    return <div className="min-h-screen flex justify-center items-center"><h1>Loading Blog Post for Editing......</h1></div>;
  }

  // Show error if fetching initial data failed or auth check failed
  if (error) {
    return <div className="min-h-screen flex justify-center items-center"><h1>Error: {error}</h1></div>;
  }

  // Render the form once data is loaded and no errors
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      {/* Add message display area */}
      {message && (
        <p className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-500' : message.includes('Error') || message.includes('failed') ? 'text-red-500' : 'text-blue-500'}`}>
          {message}
        </p>
      )}

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
            rows={10}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting} 
          />
          {/* Display selected file name if new file chosen */}
          {thumbnailFile ? (
            <p className="text-sm text-gray-500 mt-1">New file selected: {thumbnailFile.name}</p>
          ) : (
            // Display existing image URL or placeholder if no new file selected
            existingImageUrl && <p className="text-sm text-gray-500 mt-1">Current image: <a href={existingImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{existingImageUrl.substring(0, 50)}...</a></p>
          )}
          {/* Add a preview for the new image if one is selected (optional) */}
          {/* {thumbnailFile && <img src={URL.createObjectURL(thumbnailFile)} alt="New thumbnail preview" className="mt-2 h-32 object-cover"/>} */}
        </div>

        {/* Disable button while submitting, fetching initial data, or if there are critical errors */}
        <Button type="submit" disabled={isSubmitting || isFetchingData || !!error || !title || !content || (!thumbnailFile && !existingImageUrl)}>
          {isSubmitting ? 'Updating...' : 'Update Blog Post'}
        </Button>

      </form>
    </div>
  );
}

export default EditBlogPost;