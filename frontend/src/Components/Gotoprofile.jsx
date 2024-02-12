import React from 'react';
import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import useShowText from '../hooks/useShowToast';
import { Link as RouterLink } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";


const Gotoprofile=()=>{
    const user = useRecoilValue(userAtom);
    return(
        <Button
        position={"fixed"} top={"30px"} right={"120px"} size={"sm"}
        >
            <Link as={RouterLink} to={`/${user.username}`}>
            Profile
            </Link>
           
        </Button>
        
    )
}
export default Gotoprofile;