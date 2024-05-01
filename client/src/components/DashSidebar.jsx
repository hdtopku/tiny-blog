import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from "react-icons/hi";
import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {signOutFailure, signOutSuccess} from "../redux/user/userSlice.js";
import {useDispatch} from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl)
  }, [location.search])
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'post'
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(signOutFailure(data.message))
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item onClick={handleSignOut} active icon={HiArrowSmRight} className={'cursor-pointer'}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
