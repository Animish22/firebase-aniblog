import { auth, db } from "@/firebase/config/firebase";
import { doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import BlogPostCard from "../BlogPostCard";
import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/context/context";
import { Input } from "../ui/input";
import { Button } from "../ui/button";



interface BlogData {
  title: string;
  content: string;
  imageUrl: string;
  userID: string;
  ratedBy: string[];
  rating: number;
}


const Blog = () => {

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();


  const [blogRating, setBlogRating] = useState<number>(0);
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [blogReference, setBlogReference] = useState<DocumentReference<DocumentData, DocumentData> | null>(null);


  const [loading, setLoading] = useState(true);

  const [blog, setBlog] = useState<DocumentSnapshot<BlogData> | null>(null);

  const [canEdit, setCanEdit] = useState<boolean>(false);


  const [currentRatedBy, setCurrentRatedBy] = useState<string[]>([]);
  const [totalRatingSum, setTotalRatingSum] = useState<number>(0);



  if (!id) {
    return <div className="min-h-screen flex justify-center items-center"><h1>Blog ID Not Provided</h1></div>;
  }


  useEffect(() => {
    const fetchBlog = async () => {

      try {

        const blogRef = doc(db, "blogs", id) as DocumentReference<BlogData>;
        setBlogReference(blogRef);
        const blogSnapshot = await getDoc(blogRef);

        if (!blogSnapshot.exists()) {
          setBlog(null);
          return;
        }

        const blogData = blogSnapshot.data();

        if (blogData.userID === auth?.currentUser?.uid) {
          setCanEdit(true);
        }

        setBlog(blogSnapshot);


        setCurrentRatedBy(blogData.ratedBy ?? []);
        setTotalRatingSum(blogData.rating ?? 0);


      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const ratingValue = Number(blogRating);


    if (!user?.uid) {
      setMessage("You must be logged in to rate.");
      return;
    }
    if (ratingValue < 0 || ratingValue > 5) {
      setMessage("Rating must be between 0 and 5.");
      return;
    }
    if (!blogReference) {
      setMessage("Blog reference not available. Cannot submit rating.");
      return;
    }
     if (!blog?.exists()) {
          setMessage("Blog data not loaded. Cannot submit rating.");
          return;
     }


    try {
      setRatingLoading(true);
      setMessage("");


      const existingRatedBy: string[] = currentRatedBy;
      const existingTotalRating: number = totalRatingSum;



      if (existingRatedBy.includes(user.uid)) {
        setMessage("You have already rated this blog.");
        setRatingLoading(false);
        return;
      }


      const updatedRatedBy = [...existingRatedBy, user.uid];


      const updatedTotalRatingSum = existingTotalRating + ratingValue;


      const updatedData = {
        ratedBy: updatedRatedBy,
        rating: updatedTotalRatingSum
      };

      console.log("Attempting to add rating feedback...");


      await updateDoc(blogReference, updatedData);


      setCurrentRatedBy(updatedRatedBy);
      setTotalRatingSum(updatedTotalRatingSum);


      setMessage("Successfully Added Your Rating!");

    } catch (error: any) {
      setMessage(`An Error occurred: ${error.message}`);
      console.error(error);
    } finally {
      setRatingLoading(false);
    }

  };


  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><h1>Loading Blog Post......</h1></div>;
  }


  if (!blog || !blog.exists()) {
    return <div className="min-h-screen flex justify-center items-center"><h1>Blog Post Not Found</h1></div>;
  }


  const blogData = blog.data();


  const ratingCount = currentRatedBy.length;
  const averageRating = ratingCount > 0 ? (totalRatingSum / ratingCount) : 0;


  return (

    <div className="min-h-screen flex flex-col items-center py-8">

      <BlogPostCard
        id={id}
        title={blogData.title}
        content={blogData.content}
        imageUrl={blogData.imageUrl}
        canEdit={canEdit}
      />


      {ratingCount > 0 && (
        <div className="mt-4 text-lg font-semibold">
          Average Rating: {averageRating.toFixed(1)} / 5 ({ratingCount} ratings)
        </div>
      )}


      {!canEdit && (

        !currentRatedBy.find((userId: string) => userId === user?.uid)
          ? (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center space-y-4">
              <div>Give Your Rating (0-5):</div>
              <Input
                type="number"
                id="blogRating"
                value={blogRating}
                onChange={(e) => setBlogRating(Number(e.target.value))}
                min="0"
                max="5"
                className="w-32 text-center"
              />
              <Button
                type="submit"
                disabled={Number(blogRating) < 0 || Number(blogRating) > 5 || ratingLoading || !user?.uid}
              >
                Submit Rating
              </Button>
            </form>
          )
          : (
            <div className="mt-6 text-center">
              Thanks for your feedback regarding this Blog.
            </div>
          )
      )}


      {message && <div className="mt-4 text-center text-sm text-gray-600">{message}</div>}


    </div>
  )
}


export default Blog;