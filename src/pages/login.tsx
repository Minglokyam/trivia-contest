import React from 'react';
import { Form, Formik } from 'formik';
import withApollo from '../utils/withApollo';
import { toErrorMap } from '../utils/toErrorMap';
import { InputField } from '../components/InputField';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { useRouter } from 'next/dist/client/router';
import { BROWSER_USERNAME_KEY } from '../utils/constants';
import Cookie from 'js-cookie';
import { parseCookie } from '../utils/parseCookie';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	const [login] = useLoginMutation();
	const router = useRouter();

  return (
    <Formik
        initialValues={{usernameOrEmail: '', password: ''}}
        onSubmit={async (values, {setErrors}) => {
            const response = await login({variables: values});
            if(response.data?.login.user){
                const {id, username, updatedAt} = response.data.login.user;
                Cookie.set(BROWSER_USERNAME_KEY, `${id}+${username}+${updatedAt}`);
                router.push('/');
            }
            else if(response.data?.login.errors){
                setErrors(toErrorMap(response.data?.login.errors));
            }
        }}
    >
        {({isSubmitting}) => (
            <Wrapper>
                <Form>
                    <InputField 
                        name='usernameOrEmail'
                        placeholder='Username or Email'
                        label='Username or Email'
                    />
                    <Box mt={2}>
                        <InputField 
                            name='password'
                            placeholder='Password'
                            label='Password'
                            type='password'
                        />
                    </Box>
                    <Box mt={4}>
                        <Button
                            type='submit'
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Box>
                </Form>
            </Wrapper>
        )}
    </Formik>
  )
}

export async function getServerSideProps({ req }) {
    const cookie = parseCookie(req);
  
    const getServerSidePropsResult = {props:{}};

    if(cookie[BROWSER_USERNAME_KEY]){
        getServerSidePropsResult['redirect'] = {
            permanent: false,
            destination: '/' 
        }
    }

    return getServerSidePropsResult;
}

export default withApollo({ssr: true})(Login);