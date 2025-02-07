import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./componants/navbar";
import Footer from "./componants/footer";
import Home from "./pages/home";
import Contact from "./pages/contact";
import About from "./pages/About";
import Articles from "./pages/articles";
import Task from "./pages/TASK";
import Member from "./pages/Member";
import Login from "./pages/login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import "./App.css"

function Layout({ children }) {
  const location = useLocation();
  const hideNavFooter = ["/login", "/register"].includes(location.pathname); 

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/task" element={<Task />} />
            <Route path="/member" element={<Member />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
