import React, {Component} from "react";
import axios from "axios";
import {Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";

import {connect} from "react-redux";
import {addTodoItem} from "../../redux/todo/actions";

var t = {};

class ModifierTeacher extends Component {

    constructor(props) {
        super(props);

        this.state = {


            namemodif: "",
            mailmodif: "",
            descriptionmodif: "",
            specialitiesmodif: {value: "", label: ""},
            teacher_idmodif: "",
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

        //console.log(this.props.modTeacher._id)

    }


    componentWillReceiveProps(nextProps) {
        console.log(this.props)
        if (nextProps.modif && this.state.namemodif === "" &&
            this.state.descriptionmodif === "" && this.state.specialitiesmodif.value === ""
            && this.state.mailmodif === "") {
            t = {
                description: nextProps.modif.description,
                mail: nextProps.modif.mail,
                name: nextProps.modif.name,
                specialities: nextProps.modif.specialities,
                teacher_id: nextProps.modif._id
            };

            this.setState({
                descriptionmodif: t.description,
                mailmodif: t.mail,
                namemodif: t.name,
                specialitiesmodif: {value: t.specialities, label: t.specialities},
                teacher_idmodif: t.teacher_id
            });

        }

    }


    UpdateItem = () => {
        const newItem = {
            _id: this.state.teacher_idmodif,
            createDate: new Date(),
            description: this.state.descriptionmodif,
            mail: this.state.mailmodif,
            name: this.state.namemodif,
            specialities: this.state.specialitiesmodif.value
        };

        if (newItem.name !== "" && newItem.specialities !== "" && this.validateEmail(newItem.mail) === true && newItem.description !== "") {
            axios.put('/teachers/updateTeacher/' + this.state.teacher_idmodif, {
                createDate: new Date(),
                description: newItem.description, mail: newItem.mail,
                name: newItem.name, specialities: newItem.specialities
            })
                .then((res) => {

                    console.log('teachers successfully updated')
                }).catch((error) => {
                console.log(error)
            });
            this.props.addTodoItem(newItem);
            this.props.toggleModal();
            console.log(this.state);
            this.setState({
                namemodif: "",
                mailmodif: "",
                descriptionmodif: "",
                specialitiesmodif: {value: "", label: ""},
                teacher_idmodif: "",
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
                    {"Update Teacher"}
                </ModalHeader>
                <ModalBody>
                    <Label className="mt-4">
                        <IntlMessages id="pages.teacher-name"/>
                    </Label>
                    <Input
                        type="text"
                        defaultValue={this.state.namemodif}
                        onChange={event => {
                            this.setState({namemodif: event.target.value});

                        }}
                    />
                    {(this.state.namemodif === "") ? (
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
                            this.setState({mailmodif: event.target.value});
                        }}
                    />
                    {(this.validateEmail(this.state.mailmodif) === false) ? (
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
                        value={this.state.specialitiesmodif}
                        onChange={val => {
                            this.setState({specialitiesmodif: val});
                        }}
                    />
                    {(this.state.specialitiesmodif.value === "") ? (
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
                            this.setState({descriptionmodif: event.target.value});
                        }}
                    />
                    {(this.state.descriptionmodif === "") ? (
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
)(ModifierTeacher);
