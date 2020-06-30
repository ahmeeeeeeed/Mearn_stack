import React, {Component} from "react";
import axios from "axios";
import {Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import {connect} from "react-redux";
import {addTodoItem} from "../../redux/todo/actions";

var s = {};

class AddNewSkill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            titleverif: 0,
            specialitiesverif: 0,
            typeverif: 0,
            descriptionverif: 0,
            title: "",
            specialities: {value: "", label: "", key: 0},
            createDate: new Date(),
            type: {value: "", label: "", key: 0},
            statusColor: "primary",
            description: "",
            sales: "",
            label: {},
            labelColor: "",


        };
    }




    addNetItem = () => {
        const newItem = {
            title: this.state.title,
            createDate: new Date(),
            specialities: this.state.specialities.value,
            type: this.state.type.value,
            statusColor: "primary",
            description: this.state.description,
            labelColor: this.state.label.color,


        };
        if (newItem.title !== "" && newItem.specialities !== "" && newItem.type !== "" && newItem.description !== "") {
            axios.post('/skills/addskill', newItem)
                .then(res => console.log(res.data));
            this.props.addTodoItem(newItem);
            this.props.toggleModal();
            this.setState({
                title: "",
                specialities: {value:"",label:""},
                createDate: new Date(),
                type: {value:"",label:""},
                statusColor: "primary",
                description: "",
                detail: "",
                label: {},
                category: {},
                status: "PENDING"
            });

        } else {
            if (newItem.title === "")
                this.setState({
                    titleverif: 1
                })
            if (newItem.specialities === "")
                this.setState({
                    specialitiesverif: 1
                });
            if (newItem.type === "")
                this.setState({
                    typeverif: 1
                });
            if (newItem.description === "")
                this.setState({
                    descriptionverif: 1
                })
        }

    };

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
                    <IntlMessages id="skill.add-new-title"/>
                </ModalHeader>
                <ModalBody>

                    <Label className="mt-4">
                        <IntlMessages id="survey.title"/>
                    </Label>

                    <Input
                        type="text"
                        defaultValue={this.state.title}
                        onChange={event => {
                            this.setState({title: event.target.value,
                                titleverif:1});
                        }}

                    />
                    {(this.state.title==="") ? (
                        <div className="invalid-feedback d-block">
                            {"title is required"}
                        </div>
                    ) : null}

                    <Label className="mt-4">
                        <IntlMessages id="pages.teacher-specialities"/>
                    </Label>
                    <Select
                        components={{Input: CustomSelectInput}}
                        className="react-select"
                        classNamePrefix="react-select"
                        name="form-field-name"
                        options={categories}
                        value={this.state.specialities}
                        onChange={val => {
                            this.setState({
                                specialities:val
                            });console.log(this.state.specialities)
                        }}

                    />
                    {(this.state.specialities.value=== "") ? (
                        <div className="invalid-feedback d-block">
                            {"specialitie is required"}
                        </div>
                    ) : null}
                    <Label className="mt-4">
                        <IntlMessages id="pages.skill-type"/>
                    </Label>
                    <Select
                        components={{Input: CustomSelectInput}}
                        className="react-select"
                        classNamePrefix="react-select"
                        name="form-field-name"
                        options={categories}
                        value={this.state.type}
                        onChange={val => {
                            this.setState({
                                type: val
                            });
                            console.log(this.state.type)
                        }}

                    />
                    {(this.state.type.value === "") ? (
                        <div className="invalid-feedback d-block">
                            {"type is required"}
                        </div>
                    ) : null}
                    <Label className="mt-4">
                        <IntlMessages id="todo.detail"/>
                    </Label>
                    <Input
                        type="textarea"
                        defaultValue={this.state.description}
                        onChange={event => {
                            this.setState({description: event.target.value});
                        }}
                    />
                    {(this.state.description === "") ? (
                        <div className="invalid-feedback d-block">
                            {"details are required"}
                        </div>
                    ) : null}

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" outline onClick={toggleModal}>
                        <IntlMessages id="todo.cancel"/>
                    </Button>
                    <Button color="primary" onClick={() => {this.addNetItem()}}>
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
)(AddNewSkill);



