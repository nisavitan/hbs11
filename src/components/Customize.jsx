import React from 'react'

export default class Customize extends React.Component {
  constructor(props) {
    super(props)
    this.state = { pitchColor: 'green', tempRivalPlayer:'' }
  }

  toggleTacticMenu = () => {
    const tacticButton = document.querySelector('.Tactic')
    if (tacticButton.classList.contains('expanded')) {
      // Collapse menu
      tacticButton.classList.remove('expanded')
    } else {
      // Expand menu
      tacticButton.classList.add('expanded')
      this.outsideClickHandler(tacticButton)
    }
  }

  toggleColorMenu = () => {
    const colorButton = document.querySelector('.Pitch-style')
    if (colorButton.classList.contains('expanded')) {
      // Collapse menu
      colorButton.classList.remove('expanded')
    } else {
      // Expand menu
      colorButton.classList.add('expanded')
      this.outsideClickHandler(colorButton)
    }
  }

  toggleHomeClubMenu = () => {
    const clubHomeButton = document.querySelector('.HomeClub')
    if (clubHomeButton.classList.contains('expanded')) {
      // Collapse menu
      clubHomeButton.classList.remove('expanded')
    } else {
      // Expand menu
      clubHomeButton.classList.add('expanded')
      this.outsideClickHandler(clubHomeButton)
    }
  }

  toggleAwayClubMenu = () => {
    const clubAwayButton = document.querySelector('.AwayClub')
    if (clubAwayButton.classList.contains('expanded')) {
      // Collapse menu
      clubAwayButton.classList.remove('expanded')
    } else {
      // Expand menu
      clubAwayButton.classList.add('expanded')
      this.outsideClickHandler(clubAwayButton)
    }
  }

  toggleLeagueTypeMenu = () =>
  {
    const leagueTypeButton = document.querySelector('.LeagueType')
    if (leagueTypeButton.classList.contains('expanded')) {
      // Collapse menu
      leagueTypeButton.classList.remove('expanded')
    } else {
      // Expand menu
      leagueTypeButton.classList.add('expanded')
      this.outsideClickHandler(leagueTypeButton)
    }
  }

  addRivalPlayer = (playerName) =>
  {
    this.props.addRivalPlayer(playerName)
    this.setState({tempRivalPlayer:''})
  }



  setColor = color => {
    const palette = {
      green: "#2E7D32",
      red: "#921616",
      blue: "#303F9F",
      black: "#212121"
    }
    // Apply color change
    const pitch = document.querySelector('.Pitch')
    pitch.style.background = palette[color]
    // Save color change
    this.setState({ pitchColor: color })
    // Disable direct download
    if (this.props.playersList.length === 11 && this.props.showAwayClubLogo && this.props.showHomeClubLogo) {
      this.props.markDownloadAsObsolete()
    }
  }

  outsideClickHandler = button => {
    document.addEventListener('click', e => {
      const isClickInside = button.contains(e.target);
      if (!isClickInside) {
        // User clicked outside
        if (button.classList.contains('Tactic') && button.classList.contains('expanded')) {
          // Collapse tactic menu
          e.preventDefault()
          this.toggleTacticMenu()
        } else if (button.classList.contains('Pitch-style') && button.classList.contains('expanded')) {
          // Collapse tactic menu
          e.preventDefault()
          this.toggleColorMenu()
        }
        else if (button.classList.contains('HomeClub') && button.classList.contains('expanded')) {
          // Collapse tactic menu
          e.preventDefault()
          this.toggleHomeClubMenu()
        }
        else if (button.classList.contains('AwayClub') && button.classList.contains('expanded')) {
          // Collapse tactic menu
          e.preventDefault()
          this.toggleAwayClubMenu()
        }
      }
    });
  }

