import React from 'react';
import gql from 'graphql-tag';
import { Link } from '@reach/router';
import { Spinner } from './Spinner';
import { useQuery } from './Query';
import { MyErrorComponent } from './ErrorBoundary';

export const UserDetail = ({ login }) => {
  return (
    <div style={{ margin: '0 auto' }}>
      <UserHeader login={login} />
      <UserDetailRepos login={login} />
    </div>
  );
};

const UserHeader = ({ login }) => {
  return (
    <div style={{ display: 'flex', padding: 16 }}>
      <Avatar login={login} />
      <UserDetailInfo login={login} />
    </div>
  );
};

const USER_DETAIL_INFO = gql`
  query UserDetail($login: String!) {
    user(login: $login) {
      id
      bioHTML
      name
    }
  }
`;

const UserDetailInfo = ({ login }) => {
  const { data } = useQuery(USER_DETAIL_INFO, {
    variables: { login },
  });

  const {
    user: { name, bioHTML },
  } = data;

  return (
    <div>
      <h1 style={{ margin: 0, padding: 0 }}>{name}</h1>
      <div style={{ color: '#999', marginBottom: 8 }}>@{login}</div>
      <div
        style={{
          fontSize: 14,
          color: '#555',
          maxWidth: 400,
          margin: '0 auto',
        }}
        dangerouslySetInnerHTML={{ __html: bioHTML }}
      />
    </div>
  );
};

const USER_REPOS = gql`
  query UserRepos($login: String!) {
    user(login: $login) {
      id
      repositories(
        first: 10
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          name
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`;

const UserDetailRepos = ({ login }) => {
  const { data } = useQuery(USER_REPOS, {
    variables: { login },
  });

  const {
    user: {
      repositories: { nodes },
    },
  } = data;

  return (
    <>
      {nodes && nodes.length > 0
        ? nodes.map(repo => (
            <div key={repo.name} style={{ padding: 16 }}>
              <Link
                to={repo.name}
                style={{ display: 'block', marginBottom: 4 }}
              >
                {login}/{repo.name}
              </Link>{' '}
              <div style={{ fontSize: 14 }}>
                ★ {repo.stargazers.totalCount}
              </div>
            </div>
          ))
        : 'No repos'}
    </>
  );
};

function Avatar({ login, ...props }) {
  const { data } = useQuery(
    gql`
      query Avatar($login: String!) {
        user(login: $login) {
          id
          avatarUrl
        }
      }
    `,
    { variables: { login } }
  );

  return (
    <img
      style={{
        height: 100,
        display: 'block',
        marginRight: 16,
        borderRadius: '50%',
      }}
      src={data.user.avatarUrl}
      alt={props.alt}
      {...props}
    />
  );
}
