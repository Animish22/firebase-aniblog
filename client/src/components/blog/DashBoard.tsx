import { db } from "@/firebase/config/firebase"
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import BlogPostCard from "../BlogPostCard";
import { Link } from "react-router-dom";



interface CardInfoType {
  title: string,
  content: string,
  imageUrl: string,
  id: string
}



const DashBoard = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [CardInfo, setCardInfo] = useState<CardInfoType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const fetchBlogs = async () => {
        const blogs = await getDocs(collection(db, "blogs"));
        let AllCardInfo: CardInfoType[] = []
        blogs.forEach(blog => {
          const data = { title: blog.data().title, content: blog.data().content, imageUrl: blog.data().imageUrl, id: blog.id };
          // console.log(data)
          AllCardInfo.push(data);
        })
        setCardInfo(AllCardInfo);
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {CardInfo.map(info =>
        <Link to={`/blog/${info.id}`} key={info.id}>
          <BlogPostCard id={info.id} title={info.title} content={info.content} imageUrl={info.imageUrl} />
        </Link>
      )}
    </div>
  )
}

export default DashBoard