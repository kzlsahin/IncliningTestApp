
const pendulumInputNode = {

    inputValues: { deflection: "0", length: "0" },

    inputChache: [
        { deflection: "0", length: "0", tan: "0" },
        { deflection: "0", length: "0", tan: "0" },
    ],
    setInputChache(pendI) {
        pendulumInputNode.inputChache[pendI].deflection = pendulumInputNode.inputValues.deflection;
        pendulumInputNode.inputChache[pendI].length = pendulumInputNode.inputValues.length;
    },

    addPendulum() {
        pendulumInputNode.inputChache.push({ deflection: "0", length: "0", tan: "0" });
    },
    removePendulum() {
        pendulumInputNode.inputChache.pop();
    },
    node: "",
    inputTable: "",
    caller: "",
    getActivePendNum() {
        return pendulumInputNode.caller.state.pendNum - 1;
    },

    getActiveWsNum() {
        return pendulumInputNode.caller.state.wsNum - 1;
    },

}

class PendulumFrame extends React.Component {
    constructor(props) {
        super(props);
        this.name = "pendulum-frame";

        this.openNode = this.openNode.bind(this);
        this.closeNode = this.closeNode.bind(this);
        this.openNode = this.openNode.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);

        closables[this.name] = this;

        this.state = {
            classNames: "closable pendulum-frame print-page ",
            isOpen: "div-closed",
        }

        pageFrameReactNodes.page_pendulums = this;
        updatables.push(this);

    }

    openNode() {
        this.setState({ isOpen: "div-open" });
    }

    closeNode() {
        this.setState({ isOpen: "div-closed" });
    }

    onValuesChange() {
    }


    render() {
        return (
            <div name={this.name} style={{ display: this.state.display }} className={this.state.classNames + this.state.isOpen}>

                <ClosingCross parent={this.name} />
                <div className="inner-frame">
                    <h2>PENDULUMS</h2>
                    <PendulumGroup ref={component => this.pendulumGroup = component} />

                </div>
            </div>

        );

    }
}


class PendulumGroup extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            pendulums: [],
        }

        this.addPendulum = this.addPendulum.bind(this);
        this.initPendulums = this.initPendulums.bind(this);
        this.resetPendulums = this.resetPendulums.bind(this);
        this.removePendulum = this.removePendulum.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);

        this.initPendulums();

        updatables.push(this);
    }

    onValuesChange(init = true) {
        if(init) init =  this.state.init;
        if (init) {
            this.resetPendulums();
        } else {
            this.initPendulums();
        }
    }

    initPendulums() {
        let pendulumNumber = data.pendulumData.numberOfPendulums;
        this.state.pendulums = [];
        for (let i = 0; i < pendulumNumber; i++) {
            this.state.pendulums.push(<Pendulum key={"pend-" + (i + 1)} pendnum={i + 1} />);
        }
    }

    resetPendulums() {
        let pendulumNumber = data.pendulumData.numberOfPendulums;
        let pends = [];
        for (let i = 0; i < pendulumNumber; i++) {
            pends.push(<Pendulum key={"pend-" + (i + 1)} pendnum={i + 1} />);
        }
        this.setState({ pendulums: pends });
    }

    render() {

        return (
            <div className="penulum-container">


                {this.state.pendulums}
                <PendulumInput />
                <button className="btn-adder" onClick={this.addPendulum}>Add Pendulum</button>
                <button className="btn-remover" onClick={this.removePendulum}>Remove Pendulum</button>
            </div>

        );

    }

    addPendulum() {

        if (data.pendulumData.numberOfPendulums == 4) return;

        data.pendulumData.numberOfPendulums += 1;
        let NumberOfPendulums = data.pendulumData.numberOfPendulums;

        data.pendulumData.pendulums[NumberOfPendulums - 1] = {
            deflection: [0, 0, 0, 0, 0, 0, 0, 0],
            length: [0, 0, 0, 0, 0, 0, 0, 0],
            tan: [0, 0, 0, 0, 0, 0, 0, 0],
        };

        let newPends = this.state.pendulums.concat([<Pendulum key={"pend-" + (NumberOfPendulums)} pendnum={NumberOfPendulums} />]);

        pendulumInputNode.addPendulum();

        this.setState({ pendulums: newPends }, () => chartsNode.changeCanvases());
        setTimeout(() => { this.state.pendulums.forEach(pend => console.log(pend)); }, 500);
    }

    removePendulum() {
        if (data.pendulumData.numberOfPendulums == 2) return;
        data.pendulumData.numberOfPendulums -= 1;
        let NumberOfPendulums = data.pendulumData.numberOfPendulums;

        let newPends = [...this.state.pendulums].slice(0, NumberOfPendulums);

        data.pendulumData.numberOfPendulums = NumberOfPendulums;
        data.pendulumData.pendulums.pop();
        this.setState({ pendulums: newPends }, () => chartsNode.changeCanvases());
        pendulumInputNode.removePendulum();
    }

}


