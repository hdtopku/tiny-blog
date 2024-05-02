import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Spinner} from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection.jsx";

export default function PostPage() {
  const {postSlug} = useParams();
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [post, setPost] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        if (!response.ok) {
          setError(true)
          setLoading(false)
          return
        }
        const data = await response.json();
        setPost(data.posts[0]);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchPost()
  }, [postSlug])
  if (loading) {
    return <div className={'flex justify-center items-center min-h-screen'}>
      <Spinner size="xl"/>
    </div>
  }
  return <div className={'p-3 flex flex-col max-w-6xl mx-auto min-h-screen'}>
    <h1 className={'text-3xl font-bold mt-10 p-3 text-center max-w-2xl mx-auto lg:text-4xl'}>{post && post.title}</h1>
    <Link to={`/search?category=${post && post.category}`} className={'self-center mt-5'}>
      <Button color={'gray'} pill size={'xs'}>{post && post.category}</Button>
    </Link>
    <img src={post && post.image} alt={post && post.title} className={'mt-10 p-3 max-h-[600px] object-cover w-full'}/>
    <div className={'flex justify-between border-b p-3 border-slate-300'}>
      <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
      <span> {post && Math.ceil(post.content.split(' ').length / 200)} mins read </span>
    </div>
    <div dangerouslySetInnerHTML={{__html: post && post.content}}
         className={'max-w-2xl p-3 mx-auto w-full post-content'}>
    </div>
    <div className={'max-w-4xl mx-auto w-full'}>
      <CallToAction/>
    </div>
    <CommentSection postId={post._id}/>
  </div>
}
