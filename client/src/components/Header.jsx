import {Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react'
import {Link, useLocation, useNavigate} from "react-router-dom";
import {FaMoon, FaSun} from "react-icons/fa";
import {AiOutlineSearch} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {toggleTheme} from "../redux/theme/themeSlice.js"
import {signOutSuccess} from "../redux/user/userSlice.js";
import {useEffect, useState} from "react";

export default function Header() {
  const path = useLocation().pathname;
  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme);
  const dispatch = useDispatch()
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    setSearchTerm(searchTermFromUrl);
  }, [location.search])
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const newUrl = `/search?${urlParams.toString()}`;
    navigate(newUrl)
  }
  return (<Navbar className="border-b-2">
    <Link to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span
          className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 to-pink-500 rounded-lg text-white">TINY</span>Blog
    </Link>
    <form onSubmit={handleSubmit}>
      <TextInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='hidden lg:inline'
                 type='text' placeholder='Search' rightIcon={AiOutlineSearch}/>
    </form>
    <Button className='w-12 h-10 lg:hidden' color='gray' pill>
      <AiOutlineSearch className='w-4 h-4 '/>
    </Button>
    <div className='flex gap-2 md:order-2'>
      <Button onClick={() => dispatch(toggleTheme())} className='w-12 h-10 hidden sm:inline' color='gray' pill>
        {theme === 'light' ? <FaMoon/> : <FaSun/>}
      </Button>
      {currentUser ? (
        <Dropdown arrowIcon={false} inline label={<Avatar img={() => (
          <img className={'rounded-full w-8 h-8'} alt='user' referrerPolicy={'no-referrer'}
               src={currentUser.profilePicture}/>)}/>}>
          <Dropdown.Header>
            <span className='text-sm block'>@{currentUser.username}</span>
            <span className='text-sm block font-medium truncate'>@{currentUser.email}</span>
          </Dropdown.Header>
          <Link to="/dashboard?tab=profile">
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider/>
          <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
        </Dropdown>
      ) : (
        <Link to="/sign-in">
          <Button gradientDuoTone='purpleToBlue'>
            Sign In
          </Button>
        </Link>
      )}
      <Navbar.Toggle/>
    </div>
    <Navbar.Collapse>
      <Navbar.Link active={path === '/'} as='div'>
        <Link to="/">Home</Link>
      </Navbar.Link>
      <Navbar.Link active={path === '/about'} as='div'>
        <Link to="/about">About</Link>
      </Navbar.Link>
      <Navbar.Link active={path === '/projects'} as='div'>
        <Link to="/projects">Projects</Link>
      </Navbar.Link>
    </Navbar.Collapse>
  </Navbar>)
}