class Pendulum extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tables: [],
        }

        this.open = this.open.bind(this);
        this.initValues = this.initValues.bind(this);
        this.resetValues = this.resetValues.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);

        this.initValues();

        updatables.push(this);
    }

    initValues() {
        let wsNumber = data.testWeightData.NumberOfWeightShifts;
        this.state.tables = [];
        for (let i = 0; i < wsNumber; i++) {
            this.state.tables[i] = (<PendulumTable key={"pend-" + this.props.pendnum + "-ws-" + (i + 1)} pendnum={this.props.pendnum} wsnum={i + 1} />)
        }

    }

    resetValues() {
        let wsNumber = [...data.testWeightData.NumberOfWeightShifts];
        let tables = [];
        for (let i = 0; i < wsNumber; i++) {
            tables.push(<PendulumTable key={"pend-" + this.props.pendnum + "-ws-" + (i + 1)} pendnum={this.props.pendnum} wsnum={i + 1} />)
        }

        this.setState({ tables: tables });

    }

    onValuesChange(init = true) {
        if(init) init =  this.state.init;
        if (init) {
            this.resetValues();
        } else {
            this.initValues();
        }
    }

    open() {
        this.node.setAttribute("open", true);
    }
    render() {

        return (
            <details id={"pend-" + this.props.pendnum} className="pendulum" ref={node => this.node = node}>
                <summary className="pendulum-label">Pendulum {this.props.pendnum}</summary>
                <div className="pendulum-details">
                    {this.state.tables}
                </div>
            </details>
        );

    }

}


class PendulumTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.initValues = this.initValues.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);

        this.id = "pend-" + this.props.pendnum + "-ws-" + this.props.wsnum;
        this.pendI = this.props.pendnum - 1;
        this.wsI = this.props.wsnum - 1;

        //console.log("pendI " + this.pendI);
        //console.log("wsI " + this.wsI)

        data.pendulumData.calculate();

        this.state = {
            init : false,

        };

        this.initValues();

        updatables.push(this);

    }

    initValues() {
        data.pendulumData.calculate();
        this.state = {
            init : true,
            pendNum: this.props.pendnum,
            wsNum: this.props.wsnum,
            deflection: formatDecimal(data.pendulumData.pendulums[this.pendI].deflection[this.wsI]) || "0",
            length: formatDecimal(data.pendulumData.pendulums[this.pendI].length[this.wsI]) || "0",
            tan: formatDecimal(data.pendulumData.pendulums[this.pendI].tan[this.wsI]) || "0",
        };
        //console.log("init");
        //console.log(this.state);
    }

    onValuesChange(init = true) {
        if(init) init =  this.state.init;
        if (init) {
            this.loadValuesFromData();
        } else {
            this.initValues();
        }
    }

    loadValuesFromData() {
        let deflect = formatDecimal(data.pendulumData.pendulums[this.pendI].deflection[this.wsI]) || "0";
        let length = formatDecimal(data.pendulumData.pendulums[this.pendI].length[this.wsI]) || "0";
        let tan = formatDecimal(data.pendulumData.pendulums[this.pendI].tan[this.wsI]) || "0";

        this.setState({ deflection: deflect, length: length, tan: tan, });
        console.log("update");
        console.log(this.state);
    }

    handleClick() {

        pendulumInputNode.caller = this;
        pendulumInputNode.node.openNode();
    }

    updateValues() {
        let tan = pendulumInputNode.inputValues.deflection / pendulumInputNode.inputValues.length;
        pendulumInputNode.inputValues.tan = tan;

        let value = {
            deflection: formatDecimal(pendulumInputNode.inputValues.deflection),
            length: formatDecimal(pendulumInputNode.inputValues.length),
            tan: formatDecimal(pendulumInputNode.inputValues.tan),
        };
        this.setState(value);
        data.pendulumData.changePendulumValue(this.props.pendnum, this.props.wsnum, value);
    }


    render() {

        return (
            <table id={this.id} className="pendulum-table" onClick={this.handleClick}>
                <thead>
                    <tr>
                        <th colSpan="3">Movement {this.props.wsnum}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Length</td>
                        <td>{this.state.length}</td>
                        <td>mm</td>
                    </tr>
                    <tr>
                        <td>Deflection</td>
                        <td>{this.state.deflection}</td>
                        <td>mm</td>
                    </tr>

                    <tr>
                        <td>Tangent</td>
                        <td>{this.state.tan}</td>
                        <td>tan(phi)</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class PendulumInput extends React.Component {
    constructor(props) {
        super(props);
        this.name = "pendulum-input";

        closables[this.name] = this;

        this.handleClick = this.handleClick.bind(this);
        this.submitValues = this.submitValues.bind(this);
        this.closeNode = this.closeNode.bind(this);
        this.openNode = this.openNode.bind(this);

        this.state = {
            classNames: "closable pendulum-input ",
            isOpen: "div-closed",
            pendI: 0,
            wsI: 0,

        }

        pendulumInputNode.node = this;
    }

    handleClick() {
        console.log(this.isOpen);
    }

    openNode() {
        let pendI = pendulumInputNode.getActivePendNum();
        let wsI = pendulumInputNode.getActiveWsNum();

        this.setState({ pendI: pendI, wsI: wsI, isOpen: "div-open", });

        pendulumInputNode.inputTable.setInputValues(pendI, wsI);

    }

    closeNode() {

        this.setState({ isOpen: "div-closed", });

    }


    submitValues() {

        pendulumInputNode.caller.updateValues();
        pendulumInputNode.setInputChache(this.state.pendI);
        this.closeNode();

    }

    render() {
        return (
            <div name={this.name} className={this.state.classNames + this.state.isOpen}>
                <div className="inner-frame">
                    <h3>Pendulum Bilgileri</h3>
                    <ClosingCross parent={this.name} />

                    <PendulumInputTable />
                    <button onClick={this.submitValues}>Submit</button>
                </div>

            </div>

        );

    }
}

class PendulumInputTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleInputs = this.handleInputs.bind(this);
        this.setInputValues = this.setInputValues.bind(this);

        this.lengthInput = React.createRef();
        this.deflectInput = React.createRef();

        this.state = {
            wsI: 0,
            pendI: 0,
        }

        pendulumInputNode.inputTable = this;
    }

    handleClick(e) {
        e.target.value = "";
    }

    setInputValues(pendI, wsI) {

        this.lengthInput.value = pendulumInputNode.inputChache[pendI].length;
        this.deflectInput.value = pendulumInputNode.inputChache[pendI].deflection;

        this.setState({
            wsI: wsI,
            pendI: pendI,
        });
    }

    handleInputs(evt) {
        pendulumInputNode.inputValues[evt.target.name] = Number(evt.target.value);
    }

    render() {
        return (
            <table className="pendulum-deflaction-table input-table">
                <thead>
                    <tr>
                        <th >Pendulum {this.state.pendI + 1}</th>
                        <th colSpan="2">Movement No {this.state.wsI + 1}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Legth</td>
                        <td><input ref={me => this.lengthInput = me} type="number" name="length" defaultValue="0" onClick={this.handleClick} onChange={evt => this.handleInputs(evt)} /></td>
                        <td>mm</td>
                    </tr>
                    <tr>
                        <td>Deflection</td>
                        <td><input ref={yeap => this.deflectInput = yeap} type="number" onClick={this.handleClick} name="deflection" defaultValue="0" onChange={evt => this.handleInputs(evt)} /></td>
                        <td>mm</td>
                    </tr>

                </tbody>
            </table>
        );

    }
}


ReactDOM.render(
    <PendulumFrame />,
    document.getElementById('page_pendulum')
);

/*
const closeNode = (node, callerId = "") => {
    node.style.left = "-100vw";
    node.setAttribute("data-closedbyid", callerId);
}

const openNode = (id, callerId = "", callBack = "") => {
    let node = document.getElementById(id);
    node.style.left = "0vw";
    node.setAttribute("data-openedbyid", callerId);
    node.setAttribute("data-callBack", callBack);
}
*/

