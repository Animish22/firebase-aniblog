import { auth, db } from "@/firebase/config/firebase";
import { doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom"
import BlogPostCard from "../BlogPostCard";
import { useEffect, useState } from "react";


const Blog =  () => {

  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [blog , setBlog] = useState<DocumentSnapshot<DocumentData, DocumentData> | null>(null) ; 
  const [canEdit  , setCanEdit] = useState<boolean>(false) ; 

  if (!id) {
    return "No such id";
  }
  useEffect(() => {
    const fetchBlog = async () => {
      
      try {
        const blogRef = doc(db, "blogs", id);
        const blog = await getDoc(blogRef);
  
        if (!blog.exists()) {
          return "No blog with this id exists";
        }
        if(blog.data().userID === auth?.currentUser?.uid)
        {
          setCanEdit(true) ; 
        }
        setBlog(blog) ; 
      } catch (error) {
        console.log(error) ; 
      }finally{
        setLoading(false) ; 
      }
    }
    fetchBlog();
  }, [id])

  if(loading)
  {
    return <div className="min-h-screen flex justify-center items-center"><h1>Loading Blog Post......</h1></div>;
  }

  if(!blog)
  {
    return <div className="min-h-screen flex justify-center items-center"><h1>Blog Post Not Found</h1></div>;
  }



  return (
    <div className="min-h-screen flex justify-center items-center">
      <BlogPostCard id={id} title={blog.data()?.title} content={blog.data()?.content} imageUrl={blog.data()?.imageUrl} canEdit={canEdit} />
    </div>
  )
}

export default Blog