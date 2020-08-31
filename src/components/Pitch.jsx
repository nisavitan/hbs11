import React from "react";
import ReactDOM from "react-dom";
import PlayerCard from "./PlayerCard.jsx";
import PositionIndicator from "./PositionIndicator.jsx";

// Cache pitch image for offline use
import ClubsLogo from "./ClubLogo.jsx";
import Referee from "./Referee.jsx";



export default class Pitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      occupiedPositions: [],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.getPitchCoords);
    this.getPitchCoords();
    // this.setState({ lineupName: "" });
    // Hide lineup name field on every click outside of it
    // document.addEventListener("touchstart", e => {
    //   if (e.target !== document.querySelector(".EditLineupName")) {
    //     this.props.hideNameInput();
    //   }
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    // Only trigger if tactic is changed
    if (this.props.activeScreen != prevProps.activeScreen)
      this.ResetPosition()

    if (this.props.tactic !== prevProps.tactic) {
      // Save occupied positions before rearranging positions
      const lockedOccupiedPositions = Array.from(this.state.occupiedPositions);
      for (const position of lockedOccupiedPositions) {
        const cardToMove = document.querySelector(
          `[data-active-position='${position}']`
        );
        this.unoccupyPosition(position);
        this.positionPlayer(position, cardToMove.classList[1]);
      }
    }
  }

  getPitchCoords = () => {
    const frame = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.setState({ frame });
  };

  // editLineupName = e => {
  //   this.setState({
  //     lineupName: e.target.value
  //   })
  //   // Disable direct download
  //   if (this.props.playersList.length === 11) {
  //     this.props.markDownloadAsObsolete()
  //   }
  // }


  ResetPosition = ()=>
  {
    console.log("Dsdsds ")
    this.setState({
      occupiedPositions:[]
    })
  }
  occupyPosition = position => {
    if (typeof (this.state.occupiedPositions.find(e => e === position)) === "undefined") {
      let newPositions = this.state.occupiedPositions
      newPositions.push(position)
      this.setState({
        occupiedPositions: newPositions
      })
    }
  }

  unoccupyPosition = position => {
    let newPositions = this.state.occupiedPositions
    // Delete selected position from array
    for (let i = 0; i < this.state.occupiedPositions.length; i++) {
      if (this.state.occupiedPositions[i] === position) {
        newPositions.splice(i, 1)
      }
    }
    this.setState({ occupiedPositions: newPositions })
  }

  positionPlayer = (position, selector) => {
    const card = document.querySelector(`.${selector}`)
    // Position card
    if (!this.props.tactic[position])
      {
        console.log(this.props.tactic, position, selector)
        return
      }
    card.style.left = `${this.props.tactic[position].x - 8.5}%`
    card.style.top = `${this.props.tactic[position].y - 7.5}%`
    card.style.transform = 'unset'
    // Update data
    this.occupyPosition(position)
    card.dataset.activePosition = position
    // Disable direct download
    if (this.props.playersList.length === 11) {
      this.props.markDownloadAsObsolete()
    }
  }

  // showNameInput = () => {
  //   if (window.innerWidth >= 910 || document.querySelectorAll(".Result-player").length >= 0) {
  //     document.querySelector(".EditLineupName").focus()
  //     document.querySelector(".EditLineupName").style.opacity = "1 !important"
  //   }
  // }


  render() {
    // Create skeleton
    if (this.props.activeScreen == "line_up") {
      // this.props.playersList 
      return (
        <div className="Pitch">
          <img className="Outlines" src={this.props.pitchImage} alt="Pitch outlines" />
          <div>
            <div className="Trash">להסרת השחקן גרור מחוץ למגרש</div>
            {Object.keys(this.props.tactic).map(positionKey => {
              return (
                <PositionIndicator
                  key={positionKey}
                  position={positionKey}
                  leftValue={`${this.props.tactic[positionKey].x}%`}
                  topValue={`${this.props.tactic[positionKey].y}%`}
                  occupied={
                    typeof (this.state.occupiedPositions.find(e => e === positionKey)) !== "undefined"
                  }
                />
              )
            })}
            {this.props.playersList.map(player => {
              return (
                <PlayerCard
                  player={player}
                  key={player.id}
                  tactic={this.props.tactic}
                  parentFrame={this.state.frame}
                  unselectPlayer={this.props.unselectPlayer}
                  occupiedPositions={this.state.occupiedPositions}
                  playersList={this.props.playersList}
                  occupyPosition={this.occupyPosition}
                  unoccupyPosition={this.unoccupyPosition}
                  positionPlayer={this.positionPlayer}
                  markDownloadAsObsolete={this.props.markDownloadAsObsolete}
                  portraitPlaceholder={this.props.portraitPlaceholder}
                />
              );
            })}
          </div>
          <ClubsLogo
            clubType="HOME"
            show={this.props.showHomeClubLogo}
            logo_src={this.props.HomeClubLogo}
            activeScreen={this.props.activeScreen}
          />
          <ClubsLogo
            clubType="AWAY"
            activeScreen={this.props.activeScreen}
            show={this.props.showAwayClubLogo}
            logo_src={this.props.AwayClubLogo}
          />
          <div className="mobSub">

            <input placeholder="מחליף" className="sub1 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub2 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub3 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub4 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub5 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub6 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub7 sub" type="text" name="name" />
          </div>
          <div className="gameinfo">
            <input placeholder="שופט ראשי" className="RefName" type="text" name="name" onChange={(e) => { this.setState({ "refName": e.target.value }) }} />
            <input placeholder="שעה" className="TimeName" type="text" name="name" onChange={(e) => { this.setState({ "TimeName": e.target.value }) }} />
            <input placeholder="אצטדיון" className="StadiumName" type="text" name="name" onChange={(e) => { this.setState({ "StadiumName": e.target.value }) }} />


          </div>

        </div>
      );
    }
    else if (this.props.activeScreen == "final") {
      return (
        <div className="Pitch">
          <img className="imgaeScore" src={this.props.ScoreBackgroundImage} alt="" />
          <img className="Outlines" src={this.props.pitchImage} alt="Pitch outlines" />
          <ClubsLogo
            clubType="HOME"
            show={this.props.showHomeClubLogo}
            logo_src={this.props.HomeClubLogo}
            activeScreen={this.props.activeScreen}

          />
          <ClubsLogo
            clubType="AWAY"
            show={this.props.showAwayClubLogo}
            logo_src={this.props.AwayClubLogo}
            activeScreen={this.props.activeScreen}

          />
          <input placeholder="0" className="HomeScore" type="text" name="name" onChange={(e) => { this.setState({ "HomeScore": e.target.value }) }} />
          <input placeholder="0" className="AwayScore" type="text" name="name" onChange={(e) => { this.setState({ "AwayScore": e.target.value }) }} />
        </div>
      );
    }
    else if (this.props.activeScreen == "line_up_list") {
      return (
        <div className="Pitch">
          <div className="PlayerList">
            {this.props.playersList && this.props.playersList.map((val) => {
              return (
                <div key={val.id} className="PlayerNameAndNubmer" onDoubleClick={()=>this.props.deletePlayer(val,this.props.playersList,"playersList")}>
                  <p>{val.fullname}</p>
                  <p className="playeNumber">{val.rating}</p>
                </div>)
            })}
          </div>
          <div className="mobSub">

            <input placeholder="מחליף" className="sub1 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub2 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub3 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub4 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub5 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub6 sub" type="text" name="name" />
            <input placeholder="מחליף" className="sub7 sub" type="text" name="name" />
          </div>
          <div className="gameinfo">
            <input placeholder="שופט ראשי" className="RefName" type="text" name="name" onChange={(e) => { this.setState({ "refName": e.target.value }) }} />
            <input placeholder="שעה" className="TimeName" type="text" name="name" onChange={(e) => { this.setState({ "TimeName": e.target.value }) }} />
            <input placeholder="אצטדיון" className="StadiumName" type="text" name="name" onChange={(e) => { this.setState({ "StadiumName": e.target.value }) }} />


          </div>
          <img className="Outlines" src={this.props.pitchImage} alt="Pitch outlines" />
          <ClubsLogo
            clubType="HOME"
            show={this.props.showHomeClubLogo}
            logo_src={this.props.HomeClubLogo}
            activeScreen={this.props.activeScreen}

          />
          <ClubsLogo
            clubType="AWAY"
            show={this.props.showAwayClubLogo}
            logo_src={this.props.AwayClubLogo}
            activeScreen={this.props.activeScreen}

          />

        </div>
      );

    }
    else if (this.props.activeScreen == "double_list") {
      return (
        <div className="Pitch">
          <div className={this.props.playerListHbs}>
            {this.props.playersList && this.props.playersList.map((val) => {
              return (
                <div key={val.id} className="PlayerNameAndNubmer" onDoubleClick={()=>this.props.deletePlayer(val,this.props.playersList,"playersList")}>
                  <p>{val.fullname}</p>
                  <p className="playeNumber">{val.rating}</p>
                </div>)
            })}
          </div>
          <div className={this.props.playerListCNAway}>
          {this.props.rivalPlayerList && this.props.rivalPlayerList.map((val,k) => {
              return (
                <div key={k} className="PlayerNameAndNubmer" onDoubleClick={()=>this.props.deletePlayer(val,this.props.rivalPlayerList,"rivalPlayerList")}>
                  <p >{val}</p>
                </div>)
            })}
          </div>
          <div className="gameinfo">  
            <input placeholder="שופט ראשי" className="RefName" type="text" name="name" onChange={(e) => { this.setState({ "refName": e.target.value }) }} />
            <input placeholder="שעה" className="TimeName" type="text" name="name" onChange={(e) => { this.setState({ "TimeName": e.target.value }) }} />
            <input placeholder="אצטדיון" className="StadiumName" type="text" name="name" onChange={(e) => { this.setState({ "StadiumName": e.target.value }) }} />


          </div>
          <img className="Outlines" src={this.props.pitchImage} alt="Pitch outlines" />
          <ClubsLogo
            clubType="HOME"
            show={this.props.showHomeClubLogo}
            logo_src={this.props.HomeClubLogo}
            activeScreen={this.props.activeScreen}

          />
          <ClubsLogo
            clubType="AWAY"
            show={this.props.showAwayClubLogo}
            logo_src={this.props.AwayClubLogo}
            activeScreen={this.props.activeScreen}
          />
          <img className="LeagueType" src={this.props.leagueTypeData}/>
        </div>
      );
    }

  }
}
