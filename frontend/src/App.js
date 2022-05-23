import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/page/Home';
import Login from './components/page/Login';
import Profile from './components/page/Profile';
import Signup from './components/page/Signup';
import PageNotFound from './components/page/PageNotFound';
import UserProfile from './components/page/UserProfile';
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Post from './components/Post';
import { reducer, initialState } from './reducers/userReducer';
import SubUserPost from './components/page/SubUserPost';
import EditProfile from './components/EditProfile';
import PostDetail from './components/PostDetail';
import Reset from './components/page/Reset';
import Newpassword from './components/page/Newpassword';
export const UserContext = createContext();

const Routing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'USER', payload: user });
      // navigate('/');
    } else {
      if (!location.pathname.startsWith('/reset')) navigate('/login');
    }
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/post" element={<Post />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/postdetail/:postid" element={<PostDetail />} />
      <Route path="/myfollowingpost" element={<SubUserPost />} />
      <Route path="/editp" element={<EditProfile />} />
      <Route exact path="/reset" element={<Reset />} />
      <Route path="/reset/:token" element={<Newpassword />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
