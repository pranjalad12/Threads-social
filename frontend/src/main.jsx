import React from 'react'
import ReactDOM from 'react-dom/client'
import {ColorModeScript} from '@chakra-ui/react'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import {mode} from '@chakra-ui/theme-tools'
import {extendTheme} from '@chakra-ui/theme-utils'
import {BrowserRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';

const colors = {
    gray:{
        light:"#616161",
        dark:"#1e1e1e",
    }
};
const config={
    initialColorMode:"dark",
    useSystemColorMode:true,
};

const styles ={
    global: (props)=>(
        {
            body:{
                color:mode('gray.800','whiteAlpha.900')(props),
                bg:mode('gray.100', 'gray.dark')(props),
            }
        }
    )
};

const theme = extendTheme({ config, styles,colors });

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RecoilRoot>
        <BrowserRouter>
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
        </ChakraProvider>
        </BrowserRouter>
        </RecoilRoot>
    </React.StrictMode>
);