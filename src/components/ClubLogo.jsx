import React from "react"

export default class ClubsLogo extends React.Component {

    constructor(props) {
        super(props);
      }

    getClassName = () =>
    {
        if (this.props.activeScreen == "line_up")
        {
                return this.props.clubType =="HOME" ? 'ClubsLogoHome' : 'ClubsLogoAway'
        }
        else if (this.props.activeScreen == "final")
        {
            return this.props.clubType =="HOME" ? "ClubsLogoHomeFinal" : "ClubsLogoAwayFinal"
        }
        else if (this.props.activeScreen == "line_up_list")
        {
            return this.props.clubType =="HOME" ? 'ClubsLogoHome' : 'ClubsLogoAway'
        }
        else if (this.props.activeScreen == "double_list")
        {
            return this.props.clubType =="HOME" ? 'ClubsLogoHomeDouble' : 'ClubsLogoAwayDouble'
        }

    }
    render() {
        if (this.props.show){
            return (
                    <img className={this.getClassName()} src={this.props.logo_src}/>
            )

        }else
            return (<p></p>);
    }
}