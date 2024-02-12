import React from 'react';
import SignUpCard from '../Components/SignUp.jsx';
import Login from '../Components/Login.jsx';
import { authScreenAtom } from '../atoms/authAtom.js';
import {useRecoilValue} from 'recoil';

const AuthPage = () => {
     const authScreenState=useRecoilValue(authScreenAtom);
    return (
        <div>
            {authScreenState==='login' ? <Login/>: <SignUpCard/>}
        </div>
    )
}
export default AuthPage;