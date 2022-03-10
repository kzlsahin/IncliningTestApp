let weightFrameNode = "";
let momentTableNode = "";
let weightTableNode = "";

const NumberOfWeigthShifts = 8;
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
            [0, 2, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 2, 0],
            [0, 0, 0, 2, 0, 0, 4, 0, 0],
            [0, 0, 0, 0, 0, 2, 0, 0, 0],
        ],
        weightMoments: [3, 4, 5, 6, 7, 8, 2, 0],
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
                deflection: [-61, -127, -72, -4, 53, 121, 69, -2],
                length: [3180, 3180, 3180, 3180, 3180, 3180, 3180, 3180],
                tan: [-0.019182389937106917, -0.03993710691823899, -0.022641509433962263, -0.0012578616352201257, 0.016666666666666666, 0.038050314465408804, 0.02169811320754717, -0.0006289308176100629],
            },
            {
                deflection: [-61, -127, -72, -4, 53, 121, 69, -2],
                length: [3180, 3180, 3180, 3180, 3180, 3180, 3180, 3180],
                tan: [-0.019182389937106917, -0.03993710691823899, -0.022641509433962263, -0.0012578616352201257, 0.016666666666666666, 0.038050314465408804, 0.02169811320754717, -0.0006289308176100629],
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



    let graphData = {
        labels: data.testWeightData.weightMoments.sort(),
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: data.pendulumData.pendulums[pendI].tan,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointRadius: 5,
            fill: false,
            showLine: false //<- set this
        }]
    };

    let lineFitted = fitLine(graphData.labels, graphData.datasets[0].data);
    let linearGraphYs = graphData.labels.map(x => lineFitted(x));
    graphData.datasets.push({ label: 'line', backgroundColor: 'rgb(140,33,50)', borderColor: 'rgb(140,33,50)', data: linearGraphYs });

    let config = {
        type: 'lscatter',
        data: graphData,
        options: {}
    };

    charts["pendChart-" + pendNum] = new Chart(
        document.getElementById('pendulum-chart-' + pendNum),
        config
    );
    return lineFitted;
}

function fitLine(Xs, Ys) {
    if (!Xs.length > 1 || !Ys.length > 1) throw 'inputs of fitLine function should be array type';
    if (Xs.length != Ys.length) throw 'length of the inputs of fitLine function should have equal length';
    console.log(Xs);
    console.log(Ys);
    let Xsum = Xs.reduce((a, b) => a + b) / Xs.length;
    let Ysum = Ys.reduce((a, b) => a + b) / Ys.length;

    let m = 0;
    let dividend = 0;
    let devider = 0;

    for (let i = 0; i < Xs.length; i++) {
        dividend += (Xs[i] - Xsum) * (Ys[i] - Ysum);
        devider += Math.pow((Xs[i] - Xsum), 2);
    }
    m = dividend / devider;
    let n = Ysum - (m * Xsum);
    console.log(m);
    console.log(n);
    function func(x) {
        if (isNaN(x)) throw 'input should be number';

        return (x * m) + n;
    }
    return func;
}
