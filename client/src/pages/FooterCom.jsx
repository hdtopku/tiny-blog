import React from 'react'
import {Footer} from 'flowbite-react'
import {Link} from "react-router-dom";
import {BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter} from "react-icons/bs";

export default function FooterCom() {
  return (<Footer container className="border border-t-8 border-teal-500">
    <div className='w-full max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 sm:grid-cols-2'>
        <div className="mt-4">
          <Link to="/"
                className="font-bold dark:text-white text-2xl">
        <span
          className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 to-pink-500 rounded-lg text-white">TINY</span>Blog
          </Link>
        </div>
        <div className='grid grid-cols-2 mt-4 sm:grid-cols-3 gap-8 sm:gap-6'>
          <div>
            <Footer.Title title="ABOUT"></Footer.Title>
            <Footer.LinkGroup col>
              <Footer.Link href="/about" target="_blank" rel="noopener noreferrer">react+nodejs</Footer.Link>
              <Footer.Link href="#" rel="noopener noreferrer">TINY Blog</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Follow Us"></Footer.Title>
            <Footer.LinkGroup col>
              <Footer.Link href="https://github.com" target="_blank" rel="noopener noreferrer">github</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="LEGAL"></Footer.Title>
            <Footer.LinkGroup col>
              <Footer.Link>Privacy Policy</Footer.Link>
              <Footer.Link href="#">Terms & Conditions</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>
      <Footer.Divider/>
      <div className='mt-4 w-full flex justify-between items-center'>
        <Footer.Copyright href="#" by="TINY Blog" year={new Date().getFullYear()}/>
        <div className='flex gap-4 justify-center'>
          <Footer.Icon href="#" icon={BsFacebook}/>
          <Footer.Icon href="#" icon={BsInstagram}/>
          <Footer.Icon href="#" icon={BsTwitter}/>
          <Footer.Icon href="#" icon={BsGithub}/>
          <Footer.Icon href="#" icon={BsDribbble}/>
        </div>
      </div>
    </div>
  </Footer>)
}
