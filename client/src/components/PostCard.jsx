/* eslint-disable react/prop-types */
import {Link} from "react-router-dom";

export default function PostCard({post}) {
  return (<div
    className={'group relative w-full border h-[400px] sm:w-[430px] overflow-hidden rounded-md bg-white shadow-md hover:shadow-lg border border-teal-500 hover:border-2 transition-all duration-300 ease-in-out'}>
    <Link to={`/post/${post.slug}`}>
      <img
        className={'h-[260px] w-full object-cover group-hover:opacity-75 group-hover:scale-105 group-hover:h-[200px]  transition-all duration-300 ease-in-out'}
        src={post.image} alt={post.title}/>
      <div className={'p-3 flex flex-col gap-2'}>
        <h2 className={'text-lg font-semibold'}>{post.title}</h2>
        <p className={'text-sm italic text-gray-500'}>{post.category}</p>
        <div
          className={'!rounded-tl-none font-bold text-teal-500 absolute group-hover:bottom-0 bottom-[-200px] left-0 right-0 ' +
            ' border border-teal-500 bg-white hover:bg-teal-500 hover:text-white rounded-md py-2 px-4 text-center transition-all duration-300 ease-in-out m-2'}>
          Read article
        </div>
      </div>
    </Link>
  </div>)
}
