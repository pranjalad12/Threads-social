import { Avatar } from "@chakra-ui/avatar";
// import { Image } from "@chakra-ui/image";
import {Box, Flex, Text} from "@chakra-ui/layout";
import {Image} from "@chakra-ui/image";
// import {BsThreeDots} from "react-icons/bs";
import Actions from "../Components/Actions.jsx";
import { BsThreeDots } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import Actions from "./Actions.jsx";
import {useEffect, useState} from "react";
import {Button, Divider, Spinner} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useShowText from "../hooks/useShowToast.jsx";
import postsAtom from "../atoms/postsAtom.js";
import useGetUserProfile from "../hooks/useGetUserProfile.jsx";
import userAtom from "../atoms/userAtom.js";
import { useRecoilValue } from "recoil";
import Comment  from "../Components/Comment.jsx";



const PostPage =()=>{
    const [liked, setLiked]=useState(false);
    const { user, loading } = useGetUserProfile();
    // console.log(user);
    const currentUser = useRecoilValue(userAtom);
    const [posts,setPost]   =useState(postsAtom);
    const {pid}=useParams();
    const showToast=useShowText();

    const currentPost = posts[0];
    // console.log(currentPost);
    useEffect(()=>{
        const getPosts=async()=>{
            setPost([]);
            try{    
                const res=await fetch(`/api/posts/${pid}`);
                const data=await res.json();
                if(data.err){
                    showToast("Error",data.err,"error");
                    return;
                }
                setPost([data]);
                // console.log(data.post);
            }
            catch(err){
                showToast("Error, " + err.message);
            };
            
        }
        getPosts();
    },[pid,showToast,setPost]);
    if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}
    if (!currentPost) return null;
    console.log(currentPost.post.replies);
    return (
     <>
         <Flex justifyContent={"space-between"}>
         <Flex alignItems={"center"} w={"full"} gap={3}>
             <Avatar name="mark Zukerberg" src={user?.profilePic} size={"md"}></Avatar>
             <Flex alignItems={"center"}>
                 <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
                 <Image src='/verified.png' w='4' h={4} ml={1} />
             </Flex>
         </Flex>
             <Flex gap={4} alignItems={"center"}>
                 <Text fontStyle={"sm"} color={"gray.light"}>
                     1d
                 </Text>
                 <BsThreeDots />
             </Flex>
         </Flex>
         <Text my={3}>{currentPost.post.text}</Text>
         {/* <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}> */}
        
         {/* <Image src='/post1.png' w={"full"} /> */}
        {/* </Box> */}
         <Flex gap={3} my={1}>
             <Actions post={currentPost.post}/>
         </Flex>
         
         <Divider my={4}/>
         <Flex justifyContent={"space-between"}>
             <Flex>
                 <span dangerouslySetInnerHTML={{__html: '&#128075;'}}/>
                 <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
             </Flex>
             <Button>Get</Button>
         </Flex>
         <Divider my={4}/>
         
        {currentPost.post.replies?.map((reply, index) => (
            <Comment
            key={reply._id}
            reply={reply}
            lastReply={reply._id === currentPost.post.replies[currentPost.post.replies.length - 1]._id}
        />
        ))}

     </>
    );
}
export default PostPage;