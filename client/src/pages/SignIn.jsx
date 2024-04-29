import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Label, Spinner, TextInput} from "flowbite-react";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {signInFailure, signInStart, signInSuccess} from "../redux/user/userSlice.js";

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error: errorMessage} = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    // formData = {...formData, [e.target.id]: e.target.value}
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.password?.trim() || !formData.email?.trim()) {
      return dispatch(signInFailure("Please fill all fields"))
    }
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(!data.success) {
        dispatch(signInFailure(data.message))
      }
      if(res.ok) {
        dispatch(signInSuccess(data.data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
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

        <p className='text-sm mt-5'>This is a demo project. You can sign in with your email and password or with Google
          to
          access the blog.</p>
      </div>
      {/*right*/}
      <div>
        <form method='POST' onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <Label value="Your email"/>
            <TextInput type='text' placeholder='name@company.com' id='email' onChange={handleChange}/>
          </div>
          <div>
            <Label value="Your password"/>
            <TextInput type='password' placeholder='your password' id='password' onChange={handleChange}/>
          </div>
          <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
            {loading ? <span><Spinner size="sm"/>Loading...</span> : 'Sign in'}
          </Button>
        </form>
        <div className='flex gap-2 text-sm mt-5'>Do not have an account? <Link to="/sign-up" className="text-blue-500">Sign
          up</Link></div>
        {errorMessage && <Alert className='mt-5' color="failure">{errorMessage}</Alert>}
      </div>

    </div>
  </div>)
}
