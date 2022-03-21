class PendulumCharts extends React.Component {

    constructor(props) {

        super(props);

        this.updateValues = this.updateValues.bind(this);
        this.initCanvases = this.initCanvases.bind(this);

        this.state = {
            counter : 0,
            numberOfPendulums : data.pendulumData.numberOfPendulums,
            canvases : [],
        }

        this.initCanvases();

        chartsNode = this;
        

    }

    initCanvases(num = data.pendulumData.numberOfPendulums){
        let canvasID = "";
        
        for(let pendI = 0; pendI < num; pendI++){
            canvasID = "pendulum-chart-" + (pendI+1);
            this.state.canvases.push( <div key={"key-"+ canvasID} className="chart-container" >
                <canvas id={canvasID} className="chart pendulum-chart" ></canvas>
                </div>)
                ;
        }

    }

    changeCanvases(num = data.pendulumData.numberOfPendulums){
        let canvasID = "";
        let canvases = [];
        for(let pendI = 0; pendI < num; pendI++){
            canvasID = "pendulum-chart-" + (pendI+1);
            canvases.push( <div key={"key-"+ canvasID + this.state.counter} className="chart-container" >
                <canvas id={canvasID} className="chart pendulum-chart" ></canvas>
                </div>);
        }
        this.setState( { counter: ++this.state.counter, numberOfPendulums : num, canvases: canvases}, () => this.updateValues());
    }

    updateValues() {
        let numberOfPendulums = data.pendulumData.numberOfPendulums;
        let canvasID = "";
        
        for(let pendI = 0; pendI < numberOfPendulums; pendI++){
            canvasID = "pendulum-chart-" + (pendI+1);
            drawPendulumGraph(pendI, canvasID);
        }
    }


    render() {
        return (
            <div className="charts-group">
                <button onClick={() => {this.updateValues()}} className="graph-drawer">Generate/Update Charts</button>
                {this.state.canvases}
            </div>

        );

    }
}

ReactDOM.render(
    <ClosableFrameWithCross pagename="pendulum-charts-page" className="pendulum-charts-frame print-page" pageheader="PENDULUM CHARTS">
        <PendulumCharts />
    </ClosableFrameWithCross>,
    document.getElementById('page_pendulum-charts')
);

//from dataHandler


