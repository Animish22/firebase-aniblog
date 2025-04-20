import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { StarIcon } from 'lucide-react'; // Assuming you have lucide-react installed (@radix-ui/react-icons is another option)
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Assuming your Shadcn UI components are in "@/components/ui"
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config/firebase';

interface UserBlogInfo {
  title: string,
  content: string,
  imageUrl: string,
  rating:number,
  ratedBy: string[],
  id: string
}

const UserProfilePage: React.FC = () => {
  // Placeholder user data
  const {user}  = useAuth() ; 
  const userName = user?.email;
  const userBio = "Passionate blogger sharing thoughts on various topics.";


    const [loading, setLoading] = useState<boolean>(true);
    const [userBlogInfo, setUserBlogInfo] = useState<UserBlogInfo[]>([]);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      try {
        const fetchBlogs = async () => {
          const blogs = await getDocs(collection(db, "blogs")); 
          let AllUserBlogs: UserBlogInfo[] = []
          
          blogs.forEach(blog => {
            if(blog.data().userID === user?.uid) 
            {
              const data = { title: blog.data().title, content: blog.data().content, imageUrl: blog.data().imageUrl, id: blog.id , rating: blog.data().rating , ratedBy: blog.data().ratedBy };
              AllUserBlogs.push(data);
            }
          })
          setUserBlogInfo(AllUserBlogs);
        }
  
        fetchBlogs();
  
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
  
    }, [])
  
    if (loading) {
      return <h1>Loading......</h1>
    }
    if (error) {
      return <h1>{error.message}</h1>
    }


  // Calculate average rating
  const totalRating = userBlogInfo.reduce((sum, blog) => sum + blog.rating, 0);
  const totalRatingCount = userBlogInfo.reduce((sum, blog) => sum + (blog.ratedBy?.length ?? 0), 0);

  // console.log(totalRating)
  // console.log(totalRatingCount)

  const averageRating = totalRatingCount > 0 ? totalRating / totalRatingCount : 0;
  const roundedAverageRating = Math.round(averageRating);

  // Function to render star icons based on the rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Information Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{userName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{userBio}</p>
          </CardContent>
        </Card>

        {/* My Blogs Section */}
        <Card className="mb-8">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">My Blogs</CardTitle>
            <Link to="/blog/add">
              <Button>Add New Blog</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {userBlogInfo.length > 0 ? (
              <ul className="space-y-3">
                {userBlogInfo.map((blog) => (
                  <li key={blog.id} className="py-2">
                    <Link to={`/blog/${blog.id}`} className="text-blue-500 hover:underline">
                      {blog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No blogs written yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Average Rating Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Average Blog Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {renderStars(roundedAverageRating)}
              <span className="ml-2 text-muted-foreground">({averageRating.toFixed(1)} average)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;