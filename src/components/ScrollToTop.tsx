import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // عند تغيير المسار، قم بالتمرير إلى أعلى الصفحة
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null; // هذا المكون لا يعرض أي شيء
};

export default ScrollToTop;