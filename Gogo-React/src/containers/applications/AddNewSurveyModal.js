import React, { Component } from "react";
import { connect } from "react-redux";
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label
} from "reactstrap";
import Select, { components } from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";

import { addSurveyItem } from "../../redux/actions";
import axios from 'axios'

import { NotificationManager } from "../../components/common/react-notifications";
let i=0 
const  itemssss= [
  { label: "IT", value: "IT", key: 0 },
  { label: "Telecommunications", value: "Telecommunications", key: 1 },
  { label: "Electromechanical", value: "Electromechanical", key: 2 }
]
class AddNewSurveyModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: [],
      SelectedOptions: [],
      selectedOptionsTeacher: [],

      title: "",
      label: {},
      labelColor: "",
      category: {},
      status: "PENDING",

      name:"",
      code:"",
      teammanager :{},

      teachers :[],
      managers : []
    };
  }

  componentDidMount() {
    //window.location.reload()
    
    
    /* NotificationManager.success(
      "Departement added successfuly",
      "Success",
      3000,
      null,
      null,
      "filled"
    ); */
    //axios.get('/managers/listmanagers')
    axios.get('/managers/getmanagersnodept')
    .then(r => {
      this.setState({
       // teachers: res.data,
        managers: r.data
      })

      axios.get('/managers/listteachers')
      .then(res => {

        this.setState({ teachers: res.data })
      })
      .catch(err => console.log("err at managers/listteachers: " + err))

    })
    .catch(err => console.log("err at managers/listmanagers: " + err))


   

   
  }

  addNetItem = () => {
    const newItem = {
      title: this.state.title,
      label: this.state.label.value,
      labelColor: this.state.label.color,
      category: this.state.category.value,
      status: this.state.status
    };


    let teachersSelected = []
    this.state.selectedOptions.forEach(element => {
      let teacher = {
        _id: element.value._id,
        name: element.value.name,
        img: element.value.img,
        createDat: element.value.createDate,
        mail: element.value.mail,
        specialities: element.value.specialities,
        description: element.value.description,
        id_dept: element.value.id_dept
      }
      teachersSelected.push(teacher)
      //console.log(element)
    });
    const dept = {
      name: this.state.name,
      code: this.state.code,
      teachers: teachersSelected,
      managers: [this.state.teammanager.value]
    }
    console.log(dept.managers[0]._id)

    axios.post('/depts/adddept', dept)
    .then(res =>{
        axios.put('/managers/updatetoteammanager/'+dept.managers[0]._id)
        .catch((err)=> console.log("err at /depts/adddept :"+err))

      

      console.clear()
      console.log(res)
      
      NotificationManager.success(
        "Departement"+dept.name +" added successfuly",
        "Success",
        3000,
        null,
        null,
        "filled"
      );



    })
    .catch(err => console.log("err : " + err))

    this.props.addSurveyItem(newItem);
    this.props.toggleModal();
    this.setState({
      title: "",
      label: {},
      category: {},
      status: "ACTIVE" ,

      name:"",
      code:"",
      teammanager :{},

      teachers :[],
      managers : []
    });

    window.location.reload()
  };
  handleChangeMulti = selectedOptions => {
    this.state.selectedOptions=selectedOptions
    this.setState({selectedOptions})

    console.clear()
   console.log(this.state.selectedOptions)
};
handleChangeMultiTeachers = selectedOptionsTeacher => {
    this.setState({selectedOptionsTeacher:selectedOptionsTeacher});
    console.clear()
    console.log(this.state.selectedOptionsTeacher);
};


  
    

  render() {
    const { labels, categories } = this.props.surveyListApp;
    const { modalOpen, toggleModal } = this.props;
    
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          {/* <IntlMessages id="survey.add-new-title" /> */} Add new UI/Departement
        </ModalHeader>
        <ModalBody>
          <Label className="mt-4">
            {/* <IntlMessages id="survey.title" /> */} Name
          </Label>
          <Input
            type="text"
            defaultValue={this.state.name}
            onChange={event => {
              this.setState({ name: event.target.value });
            }}
          />

          <Label className="mt-4">
            {/* <IntlMessages id="survey.title" /> */} Code
          </Label>
          <Input
            type="text"
            defaultValue={this.state.code}
            onChange={event => {
              this.setState({ code: event.target.value });
            }}
          />

          <Label className="mt-4">
            {/* <IntlMessages id="survey.category" /> */} Select a Team Manager
          </Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            options={this.state.managers.map((x, i) => {
              return { label: x.firstname+" "+x.lastname, value: x, key: i };
            })}
            value={this.state.teammanager}
            onChange={val => {console.clear()
              console.log(val)
              this.setState({ teammanager: val });
            }}
          />
       

          <Label className="mt-4">
            {/* <IntlMessages id="survey.label" /> */} Select the team
          </Label>
          <Select
                                components={{Input: CustomSelectInput}}
                                className="react-select"
                                classNamePrefix="react-select"
                                key={i=i++}
                                isMulti
                                name="form-field-name"
                                value={this.state.selectedOptions}
                                onChange={this.handleChangeMulti}
                                  options={this.state.teachers.map((x, i) => {
                                    return { label: x.name, value: x, key: i };
                                  })}
                                
                            />


         
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggleModal}  >
            <IntlMessages id="survey.cancel" />
          </Button>
          <Button color="primary" onClick={() => this.addNetItem()}
          disabled={this.state.name=="" || this.state.code=="" || this.state.teammanager=={} || this.state.selectedOptions == []}
          >
            <IntlMessages id="survey.submit" />
          </Button>
        </ModalFooter>
     {/*    <Button
            className="mb-3"
            color="success"
            onClick={this.createNotification("success")}
          >
            <IntlMessages id="alert.success" />
          </Button>{" "} */}
      </Modal>
    );
  }
}

const mapStateToProps = ({ surveyListApp }) => {
  return {
    surveyListApp
  };
};
export default connect(
  mapStateToProps,
  {
    addSurveyItem
  }
)(AddNewSurveyModal);
