import {Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react'
import {Link, useLocation} from "react-router-dom";
import {FaMoon, FaSun} from "react-icons/fa";
import {AiOutlineSearch} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {toggleTheme} from "../redux/theme/themeSlice.js"

export default function Header() {
  const path = useLocation().pathname;
  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme);
  const dispatch = useDispatch()
  return (<Navbar className="border-b-2">
    <Link to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span
          className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 to-pink-500 rounded-lg text-white">TINY</span>Blog
    </Link>
    <form>
      <TextInput className='hidden lg:inline' type='text' placeholder='Search' rightIcon={AiOutlineSearch}/>
    </form>
    <Button className='w-12 h-10 lg:hidden' color='gray' pill>
      <AiOutlineSearch className='w-4 h-4 '/>
    </Button>
    <div className='flex gap-2 md:order-2'>
      <Button onClick={() => dispatch(toggleTheme())} className='w-12 h-10 hidden sm:inline' color='gray' pill>
        {theme === 'light' ? <FaMoon/> : <FaSun/>}
      </Button>
      {currentUser ? (
        <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded/>}>
          <Dropdown.Header>
            <span className='text-sm block'>@{currentUser.username}</span>
            <span className='text-sm block font-medium truncate'>@{currentUser.email}</span>
          </Dropdown.Header>
          <Link to="/dashboard?tab=profile">
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider/>
          <Link to="/sign-out">
            <Dropdown.Item>Sign Out</Dropdown.Item>
          </Link>
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
