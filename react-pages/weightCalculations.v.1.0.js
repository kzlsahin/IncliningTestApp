
class LightshipTable extends React.Component {

    constructor(props) {

        super(props);

        this.updateValues = this.updateValues.bind(this);

        this.state = {
            GM: "0",
            KG: "0",
        }

    }


    updateValues() {
        if (data.shipValues.chartSlopes.length > 0) {
            chartsNode.changeCanvases();
            data.shipValues.calculateGM();
            console.log(data.shipValues.GM);
            this.setState({
                GM: formatDecimal(data.shipValues.GM , {decimal:4} ),
                KG: formatDecimal((data.shipValues.kmt - data.shipValues.GM), {decimal:4} ),
            });
        }
        else {

            this.setState({
                GM: "You should first check the Charts",
            });

        }

    }

    render() {
        return (
            <div>
                <button onClick={() => { this.updateValues() }} className="btn-update">Calculate</button>
                <table className="calculation-table">
                    <thead>
                        <tr>
                            <th colSpan="2">GM Value Calculated (@Test Condition)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>GM (m)</th><th>{this.state.GM}</th>
                        </tr>
                        <tr>
                            <th>KG (m)</th><th>{this.state.KG}</th>
                        </tr>
                    </tbody>
                </table>
            </div>

        );

    }
}

class WeigthCalculationTable extends React.Component {

    constructor(props) {

        super(props);

        this.updateValues = this.updateValues.bind(this);

        this.state = {
        }

    }


    updateValues() {

    }

    render() {
        return (
            <table className="calculation-table">
                <thead>
                    <tr><th colSpan="4">Weight Analysis</th></tr>
                </thead>
                <tbody>
                    <tr><th className="table-sub-header" colSpan="4">Weights To Be Removed</th></tr>
                    <tr><th>Test Weight</th><th>ton</th><th>LCG (m)</th><th>TCG (m)</th></tr>
                    <tr><th>MDO Service Tank</th><td>5.890</td><td>6.919</td><td>0</td></tr>
                    <tr><th className="table-sub-header" colSpan="4">Weights To Be Added</th></tr>
                    <tr><th>Test Weight</th><th>ton</th><th>LCG (m)</th><th>TCG (m)</th></tr>

                </tbody>
            </table>


        );

    }
}

ReactDOM.render(
    <ClosableFrameWithCross pagename="weight-calculations-page" className="weight-calculations-frame print-page" pageheader="WEIGHT CALCULATIONS">
        <LightshipTable />
        <div className="foot-note">
            <p >Weigths Should be recalculated manually after each revision. </p>
        </div>

    </ClosableFrameWithCross>,
    document.getElementById('weight-calculations-page'));