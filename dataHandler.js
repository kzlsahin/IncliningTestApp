let weightFrameNode = "";
let momentTableNode = "";
let weightTableNode = "";

const NumberOfWeigthShifts = 8;
const PendulumInputValues = { deflection: "0", length: "0", tan: "0" }
const charts = {};


const data = {

    shipValues: {
        displacement: 0,

        setDisplacement(e) {
            data.shipValues.displacement = Number(e.target.value);
        },
    },
    testWeightData: {
        NumberOfWeightShifts: 8,
        weightNumber: 4,
        weights: [1.3, 1.3, 1.3, 1.3],
        weightPoses: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        weightMoments: [0, 0, 0, 0, 0, 0, 0, 0],
        setWeightPos: (wNum, posNum, pos) => {
            data.testWeightData.weightPoses[wNum][posNum] = pos;
        },
        calculateMoments: () => {
            for (let i = 1; i < data.testWeightData.NumberOfWeightShifts + 1; i++) {
                let momentIndex = i - 1;
                data.testWeightData.weightMoments[momentIndex] = 0;
                for (let w = 0; w < data.testWeightData.weightNumber; w++) {
                    data.testWeightData.weightMoments[momentIndex] += data.testWeightData.weightPoses[w][i] * data.testWeightData.weights[w];
                }
            }
        },
        setWeights: (valArr) => {
            data.testWeightData.weights = [...valArr];
        }
    },

    pendulumData: {
        numberOfPendulums: 2,
        pendulums: [
            {
                deflection: [0, 0, 0, 0, 0, 0, 0, 0],
                length: [0, 0, 0, 0, 0, 0, 0, 0],
                tan: [0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                deflection: [0, 0, 0, 0, 0, 0, 0, 0],
                length: [0, 0, 0, 0, 0, 0, 0, 0],
                tan: [0, 0, 0, 0, 0, 0, 0, 0],
            }
        ],

        changePendulumValue: (pendNum, wsNum, value) => {
            // value = {deflection: .... , length : ....}
            let pendI = pendNum - 1;
            let wsI = wsNum - 1;
            data.pendulumData.pendulums[pendI].deflection[wsI] = value.deflection;
            data.pendulumData.pendulums[pendI].length[wsI] = value.length;
            data.pendulumData.pendulums[pendI].tan[wsI] = value.tan;
        }

    },
}

function drawPendulumGraph(pendNum) {
    if (pendNum < 1 || isNaN(pendNum)) return;
    let pendI = pendNum - 1;
    if (charts["pendChart-" + pendNum]) {
        charts["pendChart-" + pendNum].destroy();
    }

    console.log("chart drawn");

    let graphData = {
        labels: data.testWeightData.weightMoments,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: data.pendulumData.pendulums[pendI].tan,
        }]
    };

    let config = {
        type: 'line',
        data: graphData,
        options: {}
    };

    charts["pendChart-" + pendNum] = new Chart(
        document.getElementById('pendulum-chart-' + pendNum),
        config
    );
}


function fitLine(Xs, Ys) {
    if (Xs.length < 1) return;

    let Xsum = Xs.reduce((a, b) => a + b, 0);
    let Ysum = Ys.reduce((a, b) => a + b, 0);
    let m = a(Xs, Ys) / b(Xs);

 let n = Ysum - m * Xsum;

 function a (Xs, Ys){
    let sum = 0;
    for (let i = 0; i < Xs.length; i++) {
        sum += (Xs[i] - Xsum) * (Ys[i] - Ysum);
    }
    return sum;
 }
 function b (Xs){
    let sum = 0;
    for (let i = 0; i < Xs.length; i++) {
        sum += Math.pow(Xs[i] - Xsum);
    }
    return sum;
 }

 console.log(m);
 console.log(n);
function top(x) {
    return m*x + n;
}
return top;

}