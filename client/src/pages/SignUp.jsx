import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Label, Spinner, TextInput} from "flowbite-react";
import {useState} from "react";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] =useState('')
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    // formData = {...formData, [e.target.id]: e.target.value}
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.username?.trim() || !formData.password?.trim() || !formData.email?.trim()) {
      return setErrorMessage("Please fill all fields")
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(!data.success) {
        return setErrorMessage(data.message)
      }
      if(res.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally  {
      setLoading(false)
    }
  }
  return (<div className='flex min-h-screen -mt-20 items-center'>
    <div className='grid grid-cols-1 md:grid-cols-2 p-3 max-w-3xl mx-auto items-center'>
      {/*left*/}
      <div>
        <Link to="/"
              className="font-bold dark:text-white text-4xl">
        <span
          className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 to-pink-500 rounded-lg text-white">TINY</span>Blog
        </Link>

        <p className='text-sm mt-5'>This is a demo project. You can sign up with your email and password or with Google
          to
          access the blog.</p>
      </div>
      {/*right*/}
      <div>
        <form method='POST' onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <Label value="Your username"/>
            <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
          </div>
          <div>
            <Label value="Your email"/>
            <TextInput type='text' placeholder='name@company.com' id='email' onChange={handleChange}/>
          </div>
          <div>
            <Label value="Your password"/>
            <TextInput type='text' placeholder='Password' id='password' onChange={handleChange}/>
          </div>
          <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
            {loading ? <span><Spinner size="sm"/>Loading...</span> : 'Sign up'}
          </Button>
          <OAuth/>
        </form>
        <div className='flex gap-2 text-sm mt-5'>Have an account? <Link to="/sign-in" className="text-blue-500">Log
          in</Link></div>
        {errorMessage && <Alert className='mt-5' color="failure">{errorMessage}</Alert>}
      </div>

    </div>
  </div>)
}
