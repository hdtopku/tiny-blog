import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Modal, Textarea} from "flowbite-react";
import {useEffect, useState} from "react";
import Comment from "./Comment.jsx";


// eslint-disable-next-line react/prop-types
export default function CommentSection({postId}) {
  const {currentUser} = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState(null)
  const [comments, setComments] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null)
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (comment.length > 200 || comment.trim().length < 1) {
      return
    }
    try {
      const res = await fetch(`/api/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id
        })
      })
      if (res.ok) {
        setComment('')
        setCommentError(null)
        setComments([res.json(), ...comments])
      }
    } catch (err) {
      setCommentError('Something went wrong. Please try again later.' + err.message)
    }
  }
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in')
        return
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      })
      if (res.ok) {
        const data = await res.json()
        setComments(comments.map(c => c._id === commentId ? data : c))
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleEdit = (comment, editedComment) => {
    setComments(comments.map(c => c._id === comment._id ? {...c, content: editedComment} : c))
  }
  const handleDelete = async () => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentToDelete}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentToDelete))
        setShowModal(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`)
        if (res.ok) {
          const data = await res.json()
          setComments(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getComments()
  }, [postId])
  return (
    <div className={'max-w-2xl mx-auto w-full p-3'}>
      {currentUser ? (
        <div className={'flex items-center gap-1 my-5 text-gray-500 text-sm'}>
          <p>Signed in as: </p>
          <img className={'h-5 w-5 object-cover rounded-full'} src={currentUser.profilePicture} alt={''}/>
          <Link to={`/dashboard?tab=profile`}
                className={'text-cyan-500 text-xs hover:underline'}>@{currentUser.username}</Link>
        </div>
      ) : (
        <div className={'text-sm text-teal-500 my-5 flex gap-1'}>You must be signed in to comment. <Link
          className={'text-blue-500 hover:underline'} to={`/sign-in`}>Sign in</Link> or <Link
          to={`/register`}>register</Link> to comment.</div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className={'border border-teal-500 rounded-md p-3'}>
          <Textarea onChange={(e) => setComment(e.target.value)} value={comment} rows={3} maxLength={200}
                    placeholder={'Leave a comment...'} className={'w-full'}/>
          <div className={'flex justify-between items-center mt-5'}>
            <p className={'text-gray-500 text-sm'}>{200 - comment.length} characters remaining</p>
            <Button outline gradientDuoTone={'purpleToBlue'} type={'submit'}>Submit</Button>
          </div>
          {commentError && <Alert color={'failure'}>
            {commentError}
          </Alert>}
        </form>
      )}
      {comments.length === 0 ? <p className={'text-gray-500 text-sm my-5'}>No comments yet.</p> :
        <>
          <div className={'text-sm my-5 flex gap-1 items-center'}>
            <p>Comments:</p>
            <div className={'border border-gray-400 rounded-md px-2 py-1 text-xs text-gray-500'}>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map(comment => (
            <Comment onDelete={(commentId) => {
              setShowModal(true)
              setCommentToDelete(commentId);
            }} onEdit={handleEdit} onLike={handleLike} key={comment._id}
                     comment={comment}/>
          ))}
        </>}
      <Modal show={showModal} onClose={() => setShowModal(false)} size={'md'}>
        <Modal.Header>Are you sure you want to delete this comment?</Modal.Header>
        <Modal.Body>
          <div className={'flex flex-col items-center'}>
            <div className={'flex gap-2'}>
              <Button outline={true} color={'gray'} onClick={() => setShowModal(false)}>No, Cancel</Button>
              <Button color={'failure'} onClick={() => handleDelete()}>Yes, delete</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
