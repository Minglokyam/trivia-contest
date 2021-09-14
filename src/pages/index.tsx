import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { Wrapper } from '../components/Wrapper';
import { useUsersQuery } from '../generated/graphql';
import { BROWSER_USERNAME_KEY } from '../utils/constants';
import { parseCookie } from '../utils/parseCookie';
import withApollo from '../utils/withApollo';

interface IndexProps {
  userData: string;
}

const Index: React.FC<IndexProps> = ({userData}) => {
  const queryResult = useUsersQuery();

  const users = queryResult.data?.users ?? [];

  return (
    <div>
      <Layout userData={userData}>
        <Wrapper>
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th fontSize='lg'>Ranking</Th>
              </Tr>
              <Tr>
                <Th>Username</Th>
                <Th>Points</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.username}>
                  <Td>{user.username}</Td>
                  <Td>{user.points}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Wrapper>
      </Layout>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const cookie = parseCookie(req);

  return {props: { 
      userData: cookie[BROWSER_USERNAME_KEY] ?? ''
  }};
}

export default withApollo({ssr: true})(Index);