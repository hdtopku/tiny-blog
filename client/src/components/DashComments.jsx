import {Button, Modal, Table} from 'flowbite-react'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {HiOutlineExclamationCircle} from "react-icons/hi";

export default function DashComments() {
  const {currentUser} = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getcomments`);
        const res = await response.json();
        console.log(res);
        if (response.ok) {
          setComments(res.comments);
          if (res.comments.length < 9) {
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
      fetchComments()
    }
  }, [currentUser._id, currentUser.isAdmin])
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        setComments(comments.filter((post) => post._id !== commentIdToDelete));
        setShowModal(false);
        setCommentIdToDelete(null);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleShowMore = async () => {
    const startIndex = comments.length || 0;
    try {
      const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await response.json();
      if (response.ok) {
        setComments([...comments, ...data.data.users]);
        if (data.data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (<div
    className={'table-auto  md:mx-auto p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300' + ' dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'}>
    {currentUser.isAdmin && comments?.length > 0 ? (<div>
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Date updated</Table.HeadCell>
          <Table.HeadCell>Comment content</Table.HeadCell>
          <Table.HeadCell>Number of likes</Table.HeadCell>
          <Table.HeadCell>PostId</Table.HeadCell>
          <Table.HeadCell>UserId</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body className={'divide-y'}>
          {comments.map((comment) => (
            <Table.Row className={'bg-white dark:bg-gray-700 dark:bg-gray-800'} key={comment._id}>
              <Table.Cell>{new Date(comment.updatedAt).toLocaleString()}</Table.Cell>
              <Table.Cell>
                {comment.content}
              </Table.Cell>
              <Table.Cell>
                {comment.numberOfLikes}
              </Table.Cell>
              <Table.Cell>
                {comment.postId}
              </Table.Cell>
              <Table.Cell>
                {comment.userId}
              </Table.Cell>
              <Table.Cell>
                      <span onClick={() => {
                        setCommentIdToDelete(comment._id)
                        setShowModal(true)
                      }}
                            className={'font-medium text-red-500 hover:underline cursor-pointer'}>Delete</span>
              </Table.Cell>
            </Table.Row>

          ))}
        </Table.Body>
      </Table>
      {showMore && <button onClick={handleShowMore} className={'w-full text-teal-500 text-sm py-7'}>Show more</button>}
    </div>) : (<p>You have no comments yet.</p>)}
    <Modal show={showModal} onClose={() => setShowModal(false)} popup
           size='md'>
      <Modal.Header/>
      <Modal.Body>
        <div className={'text-center'}>
          <HiOutlineExclamationCircle className={'h-14 w-14 text-red-400 dark:text-gray-200 mb-4 mx-auto'}/>
          <h3 className={'mb-5 text-lg font-semibold text-gray-500 dark:text-gray-400'}>Are you sure you want to delete
            this user?</h3>
          <div className='flex justify-center gap-4'>
            <Button color={'failure'} onClick={handleDeleteComment}>
              Yes, I am sure
            </Button>
            <Button color={'gray'} onClick={() => setShowModal(false)}><span>No, cancel</span></Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>)
}
