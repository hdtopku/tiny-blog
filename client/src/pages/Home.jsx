import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetPosts = async () => {
      try {
        const fetchedPosts = await fetch('/api/post/getposts?limit=9')
        const data = await fetchedPosts.json();
        setPosts(data.posts);
      } catch (error) {
        console.log(error);
      }
    }
    fetPosts()
  }, [])
  return (
    <div>
      <div className={'flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'}>
        <h1 className={'text-3xl font-bold lg:text-6xl'}>Welcome to my Blog!</h1>
        <p className={'text-xs sm:text-sm text-gray-500'}>
          Here you will find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link to={'/search'} className={'text-xs sm:text-sm text-teal-500 font-bold hover:underline'}>
          View all posts
        </Link>
      </div>
      <div className={'p-3 bg-amber-100 dark:bg-slate-700'}>
        <CallToAction/>
      </div>

      <div className={'max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7 text-center'}>
        {
          posts.length &&
          <div className={'flex flex-col gap-6'}>
            <h2 className={'text-xl font-semibold text-center'}>
              Recent Posts
            </h2>
            <div className={'flex flex-wrap gap-4 justify-center'}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
          </div>
        }
        <Link to={'/search'} className={'text-lg text-teal-500 font-bold hover:underline'}
        >
          View all posts
        </Link>
      </div>
    </div>
  )
}
