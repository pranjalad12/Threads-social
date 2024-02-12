import UserHeader from '../Components/UserHeader'
import UserPost from '../Components/UserPost'
import React,{useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Post from '../Components/Post';
import useShowText from '../hooks/useShowToast'

const UserPage =()=>{
    const [user,setUser]=useState(null);
    const [posts,setPosts]=useState([]);
            const {username}=useParams();
            const showToast=useShowText();
            useEffect(()=>{
                const getUser=async()=>{
                    try{
                        const res=await fetch(`/api/users/profile/${username}`);
                        const data=await res.json();
                        if(data.err){
                            showToast("Error",data.err,"error");
                            return;
                        }
                        setUser(data);
                    }
                    catch(err){
                        showToast("Error, " + err.message);
                    }
                };
                const getPosts=async()=>{
                    // console.log({user});
                    // if (!user) return;
                   
                    try{
                        const res=await fetch(`/api/posts/user/${username}`);
                        const data=await res.json();
                        if(data.err){
                            showToast("Errors",data.err,"error");
                            return;
                        }
                        setPosts(data);
                        console.log({data});
                    }
                    catch(err){
                        showToast("Error, " + err.message);
                    }
                }
                getUser();
                getPosts();
            },[username],showToast);
            // console.log(user);
            if(!user){
                return null;
            }  
            else{
                return (
                    <>
                        
                        <UserHeader user={user}/>
                        {posts.length===0 && (

                        <h2 align="center"> No posts to display</h2>
                        )}
                        {posts.map((p)=>(
                            <Post key={p._id} post={p} postedBy={p.postedBy}/>
                        ))}
                        
                    </>
            
                );
            }              
    
}
export default UserPage;