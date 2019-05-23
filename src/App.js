import React from 'react';
import './index.css';
import ErrorBoundary from 'react-error-boundary';
import { ApolloProvider } from '@apollo/react-hooks';
import { MyErrorComponent } from './ErrorBoundary';
import { Users } from './Users';
import { UserDetail } from './UserDetail';
import { Router } from '@reach/router';
import { Client } from './ApolloClient';
import { Nav } from './Nav';

function App() {
  return (
    <ApolloProvider client={Client}>
      <ErrorBoundary FallbackComponent={MyErrorComponent}>
        <Router>
          <Nav default>
            <UserDetail path="/:login" />
            <Users default />
          </Nav>
        </Router>
      </ErrorBoundary>
    </ApolloProvider>
  );
}

export default App;
