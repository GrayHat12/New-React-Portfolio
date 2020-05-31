import React from "react";
import "./css/App.css";
import axios from "axios";
import OneBigQuery from "./utility/queries";
import followerIcon from "./assets/svg/user.svg";
import followingIcon from "./assets/svg/follow.svg";
import secret from "./secret.json";
import packageIcon from "./assets/svg/box.svg";

class App extends React.Component {
  state = {
    user: {
      name: "",
      avatarUrl: "https://i.picsum.photos/id/237/280/280.jpg?grayscale",
      bio: "",
      email: "",
      isHireable: false,
      packagesCount: 0,
      issuesCount: 0,
      location: "",
      followersCount: 0,
      followingCount: 0,
      organizationsCount: 0,
      projectsCount: 0,
      pullRequestsCount: 0,
      repositoriesCount: 0,
      repositoriesContributedToCount: 0,
      starredRepositoriesCount: 0,
      status: "",
      twitterUsername: "",
    },
    animation: "nodiv",
    statList : [],
  };

  constructor(props = {}) {
    super(props);
    this.profileClicked = this.profileClicked.bind(this);
    this.animationEnded = this.animationEnded.bind(this);
    this.getGithubChildren = this.getGithubChildren.bind(this);
    this.getGithubStats = this.getGithubStats.bind(this);
  }
  componentDidMount() {
    var url = "https://api.github.com/graphql";
    var headers = {
      Authorization: "Bearer " + secret.github_token,
      "Content-Type": "application/json",
    };
    axios({
      url: url,
      method: "POST",
      headers: headers,
      data: { query: OneBigQuery, variables: {} },
    })
      .then((res) => {
        try {
          var data = res.data.data.user;
          var user = this.state.user;
          //user.avatarUrl = data.avatarUrl;
          user.bio = data.bio;
          user.email = data.email;
          user.followersCount = data.followers.totalCount;
          user.followingCount = data.following.totalCount;
          user.isHireable = data.isHireable;
          user.issuesCount = data.issues.totalCount;
          user.location = data.location;
          user.name = data.name;
          user.organizationsCount = data.organizations.totalCount;
          user.projectsCount = data.projects.totalCount;
          user.pullRequestsCount = data.pullRequests.totalCount;
          user.repositoriesCount = data.repositories.totalCount;
          user.repositoriesContributedToCount =
            data.repositoriesContributedTo.totalCount;
          user.starredRepositoriesCount = data.starredRepositories.totalCount;
          user.status = data.status.message;
          user.twitterUsername = data.twitterUsername;
          user.packagesCount = data.registryPackages.totalCount;
          this.setState({ user: user, animation: "stats" });
        } catch (err) {
          console.error(err);
        }
      })
      .catch(console.error);
  }
  profileClicked(event) {
    event.preventDefault();
  }
  animationEnded(event) {}
  getGithubChildren() {
    return (
      <div className="statsChild">
        <div className="stat item" title="Repositories">
          <img
            className="statspan"
            alt="Repositories"
            src="https://img.icons8.com/doodle/48/000000/repository.png"
          />
          <span className="statspan">{this.state.user.repositoriesCount}</span>
        </div>
        <div className="stat item" title="Packages">
          <img
            className="statspan"
            width="48"
            height="48"
            alt="Packages"
            src={packageIcon}
          />
          <span className="statspan">{this.state.user.packagesCount}</span>
        </div>
        <div className="stat item" title="Issues">
          <img
            className="statspan"
            src="https://img.icons8.com/ultraviolet/48/000000/high-importance.png"
            alt="Issue Icon"
          />
          <span className="statspan">{this.state.user.issuesCount}</span>
        </div>
        <div className="stat item" title="Contributions">
          <img
            className="statspan"
            src="https://img.icons8.com/ultraviolet/48/000000/pull-request.png"
            alt="Total Pull Requests"
          />
          <span className="statspan">{this.state.user.repositoriesContributedToCount}</span>
        </div>
      </div>
    );
  }
  getGithubStats() {
    return (
      <div className="statsChild">
        <div className="stat item" title="Followers">
          <img
            className="statspan"
            alt="Followers"
            width="48"
            height="48"
            src={followerIcon}
          />
          <span className="statspan">{this.state.user.followersCount}</span>
        </div>
        <div className="stat item" title="Stars">
          <img
            className="statspan"
            alt="Stars"
            src="https://img.icons8.com/doodle/48/000000/star--v1.png"
          />
          <span className="statspan">{this.state.user.starredRepositoriesCount}</span>
        </div>
        <div className="stat item" title="Following">
          <img
            className="statspan"
            src={followingIcon}
            width="48"
            height="48"
            alt="Following"
          />
          <span className="statspan">{this.state.user.followingCount}</span>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="App">
        <div className="noise" />
        <div className="profile">
          <img
            src={this.state.user.avatarUrl}
            alt="GrayHat12"
            width="280"
            title={this.state.user.name}
            height="280"
            onClick={this.profileClicked}
            className="profile image"
          />
          <img className="profile avalibility" />
        </div>
        <div
          className={this.state.animation}
          onAnimationEnd={this.animationEnded}
        >
          <div className="userStat">
            <a
              className="username"
              href="https://github.com/GrayHat12"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span title="username">{this.state.user.name}</span>
            </a>
            <span className="userstatus" title="Status">
              {this.state.user.status}
            </span>
          </div>
          {this.getGithubChildren()}
        </div>
      </div>
    );
  }
}

export default App;