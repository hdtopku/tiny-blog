import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup} from "react-icons/hi";
import {Button, Table} from 'flowbite-react'
import {Link} from "react-router-dom";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const {currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5")
        const {data} = await res.json()
        if (res.ok) {
          setUsers(data.users)
          console.log(data);
          setTotalUsers(data.totalUsers)
          setLastMonthUsers(data.lastMonthUsers)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5")
        const data = await res.json()
        if (res.ok) {
          setComments(data.comments)
          setTotalComments(data.totalComments)
          setLastMonthComments(data.lastMonthComments)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5")
        const data = await res.json()
        if (res.ok) {
          setPosts(data.posts)
          setTotalPosts(data.totalPosts)
          setLastMonthPosts(data.lastMonthPosts)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (currentUser.isAdmin) {
      fetchUsers()
      fetchComments()
      fetchPosts()
    }
  }, [currentUser])
  return (<div className={'p-3 md:mx-auto'}>
    <div className={'flex flex-wrap justify-center gap-4'}>
      <div className={'flex flex-col p-3 dark:bg-gray-800 gap-4 md:w-72 w-full rounded-lg shadow-lg'}>
        <div className={'flex items-center justify-between'}>
          <div className={'flex flex-col items-center justify-between'}>
            <h3 className={'text-gray-500 text-md uppercase'}>Total Users:</h3>
            <p className={'text-2xl'}>{totalUsers}</p>
          </div>
          <HiOutlineUserGroup className={'bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'}/>
        </div>
        <div className={'flex gap-2 text-sm'}>
          <span className={'text-green-500 flex items-center'}>
            <HiArrowNarrowUp/>
            {lastMonthUsers}
            </span>
          <div className={'text-gray-500'}>Last Month</div>
        </div>
      </div>
      <div className={'flex flex-col p-3 dark:bg-gray-800 gap-4 md:w-72 w-full rounded-lg shadow-lg'}>
        <div className={'flex items-center justify-between'}>
          <div className={'flex flex-col items-center justify-between'}>
            <h3 className={'text-gray-500 text-md uppercase'}>Total Users:</h3>
            <p className={'text-2xl'}>{totalComments}</p>
          </div>
          <HiAnnotation className={'bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'}/>
        </div>
        <div className={'flex gap-2 text-sm'}>
          <span className={'text-green-500 flex items-center'}>
            <HiArrowNarrowUp/>
            {lastMonthComments}
            </span>
          <div className={'text-gray-500'}>Last Month</div>
        </div>
      </div>
      <div className={'flex flex-col p-3 dark:bg-gray-800 gap-4 md:w-72 w-full rounded-lg shadow-lg'}>
        <div className={'flex items-center justify-between'}>
          <div className={'flex flex-col items-center justify-between'}>
            <h3 className={'text-gray-500 text-md uppercase'}>Total Posts:</h3>
            <p className={'text-2xl'}>{totalPosts}</p>
          </div>
          <HiDocumentText className={'bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg'}/>
        </div>
        <div className={'flex gap-2 text-sm'}>
          <span className={'text-green-500 flex items-center'}>
            <HiArrowNarrowUp/>
            {lastMonthPosts}
            </span>
          <div className={'text-gray-500'}>Last Month</div>
        </div>
      </div>
    </div>

    <div className={'flex flex-wrap justify-center gap-4 py-3 mx-auto'}>
      <div className={'flex flex-col w-full md:w-auto shadow-md p2 rounder-lg dark:bg-gray-800'}>
        <div className={'flex justify-between p-3 text-sm font-semibold'}>
          <h1>Recent Users</h1>
          <Button outline gradientDuoTone={'purpleToPink'}>
            <Link to={'/dashboard?tab=users'} as={'div'}>See all</Link>
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>User image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {users.map((user, index) => (
              <Table.Row key={index} className={'bg-white dark:bg-gray-700'}>
                <Table.Cell>
                  <img src={user?.profilePicture} alt={user?.username} className={'w-10 h-10 rounded-full'}/>
                </Table.Cell>
                <Table.Cell>{user?.username}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className={'flex w-full md:w-auto flex-wrap gap-4 py-3 mx-auto justify-center'}>
        <div className={'flex flex-col w-full shadow-md p-2 rounder-lg dark:bg-gray-800'}>
          <div className={'flex justify-between p-3 text-sm font-semibold'}>
            <h1>Recent Comments</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={'/dashboard?tab=comments'} as={'div'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {comments.map((comment, index) => (
                <Table.Row key={index} className={'bg-white dark:bg-gray-700'}>
                  <Table.Cell className={'w-96'}>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell>{comment?.numberOfLikes}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <div className={'flex w-full md:w-auto flex-wrap gap-4 py-3 mx-auto justify-center'}>
        <div className={'flex flex-col w-full md:w-auto shadow-md p2 rounder-lg dark:bg-gray-800'}>
          <div className={'flex justify-between p-3 text-sm font-semibold'}>
            <h1>Recent Posts</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={'/dashboard?tab=posts'} as={'div'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {posts.map((post, index) => (
                <Table.Row key={index} className={'bg-white dark:bg-gray-700'}>
                  <Table.Cell>
                    <img src={post?.image} alt={post?.title} className={'w-14 h-10 rounded-md'}/>
                  </Table.Cell>
                  <Table.Cell className={'w-96'}>{post?.title}</Table.Cell>
                  <Table.Cell class={'w-5'}>{post?.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  </div>)
}
