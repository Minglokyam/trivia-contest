import React from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { Link, useColorMode, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import Cookie from 'js-cookie';
import { BROWSER_USERNAME_KEY } from '../utils/constants';
import { useRouter } from 'next/dist/client/router';

interface NavigationBarProps {
    userData: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ userData }) => {
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    let body;

    if(userData){
        body = (
            <Flex>
                {
                    !router.pathname.includes('questions') ?
                    (
                    <NextLink href='/questions/[id]' as={`/questions/${userData.split('+')[0]}`}>
                        <Link mr={3}>Start a quiz</Link>
                    </NextLink>
                    ) :
                    null
                }
                <Box mr={3}>Welcome {userData.split('+')[1]}</Box>
                <Link 
                    onClick={() => {
                        Cookie.remove(BROWSER_USERNAME_KEY);
                        router.reload();
                    }}
                    mr={3}
                >
                    Logout
                </Link>
            </Flex>
        );
    }
    else{
        body = (
            <Flex>
                <NextLink href='/login'>
                    <Link mr={3}>Login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link mr={3}>Register</Link>
                </NextLink>
            </Flex>
        );
    }

    return (
        <Box boxShadow='xl'>
            <Flex 
                alignItems='center'
                bg={colorMode === 'light' ? '#4FD1C5' : '#718096'} 
                zIndex={1} 
                position='sticky' 
                top={0} 
                p={4}
            >
                <NextLink href='/'>
                    <Link fontSize='xl'>TRIVIA CONTEST</Link>
                </NextLink>
                <Flex alignItems='center' ml='auto'>
                    {body}
                    <Button onClick={toggleColorMode}>
                        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default NavigationBar;
