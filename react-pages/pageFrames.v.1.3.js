const pageFrameReactNodes = {
    page_pendulums: "",
    page_weightshifts: "",
}

const closables = {};
const updatables = [];

function updateAllValues(init = true){
    let counter = 0;
    for(let elem of updatables){
        console.log(counter++);
        elem.onValuesChange(init);
    }
    chartsNode.changeCanvases();
}

class ClosingCross extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        closables[this.props.parent].closeNode();
    }

    render() {
        return (
            <div className="closing-cross" onClick={this.handleClick}>X</div>

        );

    }
}


class ClosableFrameWithCross extends React.Component {
    constructor(props) {
        super(props);

        this.name = this.props.pagename;

        this.openNode = this.openNode.bind(this);
        this.closeNode = this.closeNode.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);

        closables[this.name] = this;

        this.state = {
            classNames: "closable " + this.props.className + " ",
            isOpen: "div-closed",
        }

        pageFrameReactNodes[this.name] = this;
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
                <div className="inner-frame">
                    <ClosingCross parent={this.name} />
                    <h2>{this.props.pageheader || "CLOSABLE FRAME WITH CROSS" }</h2>
                    {this.props.children}
                </div>
            </div>

        );

    }
}


class CacheInputsNumber extends React.Component {
    constructor(props) {
        super(props);

        /* Custom Props
        *this.props.registerValueFunc(newValue);
        *this.props.triggerActionFunc(e, newValue);
        */

        this.handleClick = this.handleClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleClick(e) {
        e.target.value = "";
    }

    handleInputChange(e) {

        let index = Number(e.target.name);

        if (e.target.value == "") {

            e.target.value = this.props.defaultValue;

            return;

        }

        let newValue = Number(e.target.value);

        if (this.props.registervaluefunc) {
            this.props.registervaluefunc(newValue);
        }
        if (this.props.triggeractionfunc) {
            this.props.triggeractionfunc(e, newValue);
        }

    }

    render() {

        return (
            <input
                className={this.props.className}
                onClick={this.handleClick}
                onBlur={this.handleInputChange}
                type="number"
                contentEditable="true"
                defaultValue={this.props.defaultValue}
            />
        );
    }
}



class CacheInputsText extends React.Component {
    constructor(props) {
        super(props);

        /* Custom Props
        *this.props.registerValueFunc(newValue);
        *this.props.triggerActionFunc(e, newValue);
        */

        this.handleClick = this.handleClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleClick(e) {
        e.target.value = "";
    }

    handleInputChange(e) {

        let index = e.target.name;

        if (e.target.value == "") {

            e.target.value = this.props.defaultValue;

            return;

        }

        let newValue = e.target.value;

        if (this.props.registervaluefunc) {
            this.props.registervaluefunc(newValue);
        }
        if (this.props.triggeractionfunc) {
            this.props.triggeractionfunc(e, newValue);
        }

    }

    render() {

        return (
            <input
                className={this.props.className}
                onClick={this.handleClick}
                onBlur={this.handleInputChange}
                type="text"
                contentEditable="true"
                defaultValue={this.props.defaultValue}
            />
        );
    }
}
