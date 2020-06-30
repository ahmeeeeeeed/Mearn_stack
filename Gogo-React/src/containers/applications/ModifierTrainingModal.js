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

class ModifierTrainingModal extends Component {
    minTime = new Date(2000, 1, 1, 8, 30);
    maxTime = new Date(2000, 1, 1, 17, 30);

    constructor(props) {
        super(props);

        this.state = {

            titlemodif: "",
            allDay: false,
            startmodif: null,
            endmodif: null,
            detailmodif: "",
            label: {},
            labelColor: "",
            categorymodif: {value: "", label: ""},
            event: {},
            status: "PENDING"
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.eventmod);
        if (nextProps.eventmod &&
            !this.state.startmodif && !this.state.endmodif) {
            console.log(nextProps.eventmod);
            session = {
                title: nextProps.eventmod.title,
                allDay: nextProps.eventmod.allDay,
                start: nextProps.eventmod.start,
                end: nextProps.eventmod.end,
                detail: nextProps.eventmod.desc,
                event_id: nextProps.eventmod._id
            };
            this.setState({
                detailmodif: nextProps.eventmod.detail,
                allDaymodif: nextProps.eventmod.allDay,
                titlemodif: nextProps.eventmod.title,
                startmodif: nextProps.eventmod.start,
                endmodif: nextProps.eventmod.end,
                categorymodif: {value: nextProps.eventmod.category, label: nextProps.eventmod.category},
                training_idmodif: nextProps.eventmod._id,
                event: nextProps.eventmod
            });

            console.log(this.state.event)
        }
    }


    handleChangeDateStartTime = date => {
        this.setState({
            startmodif: date
        });

    };
    handleChangeDateEndTime = date => {
        this.setState({
            endmodif: date
        });
        console.log(this.state.endmodif)
    };

    UpdateItem = () => {
        const newItem = {
            detail: this.state.detailmodif,
            allDay: this.state.allDaymodif,
            title: this.state.titlemodif,
            start: this.state.startmodif,
            end: this.state.endmodif,
            category: this.state.categorymodif.value,
            training_id: this.state.training_idmodif,
            hexColor:""
        };

        if (newItem.detail !== "" && newItem.title !== "" && newItem.category !== "" && this.verifDate() === true
        && newItem.start!==null) {
            if(newItem.category==="IT")
            {
                newItem.hexColor="6930db"
            }
            if(newItem.category==="Telecommunications")
            {
                newItem.hexColor="ec43ee"
            }
            if(newItem.category==="Electromechanical")
            {
                newItem.hexColor="56e11f"
            }
            axios.put('/training/updateTraining/' + this.state.training_idmodif, {
                detail: newItem.detail,
                allDay: newItem.allDay,
                title: newItem.title,
                start: newItem.start,
                end: newItem.end,
                category: newItem.category,
                hexColor:newItem.hexColor
            })
                .then((res) => {
                    console.log(res.data);
                    console.log('training successfully updated')
                }).catch((error) => {

            });

            this.props.addTodoItem(newItem);
            this.props.toggleModal();

            this.setState({
                titlemodif: "",
                allDaymodif: false,
                startmodif: null,
                endmodif: null,
                detailmodif: "",
                categorymodif: {value: "", label: ""},
                event: {}
            });
        }

    };

    verifDate() {
        return moment(this.state.endmodif) > moment(this.state.startmodif);
    }

    render() {
        const {labels} = this.props.todoApp;
        const {modalOpen, toggleModal, eventmod, categories} = this.props;
        const {start, end} = this.state;
        return (
            <Modal
                isOpen={modalOpen}
                toggle={toggleModal}
                wrapClassName="modal-right"
                backdrop="static"
            >
                <ModalHeader toggle={toggleModal}>
                    {"Update Training"}
                </ModalHeader>
                <ModalBody>

                    <Label className="mt-4">
                        <IntlMessages id="todo.title"/>
                    </Label>
                    <Input
                        type="text"
                        defaultValue={this.state.titlemodif}
                        onChange={event => {
                            this.setState({titlemodif: event.target.value});
                        }}
                    />
                    {(this.state.titlemodif === "") ? (
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
                        value={this.state.categorymodif}
                        onChange={val => {
                            this.setState({categorymodif: val});
                        }}
                    />
                    {(this.state.categorymodif.value === "") ? (
                        <div className="invalid-feedback d-block">
                            {"category  is required"}
                        </div>
                    ) : null}
                    <label className="mt-4">
                        <IntlMessages id="form-components.date-range"/>
                    </label>
                    <DatePicker
                        className="mb-5"
                        selected={this.state.startmodif ? moment(this.state.startmodif, 'DD-MM-YYYY') : moment()}
                        onChange={this.handleChangeDateStartTime}
                        placeholderText={"Select Start Date"}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        dateFormat="LLL"
                        timeCaption="Time"

                        minTime={moment(this.minTime)}
                        maxTime={moment(this.maxTime)}
                    />
                    {(!this.state.startmodif) ? (
                        <div className="invalid-feedback d-block">
                            {"start date  is required"}
                        </div>
                    ) : null}
                    <DatePicker
                        className="mb-5"
                        selected={this.state.endmodif ? moment(this.state.endmodif, 'DD-MM-YYYY') : moment()}
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
                        defaultValue={this.state.detailmodif}
                        onChange={event => {
                            this.setState({detailmodif: event.target.value});
                        }}
                    />
                    {(this.state.detailmodif === "") ? (
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
                        this.UpdateItem()
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
)(ModifierTrainingModal);
