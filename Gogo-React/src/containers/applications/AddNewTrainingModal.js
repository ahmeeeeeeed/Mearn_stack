import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import "react-datepicker/dist/react-datepicker.css";
import {addTodoItem} from "../../redux/actions";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";

var session = {};

class AddNewTrainingModal extends Component {
    minTime = new Date(2000, 1, 1, 8, 30);
    maxTime = new Date(2000, 1, 1, 17, 30);

    constructor(props) {
        super(props);

        this.state = {

            title: "",
            allDay: false,
            start: null,
            end: null,
            detail: "",
            label: {},
            labelColor: "",
            category: {value: "", label: ""},
            event: {},
            status: "PENDING"
        };
    }


    handleChangeDateStartTime = date => {
        this.setState({
            start: date
        });
        //console.log(this.state.start)
    };
    handleChangeDateEndTime = date => {
        this.setState({
            end: date
        });
        //console.log(this.state.end)
    };
    addNetItem = () => {
        const newItem = {
            title: this.state.title,
            detail: this.state.detail,
            start: this.state.start,
            end: this.state.end,
            allDay: this.state.allDay,
            status: this.state.status,
            labelColor: this.state.label.color,
            category: this.state.category.value,
            hexColor:""
        };
        if (newItem.detail !== "" && newItem.title !== "" && newItem.category !== "" && this.verifDate() === true
            && newItem.start !== null) {
            if (newItem.category === "IT") {
                newItem.hexColor = "6930db"
            }
            if (newItem.category === "Telecommunications") {
                newItem.hexColor = "ec43ee"
            }
            if (newItem.category === "Electromechanical") {
                newItem.hexColor = "56e11f"
            }
            axios.post('/training/addtraining', newItem)
                .then(res => console.log(res.data));
            this.props.addTodoItem(newItem);
            this.props.toggleModal();
            this.setState({
                title: "",
                detail: "",
                start: null,
                end: null,
                label: {},
                category: {value: "", label: ""},
                status: "PENDING"
            });
        }
    };

    verifDate() {
        return moment(this.state.end) > moment(this.state.start);
    }

    render() {
        const {labels} = this.props.todoApp;
        const {modalOpen, toggleModal, categories} = this.props;
        return (
            <Modal
                isOpen={modalOpen}
                toggle={toggleModal}
                wrapClassName="modal-right"
                backdrop="static"
            >
                <ModalHeader toggle={toggleModal}>
                    <IntlMessages id="training.add-new-title"/>
                </ModalHeader>
                <ModalBody>

                    <Label className="mt-4">
                        <IntlMessages id="todo.title"/>
                    </Label>
                    <Input
                        type="text"
                        defaultValue={this.state.title}
                        onChange={event => {
                            this.setState({title: event.target.value});
                        }}
                    />
                    {(this.state.title === "") ? (
                        <div className="invalid-feedback d-block">
                            {"title is required"}
                        </div>
                    ) : null}


                    <Label className="mt-4">
                        <IntlMessages id="todo.category"/>
                    </Label>
                    <Select
                        components={{Input: CustomSelectInput}}
                        className="react-select"
                        classNamePrefix="react-select"
                        name="form-field-name"
                        options={categories}
                        value={this.state.category}
                        onChange={val => {
                            this.setState({category: val});
                        }}
                    />
                    {(this.state.category.value === "") ? (
                        <div className="invalid-feedback d-block">
                            {"category  is required"}
                        </div>
                    ) : null}
                    <label className="mt-4">
                        <IntlMessages id="form-components.date-range"/>
                    </label>
                    <DatePicker
                        className="mb-5"
                        selected={this.state.start}
                        onChange={this.handleChangeDateStartTime}
                        placeholderText={"Select Start Date"}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="Time"
                        minTime={moment(this.minTime)}
                        maxTime={moment(this.maxTime)}
                    />
                    {(!this.state.start) ? (
                        <div className="invalid-feedback d-block">
                            {"start date  is required"}
                        </div>
                    ) : null}
                    <DatePicker
                        className="mb-5"
                        selected={this.state.end}
                        onChange={this.handleChangeDateEndTime}
                        placeholderText={"Select End Date"}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="Time"
                        minTime={moment(this.minTime)}
                        maxTime={moment(this.maxTime)}
                    />
                    {(this.verifDate() === false) ? (
                        <div className="invalid-feedback d-block">
                            {"end date invalid"}
                        </div>
                    ) : null}
                    <Label className="mt-4">
                        <IntlMessages id="todo.detail"/>
                    </Label>
                    <Input
                        type="textarea"
                        defaultValue={this.state.detail}
                        onChange={event => {
                            this.setState({detail: event.target.value});
                        }}
                    />
                    {(this.state.detail === "") ? (
                        <div className="invalid-feedback d-block">
                            {"details are required"}
                        </div>
                    ) : null}

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" outline onClick={toggleModal}>
                        <IntlMessages id="todo.cancel"/>
                    </Button>
                    <Button color="primary" onClick={() => {
                        this.addNetItem();
                    }}>
                        <IntlMessages id="todo.submit"/>
                    </Button>{" "}
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = ({todoApp}) => {
    return {
        todoApp
    };
};
export default connect(
    mapStateToProps,
    {
        addTodoItem
    }
)(AddNewTrainingModal);
