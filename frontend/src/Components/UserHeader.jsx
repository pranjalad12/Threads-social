import {Box,Flex,Text,VStack} from '@chakra-ui/layout'
import {Avatar} from '@chakra-ui/avatar'
import {Link, MenuItem, useToast} from '@chakra-ui/react'
import { BsInstagram } from "react-icons/bs";
import {CgMoreO} from "react-icons/cg";
import {Menu,MenuList,MenuButton,Portal} from "@chakra-ui/react";
import UserPost from './UserPost'
import { useRecoilValue,useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import {Button} from '@chakra-ui/react'
import { useState } from 'react';
import useShowText from '../hooks/useShowToast';



const UserHeader=({user})=>{
    const currentUser=useRecoilValue(userAtom);
    console.log(user);
    const toast=useToast();
    const Toast = useShowText();
    const [following,setfollowing]=useState(user.followers.includes(currentUser._id));
    const [updating,setUpdating]=useState(false);
    console.log(following);
    const handleFollowUnfollow=async()=>{ 
        if(!currentUser){
            Toast("Error","Please login to follow","error");
            return;
        }
        setUpdating(true);
        try{
            const res=await fetch(`/api/users/follow/${user._id}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                }
            });
            const data=await res.json();
            console.log(data);
            if(data.err){
                // console.log(data.err);
                Toast("Error",data.err,"error");
                return;
            }
            if (following) {
                Toast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop();
            }
            else{
                Toast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser.id);
            }
            setfollowing(!following);
        }
        catch(err){
            Toast("Error", err,"error");
        }
        finally{
            setUpdating(false);
        }
}

    const copyUrl=()=>{
        const currentUrl=window.location.href;
        navigator.clipboard.writeText(currentUrl).then(()=>{
           toast({description:"Profile link copied",
                             title:"Account Created"
           });

        });
    }
    return(
    <VStack spacing={4} align={"flex-start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
            <Text fontSize={"2x1"} fontWeight={"bold"}>{user.name}</Text>
            <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"sm"}>{user.username}</Text>
                <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                    Threads.net
                </Text>
            </Flex>
        </Box>
        <Box>
        {user.profilePic && (
            <Avatar
            name={user.name}
            src={user.profilePic}    
            size={{
                base: "md",
                md: "xl",
            }}
            />
        )}
        {!user.profilePic && (
            <Avatar
            name={user.name}
            size={{
                base: "md",
                md: "lg",
                xl: "xl",
            }}
            />
        )}
        </Box>
        </Flex>
        <Text>{user.bio}</Text>
        {
            currentUser._id === user._id && (
                <Link href='/update'>
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            )
        }
        {
            currentUser._id !== user._id && (
                
                    <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
                        {following ? "Unfollow" : "Follow"}
                    </Button>
               
            )
        }
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} >{user.followers.length} followers</Text>
                <Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <BsInstagram size={24} curson={"pointer"}/>
                </Box>
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} curson={"pointer"}/>
                        </MenuButton>

                        <Portal>
                        <MenuList bg={"gray.dark"}>
                            <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                                Copy Url
                            </MenuItem>
                        </MenuList>
                        </Portal>
                        </Menu>
                </Box>
            </Flex>

        </Flex>
        <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
            <Text fontWeight={"bold"}>Threads</Text>

        </Flex>
            <Flex flex={1} borderBottom={"1.5px solid gray"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
        </Flex>
        {/* <UserPost/> */}
    </VStack>
    );
};

export default UserHeader;