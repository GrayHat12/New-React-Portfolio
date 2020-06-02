import React from "react";
import "../css/Repositories.css";
import { ReposQuery } from "../utility/queries";
import secret from "../settings/secret.json";
import axios from "axios";

class Repositories extends React.Component {
  state = {
    repoListData: [],
    loadComplete: false,
    selectedRepo: null,
  };
  constructor(props) {
    super(props);
    this.generateRepoListHtm = this.generateRepoListHtm.bind(this);
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
      data: { query: ReposQuery, variables: {} },
    })
      .then((val) => {
        try {
          val = val.data.data.user.repositories.nodes;
          var reposData = [];
          for (var i = 0; i < val.length; i++) {
            var repo = {
              createdAt: val[i].createdAt,
              description: val[i].description,
              forkCount: val[i].forkCount,
              homepageUrl: val[i].homepageUrl,
              isFork: val[i].isFork,
              isPrivate: val[i].isPrivate,
              forks : val[i].forkCount,
              commits : val[i].object.history.totalCount,
              isTemplate: val[i].isTemplate,
              stargazers : val[i].stargazers.totalCount,
              name: val[i].name,
              languages: val[i].languages.nodes,
              nameWithOwner: val[i].nameWithOwner,
              url: val[i].url,
            };
            reposData.push(repo);
          }
          this.setState({
            repoListData: reposData,
            loadComplete: true,
          });
          this.clickedRepoItem(reposData.length - 1);
        } catch (ex) {
          console.error(ex);
        }
      })
      .catch(console.error);
  }
  clickedRepoItem(index) {
    var repo = this.state.repoListData[index];
    var createdDate = repo.createdAt.split("T")[0].split("-"); //YYYY-MM-DD format
    var name = repo.name;
    var matches = name.match(/^(\w)|-(\w)|([A-Z])/g);
    var acronym = matches.join("");
    acronym = acronym.replace(/-/g,'');
    var selectedRepo = (
      <div className="RestScreen">
        <div className="imageDiv">
        <div className="starsDiv" title={repo.stargazers+" Stars"}>
          <img className="starImg" alt="stars" src="https://img.icons8.com/doodle/48/000000/star--v1.png"/>
          <div className="starTxt">{repo.stargazers}</div>
        </div>
        <div className="forksDiv" title={repo.forks+" Forks"}>
          <img className="forkImg" alt="forks" src="https://img.icons8.com/ultraviolet/48/000000/pull-request.png"/>
          <div className="forkTxt">{repo.forks}</div>
        </div>
        <div className="commitsDiv" title={repo.commits+" Commits"}>
          <img className="commitImg" alt="commits" src="https://img.icons8.com/dusk/48/000000/commit-git.png"/>
          <div className="commitTxt">{repo.commits}</div>
        </div>
        <img
          className="repoImage"
          alt="repoImage"
          src={`https://dummyimage.com/220/9233E3/ffffff.png&text=${acronym.slice(0,2).toUpperCase()}`}
          title={name}
        />
        </div>
      </div>
    );
    this.setState({
      selectedRepo: selectedRepo,
    });
  }
  generateRepoListHtm() {
    var outp = [];
    for (var i = this.state.repoListData.length - 1; i >= 0; i--) {
      var listitem = (
        <li
          title={this.state.repoListData[i].name}
          className="repoItem"
          index={`${i}`}
          onClick={this.clickedRepoItem.bind(this, i)}
          key={i}
        >
          {this.state.repoListData[i].isFork ? (
            <img
              title="forked"
              index={`${i}`}
              alt="forked"
              className="repoItemRight"
              src="https://img.icons8.com/ultraviolet/21/000000/pull-request.png"
            ></img>
          ) : (
            <span
              className="repoItemRight"
              index={`${i}`}
              title={
                this.state.repoListData[i].isPrivate ? "Private" : "Public"
              }
            >
              {this.state.repoListData[i].isPrivate ? "🔴" : "🟢"}
            </span>
          )}
          <span index={`${i}`} className="repoItemLeft">
            {this.state.repoListData[i].nameWithOwner}
          </span>
        </li>
      );
      outp.push(listitem);
    }
    return outp;
  }
  render() {
    return (
      <div className="repos">
        <div className="Sidebar">
          <div className="title">
            <span>REPOSITORIES</span>
          </div>
          <ol className="repoList">
            {this.state.loadComplete ? this.generateRepoListHtm() : null}
          </ol>
        </div>
        {this.state.selectedRepo}
      </div>
    );
  }
}

export default Repositories;
