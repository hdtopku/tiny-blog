import {useSelector} from "react-redux"

// eslint-disable-next-line react/prop-types
export default function ThemeProvider({children}) {
  const {theme} = useSelector(state => state.theme)
  return (
    <div className={theme}>
      <div className="min-h-screen bg-white text-gray-700 dark:bg-gray-200 dark:bg-[rgb(16,23,42)]">
        {children}</div>
    </div>
  )
}
