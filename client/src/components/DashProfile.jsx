import {useSelector} from 'react-redux'
import {Alert, Button, TextInput} from "flowbite-react";
import {useEffect, useRef, useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {app} from "../firebase.js";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const {currentUser} = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const filePickerRef = useRef(null)
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }


  useEffect(() => {
    if (imageFile) {
      uploadImage(imageFile)
    }
  }, [imageFile])
  const uploadImage = async () => {

    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setImageFileUploadProgress(progress.toFixed(0))
    }, () => {
      setImageUploadError('Could not upload image (file) must be less than 2MB')
      setImageFileUploadProgress(null)
      setImageFileUrl(null)
      setImageFileUploadProgress(null)
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        setImageFileUrl(url)
        setImageFileUploadProgress(null)
      })
    })
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
      <form className="flex flex-col gap-4">
        <input className={'hidden'} ref={filePickerRef} type='file' accept='image/*' onChange={handleImageChange}/>

        <div onClick={() => filePickerRef.current.click()}
             className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          {imageFileUploadProgress &&
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                                 styles={{
                                   root: {
                                     width: '100%',
                                     height: '100%',
                                     position: 'absolute',
                                     top: 0,
                                     left: 0,
                                     zIndex: 1000
                                   }, path: {stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`},
                                 }} strokeWidth={5}/>}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user"
               className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
               ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
          />
        </div>
        {imageUploadError && <Alert color={'failure'}>
          {imageUploadError}
        </Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
        <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser.email}/>
        <TextInput type='text' id='password' placeholder='password'/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>

    </div>
  )
}
