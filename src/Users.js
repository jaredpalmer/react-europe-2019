import React from 'react';
import gql from 'graphql-tag';
import { navigate } from '@reach/router';
import { Spinner } from './Spinner';
import { Query, useQuery } from './Query';

const STARGAZERS = gql`
  query Stargazers($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazers(first: 10) {
        nodes {
          login
          name
          avatarUrl
        }
      }
    }
  }
`;

const options = {
  variables: {
    owner: 'jaredpalmer',
    name: 'tsdx',
  },
};

export const Users = () => {
  const { data, loading } = useQuery(STARGAZERS, options);
  return (
    <>
      {loading ? (
        <Spinner size="large" />
      ) : data ? (
        <UserList data={data} />
      ) : null}
    </>
  );
};

function UserList({ data }) {
  const [currentId, setCurrentId] = React.useState(null);
  return (
    <div
      style={{
        margin: '0 auto',
      }}
    >
      {data &&
        data.repository.stargazers.nodes &&
        data.repository.stargazers.nodes.length > 0 &&
        data.repository.stargazers.nodes.map(user => (
          <div
            className="item"
            key={user.login}
            onClick={() => {
              navigate('/' + user.login);
              setCurrentId(user.login);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 16,
              background:
                currentId === user.login ? '#F4F5F7' : '#fff',
              cursor: 'pointer',
            }}
          >
            <img
              src={user.avatarUrl}
              alt={user.login}
              style={{
                height: 50,
                display: 'block',
                marginRight: 16,
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                color: '#000',
                textDecoration: 'none',
                fontSize: 20,
                fontWeight: 500,
                flex: 1,
              }}
            >
              <div>{user.name}</div>
              <div
                style={{
                  color: '#999',
                }}
              >
                @{user.login}
              </div>
            </div>
            {currentId === user.login ? (
              <div>
                <Spinner />
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
}
