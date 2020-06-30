import React, {Component} from "react";
import axios from "axios";
import {Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import {connect} from "react-redux";
import {addTodoItem} from "../../redux/todo/actions";

var t = {};

class AddNewTeacher extends Component {

    constructor(props) {
        super(props);

        this.state = {


            name: "",
            mail: "",
            description: "",
            specialities: {value: "", label: ""},
            img: "/assets/img/profile-pic-l-2.jpg",
            createDate: new Date(),
            status: "",
            statusColor: "primary",

            sales: "",
            stock: 62,
            detail: "",
            label: {},
            labelColor: ""

        };
        


    }


    addNetItem = () => {

        const newItem = {
            img: "/assets/img/profile-pic-l-2.jpg",
            createDate: new Date(),
            statusColor: "primary",
            description: this.state.description,
            mail: this.state.mail,
            name: this.state.name,
            labelColor: this.state.label.color,
            specialities: this.state.specialities.value,

        };
        if (newItem.name !== "" && newItem.specialities !== "" && this.validateEmail(newItem.mail) === true && newItem.description !== "") {
            axios.post('/teachers/addteachers', newItem)
                .then(res => console.log(res.data));
            this.props.addTodoItem(newItem); 
            this.props.toggleModal();
            this.setState({
                name: "",
                mail: "",
                title: "",
                description: "",
                specialities: {value: "", label: ""},
                label: {},
                category: {},
                status: "PENDING"
            });
        }

    };

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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
                    {"Add New Teacher"}
                </ModalHeader>
                <ModalBody>
                    <Label className="mt-4">
                        <IntlMessages id="pages.teacher-name"/>
                    </Label>
                    <Input
                        type="text"
                        defaultValue={this.state.namemodif}
                        onChange={event => {
                            this.setState({name: event.target.value});
                            console.log(this.state.name)
                        }}
                    />
                    {(this.state.name === "") ? (
                        <div className="invalid-feedback d-block">
                            {"name is required"}
                        </div>
                    ) : null}
                    <Label className="mt-4">
                        <IntlMessages id="pages.teacher-mail"/>
                    </Label>
                    <Input
                        type="text"
                        defaultValue={this.state.mailmodif}
                        onChange={event => {
                            this.setState({mail: event.target.value});
                        }}
                    />
                    {( this.validateEmail(this.state.mail)===false) ? (
                        <div className="invalid-feedback d-block">
                            {"email invalid"}
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
                            this.setState({specialities: val});
                        }}
                    />
                    {(this.state.specialities.value === "") ? (
                        <div className="invalid-feedback d-block">
                            {"specialitie is required"}
                        </div>
                    ) : null}

                    <Label className="mt-4">
                        <IntlMessages id="todo.detail"/>
                    </Label>
                    <Input
                        type="textarea"
                        defaultValue={this.state.descriptionmodif}
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
                    <Button color="primary" onClick={() => {
                        this.props.eventmod ? this.UpdateItem() : this.addNetItem();
                        console.log(this.state)
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
)(AddNewTeacher);
