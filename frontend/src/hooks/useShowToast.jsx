import React from 'react';
import {useToast} from "@chakra-ui/toast";
import {useCallback} from 'react';
const useShowText =()=>{
    const toast=useToast();
    const showToast=useCallback((title,description,status)=>{
        toast({
            title:title,
            description:description,
            status:status
        });
    },[toast]);
    return showToast;
}
export default useShowText;