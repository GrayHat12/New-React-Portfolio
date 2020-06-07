import { PullReqQuery } from "../utility/queries";
import loadingAnim from "../assets/svg/810.svg";
import axios from "axios";
import "../css/PullReq.css";
import secret from "../settings/secret.json";
import React from "react";

class PullReq extends React.Component {
  state = {
    loadComplete: false,
    pullReqsData: [],
    filters: null,
    selectedIndex: 0,
    selectedRepo: null,
  };
  constructor(props) {
    super(props);
    this.changeFilter = this.changeFilter.bind(this);
    this.getLabels = this.getLabels.bind(this);
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
      data: { query: PullReqQuery, variables: {} },
    })
      .then((val) => {
        val = val.data;
        try {
          val = val.data.user.pullRequests.nodes;
          var prs = [];
          for (var i = 0; i < val.length; i++) {
            if (val[i].state === "CLOSED") continue;
            var pr = {
              additions: val[i].additions,
              authorAssociation: val[i].authorAssociation,
              changedFiles: val[i].changedFiles,
              closed: val[i].closed,
              deletions: val[i].deletions,
              merged: val[i].merged,
              repository: {
                name: val[i].repository.name,
                nameWithOwner: val[i].repository.nameWithOwner,
                url: val[i].repository.url,
                homepageUrl: val[i].repository.homepageUrl,
                stargazers: val[i].repository.stargazers.totalCount,
                forks: val[i].repository.forks.totalCount,
              },
              body: val[i].body,
              labels: val[i].labels,
              title: val[i].title,
              url: val[i].url,
              state: val[i].state,
            };
            prs.push(pr);
          }
          this.setState({
            loadComplete: true,
            pullReqsData: prs,
          });
          this.clickedPRItem(prs.length - 1);
        } catch (ex) {
          console.error(ex);
        }
      })
      .catch(console.error);
  }
  changeFilter(event) {
    event.persist();
    if (event.target.value === "OPENED" && this.state.filters === 0) {
      this.setState({
        filters: null,
      });
      return;
    }
    if (event.target.value === "MERGED" && this.state.filters === 1) {
      this.setState({
        filters: null,
      });
      return;
    }
    this.setState({
      filters: event.target.value === "OPENED" ? 0 : 1,
    });
  }
  getLabels(pr) {
    var labels = [];
    for (var i = 0; i < pr.labels.nodes.length; i++) {
      var labl = (
        <span
          key={i}
          className="label"
          title={pr.labels.nodes[i].name}
          style={{ backgroundColor: `#${pr.labels.nodes[i].color}` }}
        >
          {pr.labels.nodes[i].name}
        </span>
      );
      labels.push(labl);
    }
    return labels;
  }
  clickedPRItem(index) {
    var pr = this.state.pullReqsData[index];
    var name = pr.repository.name;
    document.getElementsByTagName("title")[0].text =
      secret.github_username + "~" + name;
    var selectedRepo = (
      <div className="RestScreen">
        <div className="imageDiv">
          <div className="starsDiv stat" title={pr.repository.stargazers + " Stars"}>
            <img
              className="starImg"
              alt="stars"
              src="https://img.icons8.com/doodle/48/000000/star--v1.png"
            />
            <div className="starTxt">{pr.repository.stargazers}</div>
          </div>
          <div className="forksDiv stat" title={pr.repository.forks + " Forks"}>
            <img
              className="forkImg"
              alt="forks"
              src="https://img.icons8.com/ultraviolet/48/000000/pull-request.png"
            />
            <div className="forkTxt">{pr.repository.forks}</div>
          </div>
          <div className="changesDiv stat" title={pr.changedFiles + " Changed Files"} >
            <img
              className="changesImg"
              alt="changes"
              src="https://img.icons8.com/color/48/000000/compare.png"
            />
            <div className="changesTxt">{pr.changedFiles}</div>
          </div>
          <div className="labelsDiv" title={pr.labels.nodes.length + " Labels"}>
            {this.getLabels(pr)}
          </div>
          <div className="deletionsDiv stat"
            title={pr.deletions + " Deletions"}
          >
            <img
              className="deletionImg"
              alt="deletions"
              src="https://img.icons8.com/cute-clipart/48/000000/delete-forever.png"
            />
            <div className="deletionTxt">{pr.deletions}</div>
          </div>
          <div className="additionsDiv stat"
            title={pr.additions + " Additions"}
          >
            <img
              className="additionImg"
              alt="additions"
              src="https://img.icons8.com/cute-clipart/48/000000/add-to-inbox.png"
            />
            <div className="memoryTxt">{pr.additions}</div>
          </div>
          <div className="assocsDiv stat"
            title={pr.authorAssociation + " Association"}
          >
            <img
              className="assocImg"
              alt="Association"
              width="48"
              height="48"
              src="https://img.icons8.com/fluent/48/000000/handshake.png"
            />
            <div className="assocTxt">{pr.authorAssociation}</div>
          </div>
          {pr.url == null ? (
            <img
              className="repoImage noLink"
              alt="repoImage"
              src={`https://loremflickr.com/220/220/pets?random=${new Date()}`}
              title={pr.title}
            />
          ) : (
            <a href={pr.url} rel="noopener noreferrer" target="_blank">
              <img
                className="repoImage withLink"
                alt="repoImage"
                src={`https://loremflickr.com/220/220/pets?random=${new Date()}`}
                title={pr.title}
              />
            </a>
          )}
          <div className="githubDiv" title={pr.repository.nameWithOwner}>
            <a
              href={pr.repository.url}
              target="_blank"
              title={pr.repository.nameWithOwner}
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
  generatePRListHtm() {
    var outp = [];
    for (var i = this.state.pullReqsData.length - 1; i >= 0; i--) {
      if (this.state.filters != null) {
        if (
          this.state.filters === 0 &&
          this.state.pullReqsData[i].state === "MERGED"
        )
          continue;
        if (
          this.state.filters === 1 &&
          this.state.pullReqsData[i].state === "OPEN"
        )
          continue;
      }
      var listitem = (
        <li
          title={this.state.pullReqsData[i].name}
          className={
            this.state.selectedIndex === i ? "prItem selected" : "prItem"
          }
          index={`${i}`}
          onClick={this.clickedPRItem.bind(this, i)}
          key={i}
        >
          <img
            title={
              this.state.pullReqsData[i].state === "OPEN" ? "OPEN" : "MERGED"
            }
            index={`${i}`}
            alt={
              this.state.pullReqsData[i].state === "OPEN" ? "OPEN" : "MERGED"
            }
            className="prItemRight"
            src={
              this.state.pullReqsData[i].state === "OPEN"
                ? "https://img.icons8.com/emoji/16/000000/red-circle-emoji.png"
                : "https://img.icons8.com/emoji/16/000000/green-circle-emoji.png"
            }
          ></img>
          <span index={`${i}`} className="repoItemLeft">
            {this.state.pullReqsData[i].repository.nameWithOwner}
          </span>
        </li>
      );
      outp.push(listitem);
    }
    return outp;
  }
  render() {
    return (
      <div className="pullreqs">
        {this.state.loadComplete ? (
          <div className="Sidebar">
            <div className="title">
              <span>PULL REQUESTS</span>
              <div className="filters">
                <input
                  type="checkbox"
                  className="check"
                  onChange={this.changeFilter}
                  checked={this.state.filters === 0 ? true : false}
                  value="OPENED"
                />
                <label className="inputLabel">OPENED</label>
                <input
                  type="checkbox"
                  className="check"
                  onChange={this.changeFilter}
                  checked={this.state.filters === 1 ? true : false}
                  value="MERGED"
                />
                <label className="inputLabel">MERGED</label>
              </div>
            </div>
            <ol className="pullreqList">
              {this.state.loadComplete ? this.generatePRListHtm() : null}
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
export default PullReq;
