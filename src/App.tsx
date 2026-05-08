import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomeScreen, AboutMeScreen, ProjectsScreen, ProjectScreen, BlogScreen, BlogPostScreen, ContactScreen } from "./screens/index.ts";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./screens/Admin/Login";
import AdminLayout from "./screens/Admin/AdminLayout";
import DashboardHome from "./screens/Admin/DashboardHome";
import ManageProjects from "./screens/Admin/ManageProjects";
import ManageBlogs from "./screens/Admin/ManageBlogs";
import ManageTools from "./screens/Admin/ManageTools";
import ManageAbout from "./screens/Admin/ManageAbout";
import ManageMessages from "./screens/Admin/ManageMessages";
import ProtectedRoute from "./components/ProtectedRoute";

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
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="about" element={<ManageAbout />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="tools" element={<ManageTools />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