  render() {
    let DownloadButton = null
    if (this.props.downloadStatus === "disabled") {
      DownloadButton = <a
      title="Generate lineup"
      className="CTA disabled"
    ><p className="mobileCTA">{this.props.activeScreen === "line_up" ? "בחר 11 שחקנים על מנת לייצר הרכב" : "הורד תמונה"}</p></a>
    } else if (this.props.downloadStatus === "create") {
      DownloadButton = <a
        title="Generate lineup"
        className="CTA"
        onClick={() => {
          // Display loading message
          this.props.createCanvas()
        }}
      >הורד תמונה</a>
    } else if (this.props.downloadStatus === "loading") {
      DownloadButton = <a
        title="Generate lineup"
        className="CTA disabled"
      > יוצר הרכב...</a>
    } else {
      DownloadButton = <a
        title="Generate lineup"
        className="CTA"
        download={this.props.downloadName}
        href={this.props.downloadLink}
      >הורד הרכב</a>
    }
    const getHomeClubsList = () => {
      return (
        Object.keys(this.props.clubsList).map((key) => {
          return <ol onClick={() => { this.props.setHomeClub(key, this.props.clubsList[key]) }}><li className="homeTeam">{key}</li></ol>
        })
      )
    }

    const getAwayClubsList = () => {
      return (
        Object.keys(this.props.clubsList).map((key) => {
          return <ol onClick={() => { this.props.setAwayClub(key, this.props.clubsList[key]) }}><li className="awayTeam">{key}</li></ol>
        })
      )
    }

    const getLeagueTypeList = () => {
      return (
        Object.keys(this.props.leagueTypeList).map((key) => {
          return <ol onClick={() => { this.props.setLeagueType(key, this.props.leagueTypeList[key]) }}><li className="leagueType">{key}</li></ol>
        })
      )
    }
    

    



if (this.props.activeScreen === 'line_up')
{
  return (

    <div className="Customize">
      <section class="carousel" aria-label="Gallery">
        <div class="carousel__viewport" >

      <div className="Tactic Menu carousel__slide" id="carousel__slide1" tabindex="0"  onClick={() => { this.toggleTacticMenu() }}  >
      
              <ol className="Options" id="tacticMobile">
                <li className="tactics" data-tactic="4-3-3" onClick={() => { this.props.setActiveTactic('4-3-3') }}>4-3-3</li>
                <li className="tactics" data-tactic="3-5-2" onClick={() => { this.props.setActiveTactic('3-5-2') }}>3-5-2</li>
                <li className="tactics" data-tactic="4-2-3-1" onClick={() => { this.props.setActiveTactic('4-2-3-1') }}>4-2-3-1</li>
                <li className="tactics" data-tactic="4-4-2" onClick={() => { this.props.setActiveTactic('4-4-2') }}>4-4-2</li>
              </ol>
            <p className="Selected">{this.props.activeTacticName}</p>
            <div class="carousel__snapper">
                <a href="#carousel__slide4"
                  class="carousel__prev"></a>
                <a href="#carousel__slide2"
                  class="carousel__next"></a>
      </div>
      </div>


      <div   id="homeMedia carousel__slide2"  className="HomeClub Menu carousel__slide" tabindex="0" onClick={() => { this.toggleHomeClubMenu() }} >
                <div className="Options">
                  {getHomeClubsList()}
                </div>
                <p className="Selected">{`${this.props.homeClub}`}</p>
                <div class="carousel__snapper"></div>
                  <a href="#carousel__slide1"
                    class="carousel__prev"></a>
                  <a href="#carousel__slide3"
                    class="carousel__next"></a>
      </div>


      <div id="awayMedia carousel__slide3"  className="AwayClub Menu carousel__slide"   tabindex="0" onClick={() => { this.toggleAwayClubMenu() }}    >
                <div className="Options">
                  {getAwayClubsList()}
                </div>
              <p className="Selected">{`${this.props.awayClub}`}</p>
              <div class="carousel__snapper"></div>
                <a href="#carousel__slide3"
                  class="carousel__prev"></a>
                <a href="#carousel__slide1"
                  class="carousel__next"></a>
      </div>



      </div>
      </section>
      {DownloadButton}
    </div>
  )
}
else if (this.props.activeScreen === 'final')
{
  return (
    <div className="Customize">
      <div
        id="homeMedia"
        className="HomeClub Menu"
        onClick={() => { this.toggleHomeClubMenu() }}
      >
        <div className="Options">
          {getHomeClubsList()}
        </div>
        <p className="Selected">{`${this.props.homeClub}`}</p>
      </div>
      <div
        id="awayMedia"
        className="AwayClub Menu"
        onClick={() => { this.toggleAwayClubMenu() }}
      >
        <div className="Options">
          {getAwayClubsList()}
        </div>
        <p className="Selected">{`${this.props.awayClub}`}</p>
      </div>
      {DownloadButton}
    </div>
  )
}else if (this.props.activeScreen == "line_up_list")
{
  return (
    <div className="Customize">
      <div
        id="homeMedia"
        className="HomeClub Menu"
        onClick={() => { this.toggleHomeClubMenu() }}
      >
        <div className="Options">
          {getHomeClubsList()}
        </div>
        <p className="Selected">{`${this.props.homeClub}`}</p>
      </div>
      <div
        id="awayMedia"
        className="AwayClub Menu"
        onClick={() => { this.toggleAwayClubMenu() }}
      >
        <div className="Options">
          {getAwayClubsList()}
        </div>
        <p className="Selected">{`${this.props.awayClub}`}</p>
      </div>
      {DownloadButton}
    </div>
  )
}
else if (this.props.activeScreen == "double_list")
{
  return (
    <div className="Customize">
      <div  id="homeMedia" className="HomeClub Menu"  onClick={() => { this.toggleHomeClubMenu() }}    >
        <div className="Options">
          {getHomeClubsList()}
        </div>
        <p className="Selected">{`${this.props.homeClub}`}</p>
      </div>
      <div
        id="awayMedia"
        className="AwayClub Menu"
        onClick={() => { this.toggleAwayClubMenu() }}
      >
        <div className="inputRivalPlayersContainer">
          <input className="inputRivalPlayer" value={this.state.tempRivalPlayer} placeholder="שם שחקן" onChange={(e)=>{this.setState({tempRivalPlayer:e.target.value})}}></input>
          <button className="buttonRivalPlayer" onClick={()=>{this.addRivalPlayer(this.state.tempRivalPlayer)}}>הוסף</button>
        </div>
        <div className="Options">
          {getAwayClubsList()}
        </div>
        <p className="Selected">{`${this.props.awayClub}`}</p>
      </div>
      


      <div
        id="leagueType"
        className="LeagueType Menu"
        onClick={() => { this.toggleLeagueTypeMenu() }}
      >
        <div className="Options">
          {getLeagueTypeList()}
        </div>
        <p className="Selected">{`${this.props.leagueType}`}</p>
      </div>
      {DownloadButton}
    </div>
  )
}

  }
}

