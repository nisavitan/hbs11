import React, { PureComponent } from 'react';
import scoreImage from "../data/hapoel-lineup.png";


class FinalResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    toggleHomeClubMenu = () => {
        const clubHomeButton = document.querySelector('.HomeClub')
        console.log(clubHomeButton)
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
        console.log(clubAwayButton)
        if (clubAwayButton.classList.contains('expanded')) {
            // Collapse menu
            clubAwayButton.classList.remove('expanded')
        } else {
            // Expand menu
            clubAwayButton.classList.add('expanded')
            this.outsideClickHandler(clubAwayButton)
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
        const getHomeClubsList = () => {
            return (
                Object.keys(this.props.clubsList).map((key) => {
                    return <div onClick={() => { this.props.setHomeClub(key, this.props.clubsList[key]) }}><p className="homeTeam">{key}</p></div>
                })
            )
        }

        const getAwayClubsList = () => {
            return (
                Object.keys(this.props.clubsList).map((key) => {
                    return <div onClick={() => { this.props.setAwayClub(key, this.props.clubsList[key]) }}><p className="awayTeam">{key}</p></div>
                })
            )
        }
        return (
            <div>
                <div className="Settings">
                    <div
                        ID="homeMedia"
                        className="HomeClub Menu"
                        onClick={() => { this.toggleHomeClubMenu() }}
                    >
                        <div className="Options">
                            {getHomeClubsList()}
                        </div>
                        <p className="Selected">{`${this.props.homeClub}`}</p>
                    </div>
                    <div
                        ID="awayMedia"
                        className="AwayClub Menu"
                        onClick={() => { this.toggleAwayClubMenu() }}
                    >
                        <div className="Options">
                            {getAwayClubsList()}
                        </div>
                        <p className="Selected">{`${this.props.awayClub}`}</p>
                    </div>
                </div>
                <div className="Pitch">
                    <img className="Outlines" src={scoreImage} alt="Pitch outlines" />
                </div>
            </div>
        );
    }
}

export default FinalResults;