import React, {Component} from "react";
import axios from "axios";
import {Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import {connect} from "react-redux";
import {addTodoItem} from "../../redux/todo/actions";

var s = {};

class ModifierSkill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            titleverif: 0,
            specialitiesverif: 0,
            typeverif: 0,
            descriptionverif: 0,

            createDate: new Date(),
            statusColor: "primary",
            sales: "",
            label: {},
            labelColor: "",
            descriptionmodif: "",
            typemodif: {value: "", label: "", key: 0},
            titlemodif: "",
            specialitiesmodif: {value: "", label: "", key: 0}


        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props);
        if (nextProps.modif && this.state.titlemodif === "" &&
            this.state.descriptionmodif === "" && this.state.specialitiesmodif.value === ""
            && this.state.typemodif.value === "") {
            s = {
                description: nextProps.modif.description,
                title: nextProps.modif.title,
                type: nextProps.modif.type,
                specialities: nextProps.modif.specialities,
                skill_id: nextProps.modif._id
            };

            this.setState({


                descriptionmodif: s.description,
                typemodif: {value: s.type, label: s.type, key: 0},
                titlemodif: s.title,
                specialitiesmodif: {value: s.specialities, label: s.specialities, key: 0},
                skill_idmodif: s.skill_id,

            });

        }

    }

    UpdateItem = () => {
        console.log(this.state.skill_id);
        const newItem = {
            _id: this.state.skill_idmodif,
            createDate: new Date(),
            description: this.state.descriptionmodif,
            type: this.state.typemodif.value,
            title: this.state.titlemodif,
            specialities: this.state.specialitiesmodif.value
        };
        /*if (this.state.title !== "") {
            newItem.title = this.state.title;
            console.log("--------------------------------------------------------------" + newItem.title)
        }
        if (this.state.description !== "") {
            newItem.description = this.state.description;
        }
        if (this.state.type.value !== "") {
            newItem.mail = this.state.type.value;
        }
        if (this.state.specialities.value !== "") {
            newItem.specialities = this.state.specialities.value;
        }*/
        console.log("Modifier un enseignant----8 : " + newItem.title + "/" + newItem.type + "/" + newItem._id + "/" + newItem.description + "/" + newItem.specialities);
        if (newItem.title !== "" && newItem.specialities !== "" && newItem.type !== "" && newItem.description !== "") {
        axios.put('/skills/updateSkill/' + this.state.skill_idmodif, {
            createDate: new Date(),
            description: newItem.description, type: newItem.type,
            title: newItem.title, specialities: newItem.specialities
        })
            .then((res) => {
                console.log(res.data);
                console.log('Skill successfully updated')
            }).catch((error) => {
            console.log(error)
        });
        this.props.addTodoItem(newItem);
        this.props.toggleModal();
        console.log(this.state);
        this.setState({
            descriptionmodif: "",
            typemodif: {value: "", label: "", key: 0},
            titlemodif: "",
            specialitiesmodif: {value: "", label: "", key: 0},
            label: {},
            category: {},
            status: "PENDING"
        });
        }else {
            if (newItem.title === "")
                this.setState({
                    titleverif: 1
                });
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
                    {"Update Skill"}
                </ModalHeader>
                <ModalBody>

                    <Label className="mt-4">
                        <IntlMessages id="survey.title"/>
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
                            this.setState({
                                specialitiesmodif: val
                            });

                        }}

                    />
                    {(this.state.specialitiesmodif.value === "") ? (
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
                        value={this.state.typemodif}
                        onChange={val => {
                            this.setState({
                                typemodif: val
                            });
                            console.log(this.state.typemodif)
                        }}


                    />
                    {(this.state.typemodif.value === "") ? (
                        <div className="invalid-feedback d-block">
                            {"type is required"}
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
                            {"details are required"+this.state.descriptionverif}
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
)(ModifierSkill);



