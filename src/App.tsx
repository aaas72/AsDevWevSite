import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomeScreen, AboutMeScreen, ProjectsScreen, ProjectScreen, BlogScreen, BlogPostScreen, ContactScreen } from "./screens/index.ts";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div id="main-content" className="main-app w-full h-screen noise">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/about" element={<AboutMeScreen />} />
          <Route path="/projects" element={<ProjectsScreen />} />
          <Route path="/project/:projectId" element={<ProjectScreen />} />
          <Route path="/blog" element={<BlogScreen />} />
          <Route path="/blog/:blogId" element={<BlogPostScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
