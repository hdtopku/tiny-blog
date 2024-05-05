import {Button, TextInput} from "flowbite-react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import PostCard from "../components/PostCard.jsx";


export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const sortFromUrl = urlParams.get('sort')
    const categoryFromUrl = urlParams.get('category')
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({...sidebarData, searchTerm: searchTermFromUrl, sort: sortFromUrl, category: categoryFromUrl})
    }

    const fetchPosts = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      const response = await fetch(`/api/post/getposts?${searchQuery}`)
      if (!response.ok) {
        setLoading(false)
        return
      }
      const data = await response.json()
      setPosts(data.posts)
      setLoading(false)
      if (data.posts.length === 9) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
    }
    fetchPosts()
  }, [location.search]) // eslint-disable-line react-hooks/exhaustive-deps
  const handleShowMore = async () => {
    const startIndex = posts.length
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()
    const response = await fetch(`/api/post/getposts?${searchQuery}`)
    if (!response.ok) {
      return
    }
    const data = await response.json()
    setPosts([...posts, ...data.posts])
    if (data.posts.length === 9) {
      setShowMore(true)
    } else {
      setShowMore(false)
    }
  }
  const handleChange = (e) => {
    let newSidebardData = {}
    if (e.target.id === 'searchTerm') {
      newSidebardData = {...sidebarData, searchTerm: e.target.value}
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc'
      newSidebardData = {...sidebarData, sort: order}
    }
    if (e.target.id === 'category') {
      const category = e.target.value || ''
      if (category === 'uncategorized' || category === '') {
        newSidebardData = {...sidebarData, category: ''}
      } else {
        newSidebardData = {...sidebarData, category: category}
      }
    }
    setSidebarData(newSidebardData)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const searchQuery = new URLSearchParams(location.search)
    searchQuery.set('searchTerm', sidebarData.searchTerm)
    sidebarData.sort && searchQuery.set('sort', sidebarData.sort)
    searchQuery.set('category', sidebarData.category)
    navigate(`/search?${searchQuery.toString()}`)
  }
  return (
    <div className={'flex flex-col md:flex-row'}>
      <div className={'p-7 border-b md:border-r md:min-h-screen border-gray-500'}>
        <form onSubmit={handleSubmit} className={'flex flex-col gap-8'}>
          <div className={'flex items-center gap-2'}>
            <label className={'whitespace-nowrap font-semibold text-gray-700'} htmlFor="search">Search Term:</label>
            <TextInput value={sidebarData.searchTerm} onChange={handleChange} placeholder={'Search...'} id="searchTerm"
                       type="text"/>
          </div>
          <div className={'flex items-center gap-2'}>
            <label htmlFor="sort">Sort:</label>
            <select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
          <div className={'flex items-center gap-2'}>
            <label htmlFor="category">Category:</label>
            <select id="category" value={sidebarData.category}
                    onChange={handleChange}>
              <option value="uncategorized">All</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="python">Python</option>
            </select>
          </div>
          <Button outline={true} type={'submit'} gradientDuoTone={'purpleToPink'}>
            Apply Filters
          </Button>
        </form>
      </div>

      <div className={'w-full'}>
        <h1 className={'text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'}>Posts results</h1>
        <div className={'p-7 flex flex-wrap gap-4'}>
          {
            !loading && !posts.length && (
              <p className={'text-xl text-gray-500'}>No posts found.</p>
            )
          }
          {loading && <p className={'text-xl text-gray-500'}>Loading...</p>}
          {
            !loading && posts.map((post) => (
              <PostCard key={post._id} post={post}/>
            ))
          }
          {!loading && showMore && (
            <button className={'text-teal-500 text-lg hover:underline p-7 w-full'} onClick={handleShowMore}>
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
