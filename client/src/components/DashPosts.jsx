import {Table} from 'flowbite-react'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

export default function DashPosts() {
  const {currentUser} = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await response.json();
        if (response.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id, currentUser.isAdmin])

  return (
    <div
      className={'table-auto  md:mx-auto p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300' +
        ' dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'}>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className={'divide-y'}>
              {
                userPosts.map((post) => (
                  <Table.Row className={'bg-white dark:bg-gray-700 dark:bg-gray-800'} key={post._id}>
                    <Table.Cell>{new Date(post.updatedAt).toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} className={'w-20 h-10 object-cover bg-gray-500'}/>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className={'font-medium text-gray-900 dark:text-white'} to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {post.category}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={'font-medium text-red-500 hover:underline cursor-pointer'}>Delete</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className="text-teal-500" to={`/update-post/${post._id}`}>
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>

                ))
              }
            </Table.Body>
          </Table>
        </div>
      ) : (<p>You have no posts yet.</p>)}
    </div>
  )
}
