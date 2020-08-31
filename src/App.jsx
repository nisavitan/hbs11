// Import components
import React from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import "./App.css";
import Search from "./components/Search.jsx";
import Customize from "./components/Customize.jsx";
import Pitch from "./components/Pitch.jsx";
import fonts from "./data/fonts.js";
import FinalResults from './components/Final'
import line_upImage from "./data/hapoel-lineup.png";
import scoreImage from "./data/final2.png";
import line_up_listImage from "./data/lineup-list.png";
import double_listImage from "./data/lineup-dubble.png";


// Import dependencies
const rasterizeHTML = require("rasterizehtml");
const computedToInline = require("computed-style-to-inline-style");


//import image backgrounds
// Save placeholder images for offline use
const portraitPlaceholder = require("./data/placeholders/portrait.svg");
const logoPlaceholder = require("./data/placeholders/logo.svg");


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeScreen: "line_up",
      playersIndex: require("./data/index.json"),
      clubsIndex: require("./data/clubs_index.json"),
      activeTactic: require("./tactics/4-3-3.json"),
      activeTacticName: " בחירת מערך",
      activeHomeClubName: "קבוצת מארחת",
      activeAwayClubName: "קבוצה אורחת",
      activeHomeClubData: "",
      showHomeClubLogo: false,
      showAwayClubLogo: false,
      fileBackups: {},
      selectedPlayers: [],
      selectedClubs: [],
      results: [],
      downloadStatus: "disabled",
      downloadLink: "",
      downloadName: "HBS-Lineup@Avivadv",
      rivalPlayerList : [],
      playerListHbs:'homeClubList',
      playerListCNAway:'awayClubList',
      leagueType:"בחירת מפעל",
      leagueTypeIndex: require("./data/league_index.json"),


    };
  }
  
  componentDidMount() {
    document.body.prepend(fonts.fontsStyle);
    window.scrollTo(0,1)  

  }



  setActiveTactic = tacticName => {
    let newTactic = require(`./tactics/${tacticName}.json`);
    this.setState({
      activeTactic: newTactic,
      activeTacticName: `מערך : ${tacticName}`
    });
    // Disable direct download
    if (this.state.selectedPlayers.length === 11) {
      this.markDownloadAsObsolete();
    }
  };

  addRivalPlayer = (playerName) =>
  {
    if (this.state.rivalPlayerList.length >= 11)
      return
    let rivalNewList = this.state.rivalPlayerList
    rivalNewList.push(playerName)
    this.setState({
      rivalPlayerList : rivalNewList
    },()=>{console.log(this.state.rivalPlayerList)})
  }

  setHomeClub = (homeClubName, homeClubData) => {
    let tempplayerListHbs,tempAwayplayerList
    console.log(homeClubName)
    if (homeClubName == "הפועל באר שבע")
    {
      tempplayerListHbs = 'homeClubList'
      tempAwayplayerList = 'awayClubList'

    }
    else
    {
      tempplayerListHbs = 'awayClubList'
      tempAwayplayerList = 'homeClubList'


    }
    this.setState({
      activeHomeClubName: `${homeClubName}`,
      activeHomeClubData: homeClubData,
      showHomeClubLogo: true,
      playerListHbs:tempplayerListHbs,
      playerListCNAway: tempAwayplayerList

      
    });
    if (this.state.ScoreBackgroundImage && this.state.showAwayClubLogo)
      this.setState(
        {
          downloadStatus : "create",
        })
  }

  setAwayClub = (awayClubName, awayClubData) => {
    this.setState({
      activeAwayClubName: `${awayClubName}`,
      activeAwayClubData: awayClubData,
      showAwayClubLogo: true
    });
    if (this.state.ScoreBackgroundImage && this.state.showHomeClubLogo)
    this.setState(
      {
        downloadStatus : "create",
      })
  }

  setLeagueType = (leagueName,leagueTypeData) => {
    console.log(leagueName, leagueTypeData)
    this.setState({
      leagueTypeData: leagueTypeData,
      leagueType:leagueName
    });
  }
   

  createCanvas = () => {


    // Loading message
    this.setState({ downloadStatus: "loading" })
    // Fix playerCard hover style by overriding inline styles
    const style = document.createElement("style")
    style.type = "text/css"
  //  style.innerText = ".PlayerCard {background: transparent !important;} .EditLineupName {opacity: 0 !important;}"
    document.body.appendChild(style)
    // Create canvas to draw pitch
    const canvas = document.createElement("canvas")
    const domPitch = document.querySelector(".field")
    const outLines = document.querySelector(".Outlines")
    const width = domPitch.getBoundingClientRect().width * 1.35
    canvas.width = width
    canvas.height = width
    // Reset Pitch transform to just before screenshot
    if (window.innerWidth <= 720) {
      domPitch.classList.remove("Transform")
      domPitch.style.transform = "unset"
    }
    const names = document.querySelectorAll(".PlayerCard p")
    for (const name of names) {
      name.style.fontSize = `${window.getComputedStyle(name).fontSize} !important`
    }
    domPitch.prepend(fonts.fontsStyle)
    computedToInline(domPitch, { recursive: true })
    // Revert Pitch transform back to normal
    if (window.innerWidth <= 720) {
      domPitch.classList.add("Transform")
    }
    rasterizeHTML.drawDocument(domPitch, { zoom: 2 })
      .then(renderResult => {
        // Create canvas
        const context = canvas.getContext("2d")
        context.drawImage(renderResult.image, 410, 30, width, width, -115, -140, width * 1.15, width * 1.15)
        // Prepare download
        this.setState({
          downloadStatus: "download",
          downloadLink: canvas.toDataURL("image/png"),

        })
        // Fix hover style on textedit
      //   const editLineupName = document.querySelector(".Pitch .EditLineupName")
      //   if (editLineupName){
      //   editLineupName.addEventListener("mouseenter", () => {
      //     style.innerText = `
      //       ${style.innerText}
      //       .Pitch .EditLineupName {opacity: 1 !important;}
      //     `
      //   })
      //   editLineupName.addEventListener("mouseleave", () => {
      //     style.innerText = `
      //       ${style.innerText}
      //       .Pitch .EditLineupName {opacity: 0 !important;}
      //     `
      //   })

      // }

      })
  }

  markDownloadAsObsolete = () => {
    this.setState({ downloadStatus: "create" })
  }

  removeFromIndex = playerName => {
    let newIndex = this.state.playersIndex
    delete newIndex[playerName]
    this.setState({ playersIndex: newIndex })
  }

  addToIndex = playerName => {
    let newIndex = this.state.playersIndex
    newIndex[playerName] = this.state.fileBackups[playerName]
    this.setState({ playersIndex: newIndex })
  }

  addToBackups = player => {
    let newBackups = this.state.fileBackups
    newBackups[player] = this.state.playersIndex[player]
    this.setState({ fileBackups: newBackups })
  }

  removeFromBackups = player => {
    let newBackups = this.state.fileBackups
    delete newBackups[player]
    this.setState({ fileBackups: newBackups })
  }

  getPlayerFile = playerFilePath => {
    if (playerFilePath === undefined)
      playerFilePath = "./data/players/vitor.json"
    const file = require(`${playerFilePath}`);
    return require(`${playerFilePath}`);
  };

  selectPlayer = playerObject => {
    // Focus Search if not all players were added
    if (this.state.selectedPlayers.length < 10) {
      document.querySelector(".Search-player").focus();
    }
    let newSelection = this.state.selectedPlayers;
    newSelection.push(playerObject);
    this.setState({ selectedPlayers: newSelection });
    // Remove selected player from index so it can't be added twice
    const formattedName = playerObject.name
      .replace(/\s/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    this.addToBackups(formattedName);
    this.removeFromIndex(formattedName);
    // Hide selected player from results
    let newResults = this.state.results;
    for (let i = 0; i < this.state.results.length; i++) {
      if (this.state.results[i] === playerObject) {
        newResults.splice(i, 1);
      }
    }
    this.setState({ results: newResults });
    // Prevent adding more than 11 players
    if (this.state.selectedPlayers.length > 10) {
      // Enable donwload button
      this.setState({ downloadStatus: "create" });
    }
    // Reset results
    this.setResults([]);

  };
  deletePlayer = (playerName, playerList,name) =>
  {
    let ax;
    ax = playerList.indexOf(playerName)
      playerList.splice(ax,1)
    this.setState({[name]:playerList})
  }
  unselectPlayer = playerObject => {
    let newSelection = this.state.selectedPlayers;
    for (let i = 0; i < this.state.selectedPlayers.length; i++) {
      if (this.state.selectedPlayers[i] === playerObject) {
        newSelection.splice(i, 1);
      }
    }
    this.setState({
      selectedPlayers: newSelection,
      downloadStatus: "disabled"
    });
    // Put player back in index
    const formattedName = playerObject.name
      .replace(/\s/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    this.addToIndex(formattedName);
    this.removeFromBackups(formattedName);
  };

  setResults = newResults => {
    this.setState({ results: newResults });
  };

  // hideNameInput = () => {
  //   // Remove focus on lineup name
  //   document.querySelector(".EditLineupName").style.opacity = "0 !important";
  //   document.querySelector(".EditLineupName").blur();

  // };
  getImageBackground = () =>
  {
    switch (this.state.activeScreen) {
      case "line_up":
          return line_upImage;
      case "final":
          return scoreImage;
      case "line_up_list":
        return line_up_listImage;
        case "double_list":
          return double_listImage;
      default:
        break;
    }
  }

  setScoreBackgroundImage = (imgSrc) =>
  {
    this.setState(
      {
        ScoreBackgroundImage : imgSrc,
      })
      if (this.state.showHomeClubLogo && this.state.showAwayClubLogo)
      this.setState(
        {
          downloadStatus : "create",
        })
      if (imgSrc == "")
      this.setState(
        {
          downloadStatus : "disabled",
        })
  }

  render() {
    return (
      
      <div className="BG">
        <div className="App">
          <div className="Modes">
            <ul>
              <li onClick={() => { this.setState({ activeScreen: "line_up",downloadName:"HBS-Lineup@Avivadv",downloadStatus : "disabled"} ) }} ><a ><img src="./data/images/icons/Lineup.svg" alt="lineup" /></a></li>
              <li onClick={() => { this.setState({ activeScreen: "line_up_list" }) }}><a ><img src="./data/images/icons/live.svg" alt="live" /></a></li>
              <li onClick={() => { this.setState({ activeScreen: "final" ,downloadName:"HBS-FinalScore@Avivadv",downloadStatus : "disabled"}) }}><a ><img src="./data/images/icons/score.svg" alt="final" /></a></li>
              <li onClick={() => { this.setState({ activeScreen: "double_list" }) }}><a ><img src="./data/images/icons/live.svg" alt="live" /></a></li>
            </ul>
          </div>
          <div>
            
            <div className="Settings">
              <Search
                playersIndex={this.state.playersIndex}
                addToIndex={this.addToIndex}
                removeFromIndex={this.removeFromIndex}
                addToBackups={this.addToBackups}
                removeFromBackups={this.removeFromBackups}
                getPlayerFile={this.getPlayerFile}
                fileBackups={this.state.fileBackups}
                selectedPlayers={this.state.selectedPlayers}
                selectPlayer={this.selectPlayer}
                setScoreBackImage={this.setScoreBackgroundImage}
                results={this.state.results}
                setResults={this.setResults}
                logoPlaceholder={logoPlaceholder}
                activeScreen={this.state.activeScreen}
                portraitPlaceholder={portraitPlaceholder}
              />

              <Customize
                tactic={this.state.activeTactic}
                activeTacticName={this.state.activeTacticName}
                setActiveTactic={this.setActiveTactic}
                playersList={this.state.selectedPlayers}
                clubsList={this.state.clubsIndex}
                setHomeClub={this.setHomeClub}
                setAwayClub={this.setAwayClub}
                homeClub={this.state.activeHomeClubName}
                downloadName={this.state.downloadName}
                awayClub={this.state.activeAwayClubName}
                markDownloadAsObsolete={this.markDownloadAsObsolete}
                downloadStatus={this.state.downloadStatus}
                createCanvas={this.createCanvas}
                activeScreen={this.state.activeScreen}
                rivalPlayerList={this.state.rivalPlayerList}
                addRivalPlayer={this.addRivalPlayer}
                downloadLink={this.state.downloadLink}
                leagueTypeList={this.state.leagueTypeIndex}
                leagueType= {this.state.leagueType}
                setLeagueType = {this.setLeagueType}
              />
            </div>
            <div className="field">
              <Pitch
                playersList={this.state.selectedPlayers}
                rivalPlayerList={this.state.rivalPlayerList}
                className="Pitch"
                unselectPlayer={this.unselectPlayer}
                tactic={this.state.activeTactic}
                markDownloadAsObsolete={this.markDownloadAsObsolete}
                portraitPlaceholder={portraitPlaceholder}
                pitchImage = {this.getImageBackground()}
                hideNameInput={this.hideNameInput}
                HomeClubLogo={this.state.activeHomeClubData}
                AwayClubLogo={this.state.activeAwayClubData}
                ScoreBackgroundImage = {this.state.ScoreBackgroundImage}
                showHomeClubLogo={this.state.showHomeClubLogo}
                activeScreen={this.state.activeScreen}
                showAwayClubLogo={this.state.showAwayClubLogo}
                playerListHbs={this.state.playerListHbs}
                playerListCNAway={this.state.playerListCNAway}
                deletePlayer = {this.deletePlayer}
                leagueTypeData={this.state.leagueTypeData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
