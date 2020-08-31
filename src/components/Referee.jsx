import React from "react"

export default class Referee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refereeName: "שופט ראשי"
        }
    }
    handleChange = e => {
        this.setState({
            refereeName: e.target.value
        })
    }
    render() {
        return (<input className="RefName" onChange={this.handleChange}>{this.state.refereeName}</input>)

    }
}