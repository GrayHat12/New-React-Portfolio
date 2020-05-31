const oneBigQuery = `
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

export default oneBigQuery;