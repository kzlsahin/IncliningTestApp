const NumberOfweightShifts = 8;
const WeightInputValues = { weight: "0", length: "0" }



class WeightFrame extends React.Component {
    constructor(props) {
        super(props);
        this.name = "weight-frame";
        weightFrameNode = this;
        this.openNode = this.openNode.bind(this);
        this.closeNode = this.closeNode.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);

        closables[this.name] = this;

        this.state = {
            classNames: "closable weight-frame ",
            isOpen: "div-closed",
        }

        pageFrameReactNodes.page_weightshifts = this;
    }

    openNode() {
        this.setState({ isOpen: "div-open" });
    }

    closeNode() {
        this.setState({ isOpen: "div-closed" });
    }

    onValuesChange() {
        console.log("values changed");
        momentTableNode.updateValues();
        weightTableNode.updateValues();
    }


    render() {
        return (
            <div name={this.name} className={this.state.classNames + this.state.isOpen}>
                <h3>Ağırlıklar</h3>
                <ClosingCross parent={this.name} />
                <div className="inner-frame">
                    <WeightTable parent={this.name} />
                    <MomentsTable /><WeigthInputTable />
                </div>
            </div>

        );

    }
}

class WeightTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.updateValues = this.updateValues.bind(this);

        this.weightNumber = data.testWeightData.weightNumber;
        this.NumberOfWeightShifts = data.testWeightData.NumberOfWeightShifts;

        this.headers = [];
        this.tableRows = [];
        this.weights = [[]];

        for (let posI = 0; posI < this.NumberOfWeightShifts + 1; posI++) {

            let rowArr = [];
            for (let w = 1; w < this.weightNumber + 1; w++) {

                rowArr.push(
                    <td key={"w-" + w + "-p-" + posI}>
                        <WeightPosCell className="weight-pos-cell"
                            wnum={w} posi={posI}
                            val={data.testWeightData.weightPoses[w - 1][posI]} />
                    </td>
                );

            }

            this.weights[posI] = [...rowArr];

            this.tableRows.push(
                <tr key={"p-row-" + posI}>
                    <th>{posI}</th>
                    {this.weights[posI]}
                </tr>
            );

        }


        this.headers.push(
            <th key="konumlar">Konumlar</th>
        );

        for (let i = 1; i < this.weightNumber + 1; i++) {
            this.headers.push(
                <th wnum={i} key={"h-" + i}>W {i}</th>
            );
        }



        this.state = {

        }
    }

    handleClick() {
        /*
        pendulumInputNode.open();
        pendulumInputNode.caller = this;*/
    }

    updateValues() {


    }

    render() {

        return (
            <table className="weight-table" onClick={this.handleClick}>
                <thead>
                    <tr>
                        <th></th>
                        <th colSpan={this.weightNumber}>Ağırlıklar</th>
                    </tr>
                    <tr>
                        {this.headers}
                    </tr>
                </thead>
                <tbody>
                    {this.tableRows}
                </tbody>
            </table>
        );
    }
}

class WeightPosCell extends React.Component {
    constructor(props) {

        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.updateValues = this.updateValues.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            inputOpen: true,
            inputDisplay: "block",
            type: "number",
            label: this.props.val,
            wI: this.props.wnum,
            posI: this.props.posi,
        };

    }

    handleClick(e) {
        e.target.value = "";
    }

    handleInputChange(e) {
        this.setState({
            label: Number(e.target.value),
        });
        e.target.value = Number(e.target.value);
        data.testWeightData.setWeightPos(this.state.wI - 1, this.state.posI, e.target.value);
        weightFrameNode.onValuesChange(this);
    }

    updateValues() {


    }
    render() {
        return (
            <input
                className={this.props.className}
                onBlur={this.handleInputChange}
                onClick={this.handleClick}
                type={this.state.type}
                contentEditable="true"
                style={{ display: this.state.inputDisplay }}
                defaultValue={this.state.label}
            />

        );
    }
}

class MomentsTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.updateValues = this.updateValues.bind(this);
        this.updateCells = this.updateCells.bind(this);

        this.state = {
            moments: data.testWeightData.weightMoments,
        }

        this.updateCells();
        momentTableNode = this;
    }

    handleClick(e) {
        e.target.value = "";
    }

    updateValues() {
        data.testWeightData.calculateMoments();
        this.setState(
            {
                moments: data.testWeightData.weightMoments,
            }
        );
        this.updateCells();
    }

    updateCells() {
        this.momentCells = [];

        for (let i = 0; i < this.state.moments.length; i++) {

            this.momentCells.push(
                <tr key={"moment " + i}>
                    <td>{i + 1}</td>
                    <td >
                        {this.state.moments[i]}
                    </td>
                </tr>
            );
        }


    }

    render() {

        return (
            <table className="moments-table" onClick={this.handleClick}>
                <thead>
                    <tr>
                        <th>Momentler</th>
                        <th>Hareketler</th>
                    </tr>
                </thead>
                <tbody>
                    {this.momentCells}
                </tbody>
            </table>
        );
    }
}

class WeigthInputTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.updateValues = this.updateValues.bind(this);
        this.updateCells = this.updateCells.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            weights: data.testWeightData.weights,
        }

        this.updateCells();
        weightTableNode = this;
    }

    handleClick(e) {
        e.target.value = "";
    }

    updateValues() {
        this.setState(
            {
                    type: "number",
                    inputDisplay: "block",
                weights: data.testWeightData.weights,
            }
        );

        this.updateCells();
    }

    handleInputChange(e) {
        let weights = this.state.weights;
        let index = Number(e.target.name);
        let newValue = Number(e.target.value);
        weights[index] = newValue;
        data.testWeightData.setWeights(weights);
        this.setState({
            weights: weights,
        });
        weightFrameNode.onValuesChange(this);
    }


    updateCells() {
        this.weightCells = [];

        for (let i = 0; i < this.state.weights.length; i++) {

            this.weightCells.push(
                <tr key={"weightnum " + i}>
                    <td>{i + 1}</td>
                    <td >
                        <input
                            className={this.props.className}
                            onClick={this.handleClick}
                            onBlur={this.handleInputChange}
                            type={this.state.type}
                            contentEditable="true"
                            style={{ display: this.state.inputDisplay }}
                            defaultValue={this.state.weights[i]}
                            name={i}
                        />
                    </td>
                </tr>
            );
        }


    }

    render() {

        return (
            <table className="weights-input-table" onClick={this.handleClick}>
                <thead>
                    <tr>
                        <th>Ağırlıklar</th>
                        <th>(ton)</th>
                    </tr>
                </thead>
                <tbody>
                    {this.weightCells}
                </tbody>
            </table>
        );
    }
}

ReactDOM.render(
    <WeightFrame />,
    document.getElementById('page_testweights')
);