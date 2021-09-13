import React from 'react';
import { Box } from '@chakra-ui/react';

export type WrapperVariant = 'regular';

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({
    children
}) => {
    return (
        <Box 
            mt={8}
            mx='auto'
            w='100%'
            p={3}
            maxW='800px'
            borderWidth='1px'
            borderRadius='lg'
        >
            {children}
        </Box>
    );
};
