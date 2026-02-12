import { gql, useMutation } from '@apollo/client'

export const GET_POST_BY_SLUG = gql`
  query PostBySlug($slug: String!) {
    generalSettings {
      title
    }
    postBy(slug: $slug) {
      id
      content
      title
      slug
      date
      comments {
        nodes {
          id
          databaseId
          content
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          date
        }
      }
      commentCount
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          firstName
          lastName
        }
      }
      categories {
        nodes {
          name
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
      modified
      databaseId
    }
  }
`

export const GET_ALL_POSTS = gql`
  {
    generalSettings {
      title
      description
    }
    posts(first: 10000) {
      edges {
        node {
          id
          title
          slug
          date
          categories {
            nodes {
              name
            }
          }
          tags {
            nodes {
              name
              link
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
          excerpt(format: RENDERED)
        }
      }
    }
  }
`

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        content
        id
      }
    }
  }
`;

export function useCreateCommentMutation() {
  return useMutation(CREATE_COMMENT_MUTATION)
}
