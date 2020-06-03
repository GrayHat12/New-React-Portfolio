import React from "react";
import "../css/Repositories.css";
import { ReposQuery } from "../utility/queries";
import secret from "../settings/secret.json";
import axios from "axios";
import collaborationImage from "../assets/svg/work.svg";
import loadingAnim from "../assets/svg/810.svg";

class Repositories extends React.Component {
  state = {
    repoListData: [],
    loadComplete: false,
    selectedIndex: 0,
    selectedRepo: null,
    filters: null,
  };
  constructor(props) {
    super(props);
    this.generateRepoListHtm = this.generateRepoListHtm.bind(this);
    this.getLanguages = this.getLanguages.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }
  componentDidMount() {
    var url = "https://api.github.com/graphql";
    document.getElementsByTagName("title")[0].text = secret.github_username;
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
              homepageUrl: val[i].homepageUrl,
              isFork: val[i].isFork,
              isPrivate: val[i].isPrivate,
              deployments: val[i].deployments.totalCount,
              diskUsage: val[i].diskUsage,
              releases: val[i].releases.totalCount,
              issues: val[i].issues.totalCount,
              forks: val[i].forks.totalCount,
              commits: val[i].object.history.totalCount,
              isTemplate: val[i].isTemplate,
              stargazers: val[i].stargazers.totalCount,
              name: val[i].name,
              collabs: val[i].collaborators.totalCount,
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
  getLanguages(repo) {
    var langs = [];
    for (var i = 0; i < repo.languages.length; i++) {
      var lang = (
        <span
          key={i}
          className="language"
          title={repo.languages[i].name}
          style={{ backgroundColor: repo.languages[i].color }}
        >
          {repo.languages[i].name}
        </span>
      );
      langs.push(lang);
    }
    return langs;
  }
  clickedRepoItem(index) {
    var repo = this.state.repoListData[index];
    var name = repo.name;
    document.getElementsByTagName("title")[0].text = secret.github_username+"/"+name;
    var selectedRepo = (
      <div className="RestScreen">
        <div className="imageDiv">
          <div className="starsDiv stat" title={repo.stargazers + " Stars"}>
            <img
              className="starImg"
              alt="stars"
              src="https://img.icons8.com/doodle/48/000000/star--v1.png"
            />
            <div className="starTxt">{repo.stargazers}</div>
          </div>
          <div className="forksDiv stat" title={repo.forks + " Forks"}>
            <img
              className="forkImg"
              alt="forks"
              src="https://img.icons8.com/ultraviolet/48/000000/pull-request.png"
            />
            <div className="forkTxt">{repo.forks}</div>
          </div>
          <div className="commitsDiv stat" title={repo.commits + " Commits"}>
            <img
              className="commitImg"
              alt="commits"
              src="https://img.icons8.com/dusk/48/000000/commit-git.png"
            />
            <div className="commitTxt">{repo.commits}</div>
          </div>
          <div
            className="langsDiv"
            title={repo.languages.length + " Languages"}
          >
            {this.getLanguages(repo)}
          </div>
          <div className="issuesDiv stat" title={repo.issues + " Issues"}>
            <img
              className="issueImg"
              alt="issues"
              src="https://img.icons8.com/fluent/48/000000/error.png"
            />
            <div className="issueTxt">{repo.issues}</div>
          </div>
          <div className="memoryDiv stat" title={repo.diskUsage + " KB"}>
            <img
              className="memoryImg"
              alt="memory in KB"
              src="https://img.icons8.com/office/48/000000/memory-slot.png"
            />
            <div className="memoryTxt">{repo.diskUsage + " KB"}</div>
          </div>
          <div
            className="collabsDiv stat"
            title={repo.collabs + " Contributors"}
          >
            <img
              className="collabImg"
              alt="Total Contributors"
              width="48"
              height="48"
              src={collaborationImage}
            />
            <div className="collabTxt">{repo.collabs}</div>
          </div>
          {repo.homepageUrl == null ? (
            <img
              className="repoImage noLink"
              alt="repoImage"
              src={`https://loremflickr.com/220/220/pets?random=${new Date()}`}
              title={name}
            />
          ) : (
            <a
              href={repo.homepageUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                className="repoImage withLink"
                alt="repoImage"
                src={`https://loremflickr.com/220/220/pets?random=${new Date()}`}
                title={name}
              />
            </a>
          )}
          <div className="githubDiv" title={repo.nameWithOwner}>
            <a
              href={repo.url}
              target="_blank"
              title={repo.nameWithOwner}
              rel="noopener noreferrer"
            >
              <img
                className="githubImg"
                alt="issues"
                src="https://img.icons8.com/color/48/000000/github-2.png"
              />
            </a>
          </div>
        </div>
      </div>
    );
    this.setState({
      selectedRepo: selectedRepo,
      selectedIndex: index,
    });
  }
  generateRepoListHtm() {
    var outp = [];
    for (var i = this.state.repoListData.length - 1; i >= 0; i--) {
      if (this.state.filters != null) {
        if (
          this.state.filters === 0 &&
          (this.state.repoListData[i].isPrivate === true || this.state.repoListData[i].isFork === true)
        )
          continue;
        if (
          this.state.filters === 1 &&
          this.state.repoListData[i].isPrivate === false
        )
          continue;
        if (
          this.state.filters === 2 &&
          this.state.repoListData[i].isFork === false
        )
          continue;
      }
      var listitem = (
        <li
          title={this.state.repoListData[i].name}
          className={
            this.state.selectedIndex === i ? "repoItem selected" : "repoItem"
          }
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
              src="https://img.icons8.com/ultraviolet/16/000000/pull-request.png"
            ></img>
          ) : (
            <span
              className="repoItemRight"
              index={`${i}`}
              title={
                this.state.repoListData[i].isPrivate ? "Private" : "Public"
              }
            >
            <img src={this.state.repoListData[i].isPrivate?"https://img.icons8.com/emoji/16/000000/red-circle-emoji.png":"https://img.icons8.com/emoji/16/000000/green-circle-emoji.png"}
            alt={this.state.repoListData[i].isPrivate ? "Private" : "Public"}/>
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
  changeFilter(event) {
    event.persist();
    if (event.target.value === "Public" && this.state.filters === 0) {
      this.setState({
        filters: null,
      });
      return;
    }
    if (event.target.value === "Private" && this.state.filters === 1) {
      this.setState({
        filters: null,
      });
      return;
    }
    if (event.target.value === "Forked" && this.state.filters === 2) {
      this.setState({
        filters: null,
      });
      return;
    }
    this.setState({
      filters:
        event.target.value === "Public"
          ? 0
          : event.target.value === "Private"
          ? 1
          : 2,
    });
  }
  render() {
    return (
      <div className="repos">
        {this.state.loadComplete ? (
          <div className="Sidebar">
            <div className="title">
              <span>REPOSITORIES</span>
              <div className="filters">
                <input
                  type="checkbox"
                  className="check"
                  onChange={this.changeFilter}
                  checked={this.state.filters === 0 ? true : false}
                  value="Public"
                />
                <label className="inputLabel">Public</label>
                <input
                  type="checkbox"
                  className="check"
                  onChange={this.changeFilter}
                  checked={this.state.filters === 1 ? true : false}
                  value="Private"
                />
                <label className="inputLabel">Private</label>
                <input
                  type="checkbox"
                  className="check"
                  onChange={this.changeFilter}
                  checked={this.state.filters === 2 ? true : false}
                  value="Forked"
                />
                <label className="inputLabel">Forked</label>
              </div>
            </div>
            <ol className="repoList">
              {this.state.loadComplete ? this.generateRepoListHtm() : null}
            </ol>
          </div>
        ) : (
          <img src={loadingAnim} className="loading" alt="Loading" />
        )}
        {this.state.selectedRepo}
      </div>
    );
  }
}

export default Repositories;
