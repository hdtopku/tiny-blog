import {Button} from 'flowbite-react'

export default function CallToAction() {
  return (
    <div
      className={'grid grid-cols-1 gap-4 sm:grid-cols-2 p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'}>
      <div className={'flex flex-col gap-2'}>
        <h2 className={'text-2xl'}>Want to learn more about JavaScript?</h2>
        <p className={'text-gray-500'}>Checkout these resources to learn more about JavaScript projects</p>
        <Button gradientDuoTone={'purpleToPink'} className={'rounded-tl-xl rounded-bl-none'}>
          <a href={'https://www.javascript.com/'} target={'_blank'} rel={'noopener noreferrer'}>Learn More</a>
        </Button>
      </div>
      <div className={'p-7'}>
        <img alt={'JavaScript'}
             src={'https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto'}/>
      </div>
    </div>
  )
}
