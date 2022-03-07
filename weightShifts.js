const NumberOfPendulums = 3;
const NumberOfWeigthShifts = 8;

class PendulumGroup extends React.Component {
    constructor(props) {
        super(props);
        this.pendulums = [];
        for(let i = 0; i < NumberOfPendulums; i++){
            this.pendulums.push(<Pendulum pendnum={i+1} />)
        }
    }
    render() {

        return (
        <div className="pendulum-container">
                {this.pendulums}
                </div>
        );

    }

}


class Pendulum extends React.Component {
    constructor(props) {
        super(props);
        this.pendNum = props.pendnum;
        this.tables = [];
        for(let i = 0; i < NumberOfWeigthShifts; i++){
            this.tables.push(<PendulumTable pendnum={this.pendNum} wsnum={i+1} />)
        }
    }
    render() {

        return (
            <details id={"pend-" + this.props.pendnum} className="pendulum">
                <summary className="pendulum-label">Pendulum {this.props.pendnum}</summary>
                {this.tables}
            </details>
        );

    }

}


class PendulumTable extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        let inputDiv = document.getElementById("pendulum-input");
        inputDiv.style.left = "0vw";
      }

    render() {

        return (
            <table id={"pend-" + this.props.pendnum + "-ws-" + this.props.wsnum} className="pendulum-table" onClick={this.handleClick}>
                <thead>
                    <tr>
                        <th colSpan="3">Hareket {this.props.wsnum}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Şakül Sapması</td>
                        <td>empty</td>
                        <td>mm</td>
                    </tr>
                    <tr>
                        <th>Şakül Boyu</th>
                        <td>empty</td>
                        <td>mm</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}


ReactDOM.render(
    <PendulumGroup/>,
    document.getElementById('pendulumFrame')
);