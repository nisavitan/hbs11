import React from "react";
import SearchResult from "./SearchResult.jsx";
import UploadsImage from './UploadsImage'


export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      isLoading: false,
      noMatches: false
    };
  }

  getPlayersData = searchValue => {
    let searchResults = [];
    // Only search if user input isn't null
    if (searchValue.length > 0) {
      // Find matching players from JSON players index
      const playerFilesPaths = [];
      const line_up_selected = this.props.selectedPlayers.map(val=>
        {return val.fullname})      
      for (const player in this.props.playersIndex) {
        const playerName = player.toLocaleLowerCase();
        // Store the 5 best matches
        if (playerName.includes(searchValue) && playerFilesPaths.length < 8 && !line_up_selected.includes(playerName)) {
          playerFilesPaths.push(this.props.playersIndex[player]);
          this.setState({ isLoading: false });
        }
      }
      // Display loading message if no results are found
      if (playerFilesPaths.length === 0 && !this.state.isLoading) {
        this.setState({
          noMatches: true,
          isLoading: false
        });
      }
      // Get relevant data from JSON files
      for (const playerFilePath of playerFilesPaths) {
        let playerFile = this.props.getPlayerFile(playerFilePath);
        playerFile.shortName = playerFile.name
          .split(" ")
          .slice(-1)
          .join(" ");
        searchResults.push(playerFile);
      }
      // Sort results by players ranking
      searchResults.sort((a, b) => {
        return b.rating - a.rating;
      });
    }
    this.props.setResults(searchResults);
  };

  updateSearch = e => {
    // Display loading message
    this.setState({
      value: e.target.value,
      noMatches: false,
      isLoading: true
    });
    // Prevent adding more than 11 players
    if (this.props.selectedPlayers.length < 11) {
      // Trigger search
      this.getPlayersData(
        e.target.value
          .toLocaleLowerCase()
          .normalize()
          .replace(/\s/g, "")
      );
    } else {
      this.setState({ isLoading: false });
    }
  };

  updateValue = newValue => {
    this.setState({ value: newValue });
  };


  render() {

    let customPlayer = {
      club: {
        logo: "./data/images/placeholders/logo.svg",
        name: "הפועל באר שבע"
      },
      id: this.state.value,
      name: this.state.value,
      positions: ["DD"],
      rating: "0",
      shortName: this.state.value
    };
    if (this.props.activeScreen == "line_up" || this.props.activeScreen == "line_up_list" || this.props.activeScreen == "double_list")
    {
      return (
        <div>
          <input
            className="Search-player"
            type="search"
            value={this.state.value}
            onFocus={() => {
              document.querySelector(".Results").style.display = "block";
            }}
            onChange={this.updateSearch}
            placeholder="הוסף שחקן"
            autoFocus
          />
          <div
            className="Results"
            style={{
              height: this.state.value.length > 0 ? "auto" : "0"
            }}
          >
            {this.state.noMatches && (
              <div className="Result-player">
                <p className="Status">לא נמצא שחקן בשם</p>
              </div>
            )}
            {this.props.selectedPlayers.length < 11 &&
              this.state.value !== "" &&
              this.props.results.map(player => (
                // Create result list from search results
                <SearchResult
                  player={player}
                  selectPlayer={this.props.selectPlayer}
                  updateValue={this.updateValue}
                  key={`Result${player.id}`}
                  lastPlayerToAdd={this.props.selectedPlayers.length === 10}
                  logoPlaceholder={this.props.logoPlaceholder}
                  portraitPlaceholder={this.props.portraitPlaceholder}
                />
              ))}
            {this.state.isLoading && (
              // Display loading messages while waiting for results
              <div className="Result-player">
                <p className="Status">טוען שחקנים</p>
              </div>
            )}
            {this.props.selectedPlayers.length >= 11 && window.innerWidth > 910 && (
              <div className="Result-player">
                <p className="Status">לא ניתן להוסיף עוד שחקנים</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    else if (this.props.activeScreen == "final")
    {
      return  <UploadsImage
      setScoreBackImage={this.props.setScoreBackImage}
      />;
    }  
    else
    {
      return null
    }

  }
}
