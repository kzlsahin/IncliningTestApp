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
            classNames: "closable weight-frame print-page ",
            isOpen: "div-closed",
        }

        pageFrameReactNodes.page_weightshifts = this;
        updatables.push(this);
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
            <div name={this.name} style={{ display: this.state.display }} className={this.state.classNames + this.state.isOpen}>
                <div className="inner-frame">
                    <h2>TEST WEIGHTS</h2>
                    <ClosingCross parent={this.name} />

                    <WeigthInputTable />

                    <WeightTable parent={this.name} />
                    <div className="foot-note">
                        <p >*Distance from initial points. Positive to starboard side (negative, if the movement is from starboard to port). </p>
                    </div>
                    <MomentsTable />
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
        this.onValuesChange = this.onValuesChange.bind(this);
        this.initTable = this.initTable.bind(this);

        this.state = {
            counter: 0,
            NumberOfWeightShifts: 0,
            weightNumber: 0,
            headers: [],
            tableRows: [],
            weights: [],
        }

        this.initTable();

        updatables.push(this);
    }

    initTable() {
        let NumberOfWeightShifts = data.testWeightData.NumberOfWeightShifts;
        this.state.NumberOfWeightShifts = data.testWeightData.weightNumber;
        this.state.weightNumber = data.testWeightData.weightNumber;


        for (let posI = 1; posI < NumberOfWeightShifts + 1; posI++) {

            let rowArr = [];
            for (let w = 1; w < this.state.weightNumber + 1; w++) {
                rowArr.push(
                    <td key={"w-" + w + "-p-" + posI}>
                        <WeightPosCell className="weight-pos-cell"
                            wnum={w} posi={posI}
                            val={data.testWeightData.weightPoses[w - 1][posI]} />
                    </td>
                );

            }

            this.state.weights[posI] = [...rowArr];

            this.state.tableRows.push(
                <tr key={"p-row-" + posI}>
                    <th>{posI}</th>
                    {this.state.weights[posI]}
                </tr>
            );


        }


        this.state.headers.push(
            <th key="konumlar">States</th>
        );

        for (let i = 1; i < this.state.weightNumber + 1; i++) {
            this.state.headers.push(
                <th wnum={i} key={"h-" + i}>W {i}</th>
            );
        }

    }

    resetTable() {
        let NumberOfWeightShifts = data.testWeightData.NumberOfWeightShifts;
        let weightNumber = data.testWeightData.weightNumber;
        let headers = [];
        let tableRows = [];
        let weights = [];


        for (let posI = 1; posI < NumberOfWeightShifts + 1; posI++) {

            let rowArr = [];
            for (let w = 1; w < weightNumber + 1; w++) {
                rowArr.push(
                    <td key={"w-" + w + "-p-" + posI + this.state.counter}>
                        <WeightPosCell className="weight-pos-cell"
                            wnum={w} posi={posI}
                            val={data.testWeightData.weightPoses[w - 1][posI]} />
                    </td>
                );

            }

            weights[posI] = [...rowArr];

            tableRows.push(
                <tr key={"p-row-" + posI + this.state.counter}>
                    <th>{posI}</th>
                    {weights[posI]}
                </tr>
            );


        }


        headers.push(
            <th key="konumlar">States</th>
        );

        for (let i = 1; i < weightNumber + 1; i++) {
            headers.push(
                <th wnum={i} key={"h-" + i + this.state.counter} >W {i}</th>
            );
        }

        this.setState({
            counter: ++this.state.counter,
            NumberOfWeightShifts: NumberOfWeightShifts,
            weightNumber: weightNumber,
            headers: headers,
            tableRows: tableRows,
            weights: weights,
        });

    }

    onValuesChange(init = true) {

        if (init) {
            this.resetTable();
        } else {
            this.initTable();
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
            <table className="weight-table table " onClick={this.handleClick}>
                <thead>
                    <tr>
                        <th></th>
                        <th colSpan={this.state.weightNumber}>Weight Positions*</th>
                    </tr>
                    <tr>
                        {this.state.headers}
                    </tr>
                </thead>
                <tbody>
                    {this.state.tableRows}
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
        this.onValuesChange = this.onValuesChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.inputField = React.createRef();

        this.state = {
        };
        this.initValues()
        //updatables.push(this);

    }

    handleClick(e) {
        e.target.value = "";
    }

    handleInputChange(e) {

        if (e.target.value == "") {

            e.target.value = this.state.label;

            return;

        }

        this.setState({
            label: Number(e.target.value),
        });
        e.target.value = Number(e.target.value);
        data.testWeightData.setWeightPos(this.state.wI - 1, this.state.posI, e.target.value);
        weightFrameNode.onValuesChange();



    }

    initValues() {
        this.state = {
            inputOpen: true,
            inputDisplay: "block",
            type: "number",
            label: this.props.val,
            wI: this.props.wnum,
            posI: this.props.posi,
        };

    }

    onValuesChange(init = true) {
            this.updateValues();
    }

    updateValues() {
        let val = data.testWeightData.weightPoses[this.props.wnum - 1][this.props.posi];

        if (isNaN(val) || val == "") return;
        this.setState({
            label: Number(val),
        });
    }

    render() {
        return (
            <input
                ref={inp => this.inputField = inp}
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

        this.state = {
            counter: 0,
            moments: data.testWeightData.weightMoments,
            momentCells: [],
        }

        this.handleClick = this.handleClick.bind(this);
        this.updateValues = this.updateValues.bind(this);
        this.updateCells = this.updateCells.bind(this);
        this.initState = this.initState.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);


        data.testWeightData.calculateMoments();
        this.updateValues(false);

        momentTableNode = this;
        updatables.push(this);
    }

    handleClick(e) {
        e.target.value = "";
    }
    initState() {
        let moments = [...data.testWeightData.weightMoments];
        this.state.momentCells = [];
        this.firstRow = [];
        for (let i = 0; i < moments.length; i++) {
            this.firstRow.push(<td key={"momId" + (i + 1)}>{i + 1}</td>);
            this.state.momentCells.push(
                <td key={"moment-" + i}>
                    {formatDecimal(moments[i], { decimal: 4 })}
                </td>
            );
        }
    }

    onValuesChange(init = true) {
        if (init) {
            this.updateValues();
        }
        else {
            this.initState();
        }
    }

    updateValues(initialised = true) {
        data.testWeightData.calculateMoments();
        this.updateCells(initialised);

    }

    updateCells(initialised = true) {
        let moments = [...data.testWeightData.weightMoments];
        if (initialised === false) {
            this.state.momentCells = [];
            this.firstRow = [];
            for (let i = 0; i < moments.length; i++) {
                this.firstRow.push(<td key={"momId" + (i + 1)}>{i + 1}</td>);
                this.state.momentCells.push(
                    <td key={"moment-" + i}>
                        {formatDecimal(moments[i], { decimal: 4 })}
                    </td>
                );
            }


        }
        else {
            let momentCells = [];
            this.firstRow = [];
            for (let i = 0; i < moments.length; i++) {
                this.firstRow.push(<td key={"momId" + (i + 1) + this.state.counter}>{i + 1}</td>);
                momentCells.push(
                    <td key={"moment-" + i + this.state.counter}>
                        {formatDecimal(moments[i], { decimal: 4 })}
                    </td>
                );
            }

            this.setState(
                {
                    counter: ++this.state.counter,
                    moments: moments,
                    momentCells: momentCells,
                }
            );
        }
    }

    render() {

        return (
            <table className="moments-table table " onClick={this.handleClick}>
                <thead>
                    <tr>
                        <th colSpan="9">Moments</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><th>State</th>{this.firstRow}</tr>
                    <tr><th>ton.m</th>{this.state.momentCells}</tr>
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
        this.onValuesChange = this.onValuesChange.bind(this);

        this.state = {
        }

        this.updateValues(false);
        weightTableNode = this;
        updatables.push(this);
    }

    initValues() {
        this.state = {
            type: "number",
            weights: [...data.testWeightData.weights],
        };
    }

    handleClick(e) {
        e.target.value = "";
    }

    updateValues(initialised = true) {


        if (initialised) {
            let weights = [...data.testWeightData.weights];
            this.setState({ weights: [...weights] },
                this.updateCells(true));
        } else {
            this.initValues();
            this.updateCells(false);
        }


    }

    onValuesChange(init = true) {
        this.updateCells(init);
        this.updateValues(init);

    }

    async handleInputChange(e) {

        let index = Number(e.target.name);

        if (e.target.value == "" || isNaN(e.target.value)) {

            e.target.value = this.state.weights[index]

            return;

        }

        let newValue = Number(e.target.value);

        data.testWeightData.weights[index] = newValue;

        weightFrameNode.onValuesChange();
    }


    updateCells(initialised = true) {
        let weightCells = [];

        if (initialised) {
            weightCells = this.state.weightCells;
        } else {
            weightCells = [];
        }

        for (let i = 0; i < this.state.weights.length; i++) {

            weightCells[i] = (
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
                </tr>)
                ;
        }
        if (initialised) {
            this.setState({ weightCells: [...weightCells] });
        } else {
            this.state.weightCells = [...weightCells];
        }



    }

    render() {

        return (
            <table className="weight-input-table table" >
                <thead>
                    <tr>
                        <th>Weights</th>
                        <th>(ton)</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.weightCells}
                </tbody>
            </table>
        );
    }
}

ReactDOM.render(
    <WeightFrame />,
    document.getElementById('page_testweights')
);