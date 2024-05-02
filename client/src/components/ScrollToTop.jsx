import {useLocation} from "react-router-dom";
import {useEffect} from "react";

export default function ScrollToTop() {
  const {pathname} = useLocation();
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        // behavior: "smooth"
      });
    }
    scrollToTop()
  }, [pathname])

  return null
}
