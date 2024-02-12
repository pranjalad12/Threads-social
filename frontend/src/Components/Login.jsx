'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { authScreenAtom } from '../atoms/authAtom'
import { useRecoilValue,useSetRecoilState } from 'recoil'
import useShowText from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const setUser=useSetRecoilState(userAtom);
  const showToast=useShowText();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const handleLogin=async ()=>{
    try{
      const res=await fetch('/api/users/login',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(inputs),
      });
      const data=await res.json();
      if(data.err){
        showToast("Error",data.err.toString(),"error");
        return;
      } 
      console.log(data);
      localStorage.setItem("user-threads",JSON.stringify(data));
      // const user=useRecoilValue(userAtom);
      // console.log(user);
      setUser(data);   
    }
    catch(err){
      showToast("Error",err.toString(),"error");
    }
  }
    const setAuthScreen=useSetRecoilState(authScreenAtom);
  return (
    <Flex
      align={'center'}
      justify={'center'}
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.950')}
          boxShadow={'lg'}
          p={8} width={{
            base:"full",
            sm:'480px',
            
          }}>
          <Stack spacing={4}>
            
            <FormControl  isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" value={inputs.username} onChange={(e)=>setInputs({...inputs,username:e.target.value})}
                  />
            </FormControl>
            <FormControl  isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={inputs.password} onChange={(e)=>setInputs({...inputs,password:e.target.value})}
                  />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600","gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700","gray.800"),
                }} 
                onClick={handleLogin}
                >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} onClick={()=>setAuthScreen("signup")}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
