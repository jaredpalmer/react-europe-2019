import React from 'react';
import { Client } from './ApolloClient';

export const useQuery = (query, props) => {
  try {
    const data = Client.readQuery({ query, ...props });
    return { data };
  } catch (error) {
    throw Client.query({ query, ...props }).then(data => ({ data }));
  }
};
