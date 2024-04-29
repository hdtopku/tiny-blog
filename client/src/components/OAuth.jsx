import {AiFillGoogleCircle} from "react-icons/ai";
import {Button} from 'flowbite-react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {signInSuccess} from "../redux/user/userSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {app} from "../firebase.js";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({prompt: "select_account"});
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          googlePhotoUrl: result.user.photoURL
        }),
      })
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data.data));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Button onClick={handleGoogleClick} type='button' gradientDuoTone='pinkToOrange' outline>
      <AiFillGoogleCircle className='w-6 h-6'/>
      Continue with Google
    </Button>
  )
}
