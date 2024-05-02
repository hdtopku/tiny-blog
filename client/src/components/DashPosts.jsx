import {Button, Modal, Table} from 'flowbite-react'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {HiOutlineExclamationCircle} from "react-icons/hi";

export default function DashPosts() {
  const {currentUser} = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await response.json();
        if (response.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          } else {
            setShowMore(true)
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id, currentUser.isAdmin])
  const handleDeletePost = async () => {
    try {
      const response = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        setUserPosts(userPosts.filter((post) => post._id !== postIdToDelete));
        setShowModal(false);
        setPostIdToDelete(null);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await response.json();
      if (response.ok) {
        setUserPosts([...userPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (<div
    className={'table-auto  md:mx-auto p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300' + ' dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'}>
    {currentUser.isAdmin && userPosts.length > 0 ? (<div>
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
          {userPosts.map((post) => (<Table.Row className={'bg-white dark:bg-gray-700 dark:bg-gray-800'} key={post._id}>
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
                      <span onClick={() => {
                        setPostIdToDelete(post._id)
                        setShowModal(true)
                      }}
                            className={'font-medium text-red-500 hover:underline cursor-pointer'}>Delete</span>
              </Table.Cell>
              <Table.Cell>
                <Link className="text-teal-500" to={`/update-post/${post._id}`}>
                  <span>Edit</span>
                </Link>
              </Table.Cell>
            </Table.Row>

          ))}
        </Table.Body>
      </Table>
      {showMore && <button onClick={handleShowMore} className={'w-full text-teal-500 text-sm py-7'}>Show more</button>}
    </div>) : (<p>You have no posts yet.</p>)}
    <Modal show={showModal} onClose={() => setShowModal(false)} popup
           size='md'>
      <Modal.Header/>
      <Modal.Body>
        <div className={'text-center'}>
          <HiOutlineExclamationCircle className={'h-14 w-14 text-red-400 dark:text-gray-200 mb-4 mx-auto'}/>
          <h3 className={'mb-5 text-lg font-semibold text-gray-500 dark:text-gray-400'}>Are you sure you want to delete
            this post?</h3>
          <div className='flex justify-center gap-4'>
            <Button color={'failure'} onClick={handleDeletePost}>
              Yes, I am sure
            </Button>
            <Button color={'gray'} onClick={() => setShowModal(false)}><span>No, cancel</span></Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>)
}
