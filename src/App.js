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
    statList: [],
    currentStat : 0,
    animateStatTask: null,
  };
  constructor(props = {}) {
    super(props);
    this.profileClicked = this.profileClicked.bind(this);
    this.animationEnded = this.animationEnded.bind(this);
    this.getGithubChildren = this.getGithubChildren.bind(this);
    this.getGithubStats = this.getGithubStats.bind(this);
    this.getSocials = this.getSocials.bind(this);
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
  componentWillUnmount() {
    clearInterval(this.state.animateStatTask);
  }
  profileClicked(event) {
    if(this.state.animation == 'nodiv') return;
    var currentStat = this.state.currentStat;
    currentStat += 1;
    currentStat = currentStat%3;
    this.setState({
      currentStat : currentStat
    });
    if (typeof event != 'undefined' && event!=null)event.preventDefault();
  }
  animationEnded(event) {
    var list = [];
    list.push(this.getGithubChildren);
    list.push(this.getGithubStats);
    list.push(this.getSocials);
    var t = setInterval(this.profileClicked,5000);
    this.setState({
      statList : list,
      currentStat : 0,
      animateStatTask : t
    });
    event.preventDefault();
  }
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
        <div className="stat item" title="Pull Requests">
          <img
            className="statspan"
            src="https://img.icons8.com/ultraviolet/48/000000/pull-request.png"
            alt="Pull Requests"
          />
          <span className="statspan">
            {this.state.user.pullRequestsCount}
          </span>
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
          <span className="statspan">
            {this.state.user.starredRepositoriesCount}
          </span>
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
  getSocials() {
    return(
      <div className="statsChild">
        <a href="https://discord.gg/SyycB82">
        <div className="stat item" title="Discord">
          <img
            className="statspan"
            alt="Discord"
            src="https://img.icons8.com/dusk/48/000000/discord-logo.png"
          />
          <span className="statspan">🟢</span>
        </div>
        </a>
        <a href={"https://twitter.com/"+this.state.user.twitterUsername}>
        <div className="stat item" title="Twitter">
          <img
            className="statspan"
            alt={this.state.user.twitterUsername}
            src="https://img.icons8.com/fluent/48/000000/twitter.png"
          />
          <span className="statspan">
            {this.state.user.twitterUsername}
          </span>
        </div>
        </a>
        <a href="https://www.paypal.me/deadGray">
        <div className="stat item" title="Sponsor">
          <img
            className="statspan"
            src="https://img.icons8.com/officel/48/000000/crowdfunding.png"
            alt="Sponsor"
          />
          <span className="statspan" role="img" aria-label="Sponsor Me">💲</span>
        </div>
        </a>
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
          <img
            className="avalibility"
            src={
              this.state.user.isHireable
                ? "https://img.icons8.com/emoji/48/000000/green-circle-emoji.png"
                : "https://img.icons8.com/emoji/48/000000/red-circle-emoji.png"
            }
            alt={this.state.user.isHireable?"available":"un-available"}
            title={this.state.user.isHireable?"Available":"Not Available"}
          />
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
              <span className="username" title="username">{this.state.user.name}</span>
            </a>
            <span className="userstatus" title="Status">
              {this.state.user.status}
            </span>
          </div>
          {this.state.statList.length>0?this.state.statList[this.state.currentStat]():null}
        </div>
      </div>
    );
  }
}

export default App;
