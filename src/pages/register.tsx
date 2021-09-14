import React from 'react';
import { Form, Formik } from 'formik';
import withApollo from '../utils/withApollo';
import { InputField } from '../components/InputField';
import { Button } from '@chakra-ui/button';
import { useRegisterMutation, UsersDocument } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { Box } from '@chakra-ui/layout';
import { Wrapper } from '../components/Wrapper';
import { useRouter } from 'next/dist/client/router';
import { BROWSER_USERNAME_KEY } from '../utils/constants';
import Cookie from 'js-cookie';
import { parseCookie } from '../utils/parseCookie';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [register] = useRegisterMutation();
	const router = useRouter();

  return (
    <Formik
        initialValues={{username: '', password: '', email: ''}}
        onSubmit={async (values, {setErrors}) => {
            const response = await register({
                variables: {options: values},
                refetchQueries: [{ query: UsersDocument }]
            });
            if(response.data?.register.user){
                const {id, username, updatedAt} = response.data.register.user;
                Cookie.set(BROWSER_USERNAME_KEY, `${id}+${username}+${updatedAt}`);
                router.push('/');
            }
            else if(response.data?.register.errors){
                setErrors(toErrorMap(response.data?.register.errors));
            }
        }}
    >
        {({isSubmitting}) => (
            <Wrapper>
                <Form>
                    <InputField 
                        name='username'
                        placeholder='Username'
                        label='Username'
                    />
                    <Box mt={2}>
                        <InputField 
                            name='email'
                            placeholder='Email'
                            label='Email'
                        />
                    </Box>
                    <Box mt={2}>
                        <InputField 
                            name='password'
                            placeholder='Password'
                            label='Password'
                        />
                    </Box>
                    <Box mt={4}>
                        <Button
                            type='submit'
                            isLoading={isSubmitting}
                        >
                            Register
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

export default withApollo({ssr: true})(Register);