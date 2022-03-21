class PrinciplDimensions extends React.Component {

    constructor(props) {

        super(props);

        this.updateValues = this.updateValues.bind(this);

        this.state = {
            defaultDisplacement: data.shipValues.displacement,
            defaultLcg: data.shipValues.lcg,
            defaultTcg: data.shipValues.tcg,
            defaultKmt: data.shipValues.kmt,
            defaultName : data.shipValues.name,
        }

    }


    updateValues() {
        
    }

    render() {
        return (
            <table className="dimensions">
                <thead>
                    <tr >
                        <th>Project Name</th>
                        <th><CacheInputsText name="inp-shipName" triggeractionfunc={data.shipValues.setProjectName} type="text" defaultValue={this.state.defaultName} /></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>DISPLACEMENT*:</td>
                        <td><CacheInputsNumber name="inp-displacement" triggeractionfunc={data.shipValues.setDisplacement} type="number" defaultValue={this.state.defaultDisplacement} /></td>
                    </tr>
                    <tr>
                        <td>LCG:</td>
                        <td><CacheInputsNumber name="inp-lcg" triggeractionfunc={function(e){ data.shipValues.lcg = e.target.value;}} type="number" defaultValue={this.state.defaultLcg} /></td>
                    </tr>
                    <tr>
                        <td>TCG:</td>
                        <td><CacheInputsNumber name="inp-tcg" triggeractionfunc={function(e){ data.shipValues.tcg = e.target.value;}} type="number" defaultValue={this.state.defaultTcg} /></td>
                    </tr>
                    <tr>
                        <td>KMt:</td>
                        <td><CacheInputsNumber name="inp-kmt" triggeractionfunc={function(e){ data.shipValues.kmt = e.target.value;}} type="number" defaultValue={this.state.defaultKmt} /></td>
                    </tr>
                </tbody>
            </table>
             

        );

    }
}

ReactDOM.render(
    <ClosableFrameWithCross pagename="prinsiple-dimensions-page" className="prinsiple-dimensions-frame print-page" pageheader="PRINCIPLE PARTICULARS">
        <PrinciplDimensions />
        <div className="foot-note">
             <p >*Displacement during the inclining test, calculated by draught survey. </p>
         </div>
    </ClosableFrameWithCross>,
    document.getElementById('prinsiple-dimensions-page')
);
