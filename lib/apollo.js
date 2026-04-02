import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

let client;

/**
 * getApolloClient
 */

export function getApolloClient() {
  if (!client) {
    client = _createApolloClient();
  }
  return client;
}

/**
 * createApolloClient
 */

export function _createApolloClient() {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
  console.log('GraphQL Endpoint:', endpoint);
  return new ApolloClient({
    link: new HttpLink({
      uri: endpoint,
      cache: new InMemoryCache(),
    }),
    cache: new InMemoryCache(),
  });
}