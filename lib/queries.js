// lib/queries.js

import { gql, useMutation } from '@apollo/client'

export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    weeklyHistory
    popularPosts: posts(first: 50) {
      nodes {
        __typename
        title
        slug
        viewCount
      }
    }
    popularPages: pages(first: 20) {
      nodes {
        __typename
        title
        slug
        viewCount
      }
    }
    categories {
      nodes {
        name
        count
      }
    }
  }
`

export const INCREMENT_VIEWS_MUTATION = gql`
  mutation IncrementViews($id: Int!) {
    incrementPostViews(input: { databaseId: $id }) {
      views
    }
  }
`

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
`

export const GET_ALL_PAGES = gql`
  query GET_ALL_PAGES {
    pages(first: 100) {
      nodes {
        title
        slug
        content
      }
    }
  }
`

export const GET_GEORGIAS_LAW = gql`
  query GET_GEORGIAS_LAW_PAGE {
    pageBy(uri: "georgias-law") {
      id
      databaseId
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
      databaseId
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
      databaseId
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
      databaseId
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
      databaseId
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
      databaseId
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
      databaseId
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
      databaseId
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
      databaseId
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
      databaseId
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

export const GET_DONATION_FORM_PAGE = gql`
  query GET_DONATION_FORM_PAGE {
    pageBy(uri: "donation-form") {
      id
      databaseId
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

export const GET_TERMS_PAGE = gql`
  query GET_TERMS_PAGE {
    pageBy(uri: "terms-transparency-privacy-affiliations") {
      id
      databaseId
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
