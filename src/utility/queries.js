import settings from '../settings/secret.json';
export const oneBigQuery = `
query user {
    user(login: "${settings.github_username}") {
      avatarUrl
      bio
      email
      isHireable
      issues {
        totalCount
      }
      location
      name
      organizations {
        totalCount
      }
      projects {
        totalCount
      }
      pullRequests {
        totalCount
      }
      repositories {
        totalCount
      }
      repositoriesContributedTo {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      status {
        message
      }
      twitterUsername
      following {
        totalCount
      }
      followers {
        totalCount
      }
      packages {
        totalCount
      }
    }
  }
`;
export const ReposQuery = `
{
  user(login: "${settings.github_username}") {
    login
    repositories(last: 100) {
      nodes {
        createdAt
        description
        forks {
          totalCount
        }
        homepageUrl
        isFork
        isPrivate
        isTemplate
        name
        nameWithOwner
        url
        languages(first: 100) {
          nodes {
            name
            color
          }
        }
        stargazers {
          totalCount
        }
        object(expression: "master") {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
        deployments {
          totalCount
        }
        diskUsage
        releases {
          totalCount
        }
        issues {
          totalCount
        }
        collaborators {
          totalCount
        }
      }
    }
  }
}
`;
export const PullReqQuery = `
{
  user(login: "${settings.github_username}") {
    pullRequests(first: 100) {
      nodes {
        additions
        authorAssociation
        changedFiles
        closed
        deletions
        merged
        repository {
          name
          nameWithOwner
          url
          homepageUrl
          stargazers {
            totalCount
          }
          forks {
            totalCount
          }
        }
        body
        labels(first: 20) {
          nodes {
            name
            color
          }
        }
        title
        url
        state
      }
    }
  }
}
`;
