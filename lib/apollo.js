import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

let wordpressClient;
let cloudflareClient;

/**
 * Primary WordPress Client
 */
export function getApolloClient() {
  if (!wordpressClient) {
    wordpressClient = _createWordPressClient();
  }
  return wordpressClient;
}

function _createWordPressClient() {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
  console.log('WordPress GraphQL Endpoint:', endpoint);
  
  return new ApolloClient({
    link: new HttpLink({
      uri: endpoint,
    }),
    cache: new InMemoryCache(),
  });
}

/**
 * Dedicated Cloudflare Client
 * Note: Cloudflare's GraphQL API requires an authorization header
 */
export function getCloudflareClient() {
  // Only initialize on the server-side to protect your API Token
  if (typeof window !== 'undefined') {
    return null;
  }

  if (!cloudflareClient) {
    cloudflareClient = _createCloudflareClient();
  }
  return cloudflareClient;
}

function _createCloudflareClient() {
  const endpoint = 'https://api.cloudflare.com/client/v4/graphql';
  const token = process.env.CLOUDFLARE_API_TOKEN;

  if (!token) {
    console.warn('Warning: CLOUDFLARE_API_TOKEN is missing from environment variables.');
  }

  return new ApolloClient({
    link: new HttpLink({
      uri: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache' },
      query: { fetchPolicy: 'no-cache' },
    },
  });
}