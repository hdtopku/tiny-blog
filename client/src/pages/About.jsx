import {Link} from "react-router-dom";

export default function About() {
  return (
    <div className={'min-h-screen flex items-center justify-center'}>
      <div className="max-w-2xl mx-auto p-3">
        <div>
          <h1 className={'text-3xl font font-semibold text-center py-7'}>About Tiny Blog</h1>
          <div className={'text-md text-gray-500 flex flex-col gap-4 text-center'}>
            <p>
              This is a simple blog application built using React and Node.js. It
              allows users to create, edit, and delete blog posts. The blog posts
              are stored in a MongoDB database.
            </p>
            <p>

              The application is built using the following technologies: React,
              Node.js, Express, MongoDB, and Bootstrap.
            </p>
            <p>

              The source code for this application is available on GitHub at{" "}
              <Link target="_blank" className={'text-teal-500 hover:underline'}
                    to="https://github.com/hdtopku/tiny-blog">
                https://github.com/hdtopku/tiny-blog
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
