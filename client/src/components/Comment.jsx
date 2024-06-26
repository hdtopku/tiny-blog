import {useEffect, useState} from "react";
import moment from "moment";
import {FaThumbsUp} from "react-icons/fa";
import {useSelector} from "react-redux";
import {Button, Textarea} from 'flowbite-react'


/* eslint-disable react/prop-types */
export default function Comment({comment, onLike, onEdit, onDelete}) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const currentUser = useSelector(state => state.user.currentUser)

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/${comment.userId}`);
      if (response.ok) {
        const res = await response.json();
        setUser(res.data);
      }
    }
    getUser()
  }, [comment])
  const handleSave = async () => {
    try {
      setIsEditing(true)
      const response = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content: editedContent})
      },)
      if (response.ok) {
        await response.json()
        onEdit(comment, editedContent)
        setIsEditing(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  return (user && <div className={'flex gap-4 p-4 border-b dark:border-gray-600 text-sm'}>
    <div className={'flex-shrink-0'}>
      <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full bg-gray-200"/>
    </div>
    <div className={'flex-1'}>
      <div className={'flex items-center gap-2 mb-1'}>
        <span className={'font-bold text-xs truncate'}>{user ? `@${user.username}` : `anonymous user`}</span>
        <span className={'text-gray-500 text-xs truncate'}>{moment(comment.createdAt).fromNow()}</span>
      </div>
      {isEditing ? <>
        <Textarea className={'w-full p-2 border rounded-md'} defaultValue={comment.content}
                  onChange={(e) => setEditedContent(e.target.value)}/>
        <div className={'flex justify-end gap-2 mt-2'}>
          <Button onClick={() => setIsEditing(false)} gradientDuoTone={'purpleToBlue'} outline color={'danger'}
                  size={'sm'}>
            Cancel
          </Button>
          <Button gradientDuoTone={'purpleToBlue'} size={'sm'} onClick={handleSave}>
            Save
          </Button>
        </div>
      </> : <>
        <p className={'text-gray-500 pb-2'}>{comment.content}</p>
        <div className={'flex items-center gap-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'}>
          <button onClick={() => onLike(comment._id)} type={'button'}
                  className={`text-gray-400 hover:text-blue-500 ${comment?.likes?.includes(currentUser?._id) && '!text-blue-500'}`}>
            <FaThumbsUp className={'test-sm'}/>
          </button>
          <p className={'text-gray-400'}>
            {comment.numberOfLikes && comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
          </p>
          {currentUser && (currentUser?._id === comment.userId || currentUser?.role === 'admin') && (
            <div className={'flex gap-2'}>
              <button type={'button'} className={'text-gray-400 hover:text-blue-500'}
                      onClick={handleEdit}>
                Edit
              </button>
              <button type={'button'} className={'text-gray-400 hover:text-red-500'}
                      onClick={() => onDelete(comment._id)}>
                Delete
              </button>
            </div>)}
        </div>
      </>}

    </div>
  </div>)
}
