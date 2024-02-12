import {Flex, Image, useColorMode} from '@chakra-ui/react'


const Header=()=>{
    const {colorMode, toggleColorMode} = useColorMode();
    return <Flex justifyContent={"center"} mb='12' mt={6} >
        <Image
            cursor='pointer' alt={'logo'} w={'6'}  src={colorMode==="dark"? "/light-logo.svg" : "/dark-logo.svg"} onClick={toggleColorMode}
        ></Image>
        
    </Flex>
}

export default Header;