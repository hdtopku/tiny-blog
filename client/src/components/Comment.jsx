import {useEffect, useState} from "react";
import moment from "moment";


/* eslint-disable react/prop-types */
export default function Comment({comment}) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/${comment.userId}`);
      if (response.ok) {
        const res = await response.json();
        console.log(res.data);
        setUser(res.data);
      }
    }
    getUser()
  }, [comment])
  return (
    user && <div className={'flex gap-4 p-4 border-b dark:border-gray-600 text-sm'}>
      <div className={'flex-shrink-0'}>
        <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full bg-gray-200"/>
      </div>
      <div className={'flex-1'}>
        <div className={'flex items-center gap-2 mb-1'}>
          <span className={'font-bold text-xs truncate'}>{user ? `@${user.username}` : `anonymous user`}</span>
          <span className={'text-gray-500 text-xs truncate'}>{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className={'text-gray-500 pb-2'}>{comment.content}</p>
      </div>
    </div>
  )
}
