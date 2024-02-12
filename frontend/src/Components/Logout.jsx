import React from 'react';
import {Button} from "@chakra-ui/button";
import userAtom from '../atoms/userAtom';
import {useSetRecoilState} from'recoil';
import useShowText from '../hooks/useShowToast';
const LogoutButton=()=>{
    const setUser=useSetRecoilState(userAtom);
    const showToast=useShowText();
    const handleLogout = async()=>{
        try{
           
            const res=await fetch('/api/users/logout',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            const data=await res.json();
            console.log(data);
            if(data.err){
                // console.log(data.err);
                showToast("Error",data.err,"error");
                
            }
            localStorage.removeItem("user-threads");
            setUser(null);
            
        }
        catch(err){
            showToast("Error",err,"error");
        }
    }
    return(
        <Button
        position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}
        >
            Logout
        </Button>
        
    )
}
export default LogoutButton;