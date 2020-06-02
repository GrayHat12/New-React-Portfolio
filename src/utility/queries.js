export const oneBigQuery = `
query user {
    user(login: "GrayHat12") {
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
      registryPackages {
        totalCount
      }
    }
  }
`;
export const ReposQuery = `
{
  user(login: "GrayHat12") {
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
