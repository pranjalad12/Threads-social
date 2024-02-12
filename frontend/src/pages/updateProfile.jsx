'use client'
 import { useRecoilValue,useSetRecoilState } from 'recoil'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react'
import { useRecoilState } from "recoil";
import { SmallCloseIcon } from '@chakra-ui/icons'
import userAtom from '../atoms/userAtom'
import usePreviewImg from "../hooks/usePreviewImg.jsx";
import { useRef, useState } from 'react'
import useShowText from '../hooks/useShowToast.jsx'


export default function UserProfileEdit() {
  const fileRef = useRef(null);
  const [user, setUser] = useRecoilState(userAtom);
    const showToast = useShowText();
    const [updating, setUpdating] = useState(false);
    const [inputs, setInputs] = useState({
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      password: "",
    });
    
    const { handleImageChange, imgUrl } = usePreviewImg();
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (updating) return;
      setUpdating(true);
      try {
        const res = await fetch(`/api/users/updateProfile/${user?._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
        });
        const datas = await res.text(); // Read response as text

        let data;
        try {
          data = datas ? JSON.parse(datas) : null; // Parse JSON if response is not empty
        } catch (error) {
          console.error("Error parsing JSON:", error);
          throw new Error("Failed to parse server response as JSON");
        }
    
         // Parse JSON if response is not empty

        // const data = await res?.json(); // updated user object
        if (data.error) {
          showToast("Errors", data.error, "error");
          return;
        }
        showToast("Success", "Profile updated successfully", "success");
        setUser(data);
        console.log(data);
        localStorage.setItem("user-threads", JSON.stringify(data));
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setUpdating(false);
      }
    };
  return (
    // <form onSubmit={handleSubmit}>
    <Flex
      
      align={'center'}
      justify={'center'} my={6}
      >
        
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              {/* <Avatar size="xl" src="https://bit.ly/sage-adebayo"/> */}
              <Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
             
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImageChange}></Input>
            </Center>
          </Stack>
        </FormControl>
        <FormControl >
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder={user.name}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.name}
            onChange={(e)=>setInputs({...inputs,name:e.target.value})}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Username</FormLabel>
          <Input
            placeholder={user.username}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.username}
            onChange={(e)=>setInputs({...inputs,username:e.target.value})}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="user.email"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={inputs.email}
            onChange={(e)=>setInputs({...inputs,email:e.target.value})}
          />
        </FormControl>
        <FormControl  >
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Bio"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={inputs.bio}
            onChange={(e)=>setInputs({...inputs,bio:e.target.value})}
          
          />
        </FormControl>
        <FormControl id="password" >
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            value={inputs.password}
            onChange={(e)=>setInputs({...inputs,password:e.target.value})}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}
            type='submit'
            onClick={handleSubmit}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    // </form>
  )
}

