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

export const GET_GEORGIAS_LAW = gql`
  query GET_GEORGIAS_LAW_PAGE {
    pageBy(uri: "georgias-law") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_SUPPORT_AGENCIES_INFORMATION = gql`
  query GET_SUPPORT_AGENCIES_INFORMATION {
    pageBy(uri: "support-agencies-information") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_QUESTIONS_WE_DONT_WANT_TO_ANSWER = gql`
  query GET_QUESTIONS_WE_DONT_WANT_TO_ANSWER {
    pageBy(uri: "questions-we-dont-want-to-answer/") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_SUPPORT_AND_HELPLINES = gql`
  query GET_SUPPORT_AND_HELPLINES {
    pageBy(uri: "support-helplines") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_CONTACT_PAGE = gql`
  query GET_CONTACT_PAGE {
    pageBy(uri: "contact") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_GIVING_BACK_PAGE = gql`
  query GET_GIVING_BACK_PAGE {
    pageBy(uri: "giving-back-donations-fundraisers") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_SPEAKING_TESTIMONY_PAGE = gql`
  query GET_SPEAKING_TESTIMONY_PAGE {
    pageBy(uri: "speaking-testimony") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_SHOP_BUY_BOOK_PAGE = gql`
  query GET_SHOP_BUY_BOOK_PAGE {
    pageBy(uri: "shop-buy-the-book") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export const GET_MEDIA_PRESS_BOOK = gql`
  query GET_MEDIA_PRESS_BOOK {
    pageBy(uri: "media-press") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`
export const GET_HOW_PAGE = gql`
  query GET_HOW_PAGE {
    pageBy(uri: "the-book-how-lace-blades-became-a-book") {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`

export function useCreateCommentMutation() {
  return useMutation(CREATE_COMMENT_MUTATION)
}
