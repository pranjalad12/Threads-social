import { Container} from "@chakra-ui/react";
import {Routes,Route,Navigate} from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./Components/Header"
import {useRecoilValue} from 'recoil'
import userAtom from './atoms/userAtom'
import HomePage from "./pages/HomePage"
import AuthPage from './pages/AuthPage'
import Gotoprofile from "./Components/Gotoprofile.jsx"
import LogoutButton from "./Components/Logout.jsx"
import UpdateProfilePage  from "./pages/updateProfile";
import CreatePost from "./Components/createPost.jsx";

function App() {
  const user=useRecoilValue(userAtom);

  return (
    <>
        <Container maxW='620px'>
            <Header/>
        <Routes>
            <Route path='/' element={!user?<Navigate to='/auth'/>:<HomePage/>}/>
            <Route path='/auth'  element={!user?<AuthPage/>:<Navigate  to='/'/>}/>
            <Route path='/update'  element={!user?<Navigate to='/auth'/>:<UpdateProfilePage/>}/>
            <Route path='/:username'  element={<UserPage/>}/>
            <Route path='/:username/post/:pid'  element={<PostPage/>}/>
        </Routes>
        
        {user && <LogoutButton/>}
        {user && <Gotoprofile/>}
        {user && <CreatePost/>}
        </Container>
    </>
  )
}

export default App;
