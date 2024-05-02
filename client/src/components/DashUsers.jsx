import {Button, Modal, Table} from 'flowbite-react'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {FaCheck, FaTimes} from "react-icons/fa";

export default function DashUsers() {
  const {currentUser} = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/getusers`);
        const res = await response.json();
        if (response.ok) {
          setUsers(res.data.users);
          if (res.data.users.length < 9) {
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
      fetchUsers()
    }
  }, [currentUser._id, currentUser.isAdmin])
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/user/deleteuser/${userIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        setUsers(users.filter((post) => post._id !== userIdToDelete));
        setShowModal(false);
        setUserIdToDelete(null);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleShowMore = async () => {
    const startIndex = users.length || 0;
    try {
      const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setUsers([...users, ...data.data.users]);
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
    {currentUser.isAdmin && users?.length > 0 ? (<div>
      <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>Date updated</Table.HeadCell>
          <Table.HeadCell>User image</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Admin</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body className={'divide-y'}>
          {users.map((user) => (<Table.Row className={'bg-white dark:bg-gray-700 dark:bg-gray-800'} key={user._id}>
              <Table.Cell>{new Date(user.createdAt).toLocaleString()}</Table.Cell>
              <Table.Cell>
                <img src={user.profilePicture} alt={user.profilePicture}
                     className={'w-10 h-10 object-cover bg-gray-500 rounded-full'}/>
              </Table.Cell>
              <Table.Cell>
                <Link className="text-gray-500 hover:text-gray-900" to={`/user/${user._id}`}>
                  {user.username}
                </Link>
              </Table.Cell>
              <Table.Cell>
                {user.email}
              </Table.Cell>
              <Table.Cell>
                {user.isAdmin ? <FaCheck className={'text-green-500'}/> : <FaTimes className={'text-red-500'}/>}
              </Table.Cell>
              <Table.Cell>
                      <span onClick={() => {
                        setUserIdToDelete(user._id)
                        setShowModal(true)
                      }}
                            className={'font-medium text-red-500 hover:underline cursor-pointer'}>Delete</span>
              </Table.Cell>
            </Table.Row>

          ))}
        </Table.Body>
      </Table>
      {showMore && <button onClick={handleShowMore} className={'w-full text-teal-500 text-sm py-7'}>Show more</button>}
    </div>) : (<p>You have no users yet.</p>)}
    <Modal show={showModal} onClose={() => setShowModal(false)} popup
           size='md'>
      <Modal.Header/>
      <Modal.Body>
        <div className={'text-center'}>
          <HiOutlineExclamationCircle className={'h-14 w-14 text-red-400 dark:text-gray-200 mb-4 mx-auto'}/>
          <h3 className={'mb-5 text-lg font-semibold text-gray-500 dark:text-gray-400'}>Are you sure you want to delete
            this user?</h3>
          <div className='flex justify-center gap-4'>
            <Button color={'failure'} onClick={handleDeleteUser}>
              Yes, I am sure
            </Button>
            <Button color={'gray'} onClick={() => setShowModal(false)}><span>No, cancel</span></Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>)
}
