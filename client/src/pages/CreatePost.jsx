import {Alert, Button, FileInput, Select, TextInput} from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {useState} from "react";
import {CircularProgressbar} from "react-circular-progressbar";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({})
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image to upload');
        return
      }
      setImageUploadError(null);
      const storage = getStorage();
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setImageUploadProgress(progress);
      }, (error) => {
        setImageUploadError('Image upload failed. ' + error.message);
        setImageUploadProgress(null);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageUploadError(null);
          setImageUploadProgress(null);
          setFormData({...formData, image: url});
        })
      })
    } catch (error) {
      setImageUploadError('Image upload failed. ' + error.message)
      setImageUploadProgress(null);
    }
  }
  return (
    <div className={'p-3 max-w-3xl mx-auto min-h-screen'}>
      <h1 className={'text-center text-3xl my-7 font-semibold'}>CreatePost</h1>
      <form className={'flex flex-col gap-4'}>
        <div className={'flex flex-col gap-4 sm:flex-row justify-between'}>
          <TextInput type={'text'} placeholder={'Title'} required={true} id={'title'} className={'flex-1'}/>
          <Select>
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className={'flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'}>
          <FileInput onChange={(e) => setFile(e.target.files[0])} type={'file'} accept={'image/*'}/>
          <Button disabled={imageUploadProgress} onClick={handleUploadImage} type={'button'}
                  gradientDuoTone={'purpleToBlue'} size={'sm'} outline>
            {imageUploadProgress ? <div className={'w-16 h-16'}><CircularProgressbar value={imageUploadProgress}
                                                                                     text={`${imageUploadProgress || 0}%`}/>
            </div> : 'Upload Image'}
          </Button>
        </div>
        {imageUploadError && <Alert className={'text-red-500 text-sm'} color={'failure'}>{imageUploadError}</Alert>}
        {formData.image && <img src={formData.image} alt={'Uploaded Image'} className={'w-full h-48 object-cover'}/>}
        <ReactQuill required theme={'snow'} placeholder={'Write your post here...'} className={'h-72 mb-12'}/>
        <Button type={'submit'} gradientDuoTone={'purpleToPink'}>Publish</Button>
      </form>
    </div>
  )
}
