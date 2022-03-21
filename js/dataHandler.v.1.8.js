let weightFrameNode = "";
let momentTableNode = "";
let weightTableNode = "";
let chartsNode = "";
let uploadedFileBuffer = "";

const charts = {};


const data = {
    typeVer :  "v.1.2",
    shipValues: {
        name: "MAJESTY 120#2",
        displacement: "174.4",
        lcg: "15.1",
        tcg: "0",
        kmt : "4.638",
        GM : "0",
        chartSlopes : [],

        calculateGM(){
            let mean = 0;
            let slope = 0;
            for(let i = 0; i < data.pendulumData.numberOfPendulums; i++){
                slope = data.shipValues.chartSlopes[i];
                //using regression slopes
                mean += 1 / (slope * data.shipValues.displacement);
                console.log(mean);
                console.log(i);
            }
            mean /= data.pendulumData.numberOfPendulums;
            data.shipValues.GM = mean;
        },

        setDisplacement(e) {
            data.shipValues.displacement = Number(e.target.value);
        },
        setProjectName(e) {
            data.shipValues.name = e.target.value;
            document.getElementById("project-name").innerText = data.shipValues.name;
        },

    },
    testWeightData: {
        NumberOfWeightShifts: 8,
        weightNumber: 4,
        weights: [1.3, 1.3, 1.3, 1.3],
        weightPoses: [
            [0, 0, 0, 0, 0, 5.5, 5.5, 0, 0],
            [0, -5.58, -5.58, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 6.64, 6.64, 0],
            [0, 0, -6.64, -6.64, 0, 0, 0, 0, 0],
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
                deflection: [-61, -127, -72, -4, 53, 121, 69, -2],
                length: [3180, 3180, 3180, 3180, 3180, 3180, 3180, 3180],
                tan: [
                    -0.019182389937106917, -0.03993710691823899, -0.022641509433962263, 0.0012578616352201257, 0.016666666666666666, 0.038050314465408804, 0.02169811320754717, -0.0006289308176100629
                ]
            },
            {
                deflection: [-61, -129, -72, -3, 54, 123, 74, 0],
                length: [3095, 3095, 3095, 3095, 3095, 3095, 3095, 3095],
                tan: [-0.019709208400646203, -0.04168012924071082, -0.023263327948303717, -0.0009693053311793214, 0.017447495961227785, 0.03974151857835218, 0.023909531502423264, 0],
            }
        ],

        calculate: () => {
            data.pendulumData.pendulums.forEach(pendulum => {
                for (let i = 0; i < pendulum.deflection.length; i++) {
                    if (pendulum.length[i] == 0) continue;
                    pendulum.tan[i] = pendulum.deflection[i] / pendulum.length[i];
                }
            }
            )
        },

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

const originalState = JSON.stringify(data);


function drawPendulumGraph(pendI, canvasID) {

    console.log(`drawing pendulum chart: pendulum, ${pendI}, canvasId: ${canvasID} `);
    if (charts[canvasID]) {

        charts[canvasID].destroy();

    }

    let moments = data.testWeightData.weightMoments.map(x => Number(x));
    let Ys = data.pendulumData.pendulums[pendI].tan.map(y => Number(y));

    let graphData = {
        labels: moments,
        datasets: [{
            label: 'Measurements',
            backgroundColor: 'rgb(90, 99, 132)',
            data: Ys,
            pointBackgroundColor: 'rgb(90, 99, 132)',
            pointStyle: 'rectRot',
            pointRadius: '4',
            fill: false,
            showLine: false //<- set this
        }]
    };
    
    //console.table(data.pendulumData.pendulums[pendI].tan);


    let [lineFitted, m, n] = fitLine(graphData.labels, graphData.datasets[0].data);

    /////recording the slope of the fitted line to be used later/////////
    data.shipValues.chartSlopes[pendI] = m;

    let lineLabel = "" + formatDecimal(m) + "*X + " + formatDecimal(n);
    let linearGraphYs = graphData.labels.map(x => lineFitted(x));
    graphData.datasets.push({ label: lineLabel, backgroundColor: 'rgb(140,33,50)', borderColor: 'rgb(140,33,50)', data: linearGraphYs, showLine: true });

    let config = {
        type: 'scatter',
        data: graphData,
        options: {
            scales: {
                yaxis: {
                    position: 'left',
                    title: {
                        display: 'true',
                        text: 'tangents',
                        align: 'end',
                        font: {
                            size: 14,
                        }
                    }
                },
                xaxis: {
                    position: 'center',
                    title: {
                        display: 'true',
                        text: 'moments',
                        align: 'end',
                        font: {
                            size: 14,
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Moment Chart of Pendulum ' + (pendI + 1),
                    padding: {
                        top: 10,
                        bottom: 10,
                    },
                    font: {
                        size: 16,
                    }
                }
            }
        }
    };

    charts[canvasID] = new Chart(
        document.getElementById(canvasID),
        config
    );

    return lineFitted;
}

function fitLine(Xs, Ys) {
    if (!Xs.length > 1 || !Ys.length > 1) throw 'inputs of fitLine function should be array type';
    if (Xs.length != Ys.length) throw 'length of the inputs of fitLine function should have equal length';
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
    function func(inp) {
        let x = Number(inp);
        if (isNaN(x)) throw 'input should be number';

        return (x * m) + n;
    }
    return [func, m, n];
}


const downloadData = (exportingString, exportName, extension) => {

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportingString);

    let downLoadAnchorNode = document.createElement('a');

    downLoadAnchorNode.setAttribute("href", dataStr);

    downLoadAnchorNode.setAttribute("download", exportName + extension);

    document.body.appendChild(downLoadAnchorNode);

    downLoadAnchorNode.click();

    downLoadAnchorNode.remove();

    //End of downloadData()
}



const dataBuffer = {

    projectName: "MAJESTY 120#2",

    updateTime: "",
    updateDate: "",

    shipValues: {
        name: "MAJESTY 120#2",
        displacement: "175",
    },
    testWeightData: {
        NumberOfWeightShifts: 0,
        weightNumber: 0,
        weights: [],
        weightPoses: [],
        weightMoments: [],
    },

    pendulumData: {
        numberOfPendulums: 2,
        pendulums: [],

    },
}

function updateDataBuffer() {

    dataBuffer.projectName = data.shipValues.name;

    dataBuffer.updateTime = Date.now();
    dataBuffer.updateDate = Date('timestamps');
    dataBuffer.typeVer = data.typeVer;

    for (let dat in dataBuffer.shipValues) {
        if (dat instanceof Function) continue;
        dataBuffer.shipValues[dat] = copyDataExceptFunctions(data.shipValues[dat]);

    }

    for (let dat in dataBuffer.testWeightData) {
        if (dat instanceof Function) continue;
        dataBuffer.testWeightData[dat] = copyDataExceptFunctions(data.testWeightData[dat]);

    }

    for (let dat in dataBuffer.pendulumData) {
        if (dat instanceof Function) continue;
        dataBuffer.pendulumData[dat] = copyDataExceptFunctions(data.pendulumData[dat]);
    }

    let dat = JSON.stringify(dataBuffer);

    sessionStorage.setItem('lastDataState', dat);

        console.log("buffer updated");
}

function copyDataExceptFunctions(dat) {
    let result;
    if (dat instanceof Object) {
        result = Array.isArray(dat) ? [] : {};
        for (let i in dat) {
            if (i instanceof Function) continue;
            result[i] = copyDataExceptFunctions(dat[i]);
        }
    }
    else {
        result = dat;
    }
    return result;

}

function saveDataToLocal() {
    updateDataBuffer();
    let dataJSON = JSON.stringify(dataBuffer);

    downloadData(dataJSON, dataBuffer.projectName + ".inc", ".json");
}


function formatDecimal(str, opt = { seperator: ".", decimal: 3 }) {
    let seperatorChar = opt.seperator || ".";
    let decimalNum = opt.decimal || 3;
    if (typeof str !== 'string') str = str.toString();
    if (isNaN(str)) throw "formatDecimal requires number format, but input is " + str;

    let numParts = str.split(seperatorChar);
    if (!numParts[1]) {
        let ext = ".";
        for (let i = 0; i < decimalNum; i++) {
            ext += "0";
        }
        return numParts[0] + ext;
    }
    numParts[1] = numParts[1].slice(0, decimalNum);
    return numParts[0] + seperatorChar + numParts[1];
}

function loadDataFromJSON(dataJSON) {

    console.log('looding..');
    console.log(dataJSON);

    let version = "v.1.2";
    let laodedData = JSON.parse(dataJSON);

    if (laodedData.typeVer !== version) {

        window.alert("file version is not proper to load. Please check the file selected");
        return;
    }

    data.shipValues.name = laodedData.projectName;

    for (let dat in laodedData.shipValues) {

        if (dat instanceof Function) continue;

        data.shipValues[dat] = laodedData.shipValues[dat];

    }

    for (let dat in laodedData.testWeightData) {

        if (dat instanceof Function) continue;

        data.testWeightData[dat] = laodedData.testWeightData[dat];

    }

    for (let dat in laodedData.pendulumData) {

        if (dat instanceof Function) continue;

        data.pendulumData[dat] = laodedData.pendulumData[dat];
    }

}


//FİLE I/O

const openFilePicker = () => {
    let picker = document.getElementById("filePicker");
    picker.click();
};

let ev;
function uploadSavedProject(e) {
    ev = e;

    readFile(e.target.files[0]);

}

function readFile(file) {

    let fr = new FileReader();
    fr.onload = function () {
        uploadedFileBuffer = fr.result;
        loadDataFromJSON(uploadedFileBuffer);
        
        updateAllValues();
    };

    fr.readAsText(file);

}

function checkSessionStorage() {
    let lastRecord = sessionStorage.getItem('lastDataState');
    if (lastRecord) {
        loadDataFromJSON(lastRecord);
    }
}

function refreshState(){
    let res = window.confirm('Do you want to close current project? You will lose unsaved changes');
    sessionStorage.clear();
    loadDataFromJSON(originalState);
    location.reload();
}

const fetchData = async (url, formData) => {

    try {
        const response = await fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text());
        return response.result;
    } catch (error) {
        console.error(error);
    }
}
