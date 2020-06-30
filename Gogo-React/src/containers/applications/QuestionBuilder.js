import React from "react";
import {
  Card,
  Button,
  Collapse,
  FormGroup,
  Label,
  Form,
  Input,
  Badge,
  CustomInput
} from "reactstrap";
import Select from "react-select";
import Sortable from "react-sortablejs";

import CustomSelectInput from "../../components/common/CustomSelectInput";
import { NotificationManager } from "../../components/common/react-notifications";


import { mapOrder } from "../../helpers/Utils";

import axios from 'axios'

const answerTypes = [
  { label: "Text Area", value: "1", id: 1 },
  { label: "Checkbox", value: "2", id: 2 },
  { label: "Radiobutton", value: "3", id: 3 }
];

/* export const dept = {
  name: state.name,
  code: state.code,
  managers: [state.teammanager.value]
} */  
export default class SurveyQuestionBuilder extends React.Component {
  constructor(props) {
    super(props);
    /* this.state = {
      collapse: this.props.expanded || false,
      mode: "edit-quesiton",
      id: this.props.id,
      title: this.props.title || "",
      question: this.props.question || "",
      answerType: this.props.answerType
        ? answerTypes.find(item => {
            return item.id === this.props.answerType;
          })
        : null,
      answers: this.props.answers || []
    }; */
    this.state = {
      collapse:  false,
      mode: "edit-quesiton",
      id: this.props.index,
      title: this.props.teacher.name || "",
      question: this.props.question || "",
      answerType: this.props.answerType
        ? answerTypes.find(item => {
            return item.id === this.props.answerType;
          })
        : null,
      answers: this.props.answers || [],

      name:"",
      code:"",
      managers :[],
      teammanager : {} ,
      teachersofdept:[],
      skills:[],

      loading : true
    };
  }

  componentDidMount() {
    this.setState({
      name : this.props.dept.name,
      code : this.props.dept.code,
      teammanager : this.props.dept.managers[0]
    })
    this.getManagers()
    this.getTeachersOfDept()
  }

  getManagers =()=>{
    axios.get('/managers/listmanagers')
    .then(r => {
      this.setState({
        managers: r.data,
        loading : false
      })

      
    })
    .catch(err => console.log("err at managers/listmanagers: " + err))

  }

  getTeachersOfDept=()=>{

    let tab = []
    this.props.dept.teachers.forEach(element => {
    //  console.log(element._id)

    axios.get(`/managers/getteacher/${element._id}`)
    .then(r => {

     // tab.push(r.data) 
     
       this.setState({
        teachersofdept : [...this.state.teachersofdept,r.data]
      }) 
     // console.log("teachersofdept : "+this.state.teachersofdept)
    })
    .catch(err => console.log("err at managers/getteacher: " + err))

    setTimeout(() => {
      console.log("state : "+this.state.teachersofdept)
    }, 1000)    
  });
//console.log("tab :"+tab)
console.log(" : "+this.state.teachersofdept)
  this.state.teachersofdept.forEach(element => {
    
    var sk =""
    element.skills.forEach(element1 => {
     sk =  element1.title+", "+sk
    });

    console.log("sk : "+sk)

    sk.substring(0,sk.length-2)

    this.setState({
      skills : [...this.state.skills,sk]
    })
  });
  }

  

  updateDept=()=>{

    //console.log(this.state)
    const  deptitem={
      name : this.state.name,
      code : this.state.code,
     // managers : [this.state.teammanager]
    }

    //console.log(this.state.teammanager)
    axios.put(`/depts/updatedept/${this.props.dept._id}`,deptitem)
    .then(res=>{

      axios.put(`/managers/affectManagerDept/${this.state.teammanager.value._id}/${this.props.dept._id}`)
      .then(res=>{
      NotificationManager.success(
        "update success",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
      window.location.reload();
      console.log(res.data)
    })
    .catch(err => console.log("err at depts/affectManagerDept: " + err))
  }).catch(err => console.log("err at /depts/updatedept/: " + err))

  setTimeout(() => {
    window.location.reload();
  }, 500);
  }

  deleteClick = () => {
    this.props.deleteClick(this.state.id);
    
       axios.delete(`/depts/deleteteacher/${this.props.teacher._id}`)
      .then(res=>
       {
        
         console.log("teacher deleted !!")
         this.getTeachersOfDept()
       })
       .catch((err)=> console.log(" at : /depts/deleteteacher/ "+err))
   
   NotificationManager.success(
     "teacher removed successfuly",
     "Success",
     3000,
     null,
     null,
     "filled"
   );
  /*  setTimeout(() => {
      window.location.reload()
   }, 1000); */
  
  };
  toggleClick = () => {
    this.setState({ collapse: !this.state.collapse });
  };
  editClick = () => {
    this.setState({ mode: "edit-quesiton" });
    this.setState({ collapse: true });
  };
  viewClick = () => {
    this.setState({ mode: "view-quesiton" });
    this.setState({ collapse: true });
  };
  typeChange = answerType => {
    if (this.state.answerType) {
      if (
        (this.state.answerType.id === 2 || this.state.answerType.id === 3) &&
        answerType.id === 1
      ) {
        this.setState({ answers: [] });
      }
    }

    this.setState({ answerType });
  };
  removeAnswer = answerId => {
    this.setState({
      answers: this.state.answers.filter(item => item.id !== answerId)
    });
  };
  addAnswer = () => {
    var nextId = 0;
    if (this.state.answers.length > 0) {
      var orderedAnswers = this.state.answers.slice().sort((a, b) => {
        return a.id < b.id;
      });
      nextId = orderedAnswers[0].id + 1;
    }
    this.setState({
      answers: [...this.state.answers, { id: nextId, label: "" }]
    });
  };

  updateAnswer = (answerId, event) => {
    var answerIndex = this.state.answers.findIndex(
      item => item.id === answerId
    );
    var answers = this.state.answers;
    answers[answerIndex]["label"] = event.target.value;
    this.setState({
      answers
    });
  };

  renderViewModeAnswers = () => {
    if (!this.state.answerType) {
      return;
    }
    switch (this.state.answerType.id) {
      case 1:
        return <Input type="text" />;
      case 2:
        return (
          <FormGroup>
            {" "}
            {this.state.answers.map(answer => {
              return (
                <CustomInput
                  key={answer.id}
                  type="checkbox"
                  id={`checkbox${this.state.id}_${answer.id}`}
                  name={`checkbox${this.state.id}`}
                  label={answer.label}
                />
              );
            })}{" "}
          </FormGroup>
        );
      case 3:
        return (
          <FormGroup>
            {this.state.answers.map(answer => {
              return (
                <CustomInput
                  key={answer.id}
                  type="radio"
                  name={`radio${this.state.id}`}
                  id={`radio${this.state.id}_${answer.id}`}
                  label={answer.label}
                />
              );
            })}
          </FormGroup>
        );
      default:
        return (
          <Input type="text" placeholder="" value={""} onChange={event => {}} />
        );
    }
  };
  

  render() {
    const { gettingData } = this.props


    return (
      <>

        {!this.state.loading ? (

          <>
            {this.props.order != 0 ? (
              <Card className={`question d-flex mb-4 ${this.state.mode}`}>
                <div className="d-flex flex-grow-1 min-width-zero">
                  <div className="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                    <div className="list-item-heading mb-0 truncate w-80 mb-1 mt-1">
                      <span className="heading-number d-inline-block">
                        {this.props.order + 1}
                      </span>
                      {this.state.title}
                    </div>
                  </div>
                  <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">

                    <Button
                      outline
                      color={"theme-3"}
                      className={`icon-button ml-1 rotate-icon-click ${
                        this.state.collapse ? "rotate" : ""
                        }`}
                      onClick={this.toggleClick}
                    >
                      <i className="simple-icon-arrow-down" />
                    </Button>

                    <Button
                      outline
                      color={"theme-3"}
                      className="icon-button ml-1"
                      onClick={this.deleteClick}
                    >
                      <i className="simple-icon-ban" />
                    </Button>
                  </div>
                </div>

                <Collapse isOpen={this.state.collapse}>
                  <div className="card-body pt-0">
                    <div className="edit-mode">
                    <center>
                        <img
                          src={"https://ui-avatars.com/api/?bold=true&name="+this.props.dept.teachers[this.props.index].name}
                          alt={this.props.dept.teachers[this.props.index].name}
                          className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xlarge"
                        />
                      <Form>
                    
                        <FormGroup>
                          <Label>Mail : </Label>
                          {this.props.dept.teachers[this.props.index].mail}
                        </FormGroup>

                        <div className="separator mb-4 mt-4" />
                        <FormGroup>

                          <Label>Specialities : </Label>
                          {this.props.dept.teachers[this.props.index].specialities}
                        </FormGroup>
                        <div className="separator mb-4 mt-4" />

                        <FormGroup>

                          <Label>Description : </Label>
                          {this.props.dept.teachers[this.props.index].description}
                        </FormGroup>
{/* 
                        <div className="separator mb-4 mt-4" />

                        <FormGroup>

                          <Label>Skills : </Label>
                          {console.log("skills : "+this.state.skills[this.props.index])}


                        </FormGroup> */}

                      </Form>
                      </center>
                    </div>

                  </div>
                </Collapse>
              </Card>
            ) : (

                //////elsee
                <>



                  <Card className={`question d-flex mb-4 ${this.state.mode}`}>
                    <div className="d-flex flex-grow-1 min-width-zero">
                      <div className="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                        <div className="list-item-heading mb-0 truncate w-80 mb-1 mt-1">

                          <center>TM : {this.props.dept.managers[0].firstname+" "+this.props.dept.managers[0].lastname}  : {this.props.dept.name} Department's Data </center>
                        </div>
                      </div>
                      <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">

                        {/*  <Button
outline
color={"theme-3"}
className="icon-button ml-1 edit-button"
onClick={this.editClick}
>
<i className="simple-icon-pencil" />
</Button> */}

                        {/*     <Button
outline
color={"theme-3"}
className="icon-button ml-1 edit-button"
onClick={this.editClick}
>
<i className="simple-icon-pencil" />
</Button> */}



                        <Button
                          outline
                          color={"theme-3"}
                          className={`icon-button ml-1 rotate-icon-click ${
                            this.state.collapse ? "rotate" : ""
                            }`}
                          onClick={this.toggleClick}
                        >
                          <i className="simple-icon-arrow-down" />
                        </Button>

                        <Button
                          outline
                          color={"theme-3"}
                          className="icon-button ml-1"
                          onClick={this.updateDept}
                          disabled={this.state.teammanager=={}}
                        >
                          <i className="simple-icon-pencil" />
                        </Button>


                      </div>
                    </div>

                    <Collapse isOpen={this.state.collapse}>
                      <div className="card-body pt-0">
                        <div className="edit-mode">
                          <Form>
                            <FormGroup>
                              <Label>Name</Label>
                              <Input
                                type="text"
                                value={this.state.name}
                                onChange={event => {
                                  this.setState({ name: event.target.value });
                                }}
                              />
                            </FormGroup>

                            <FormGroup>
                              <Label>Code</Label>
                              <Input
                                type="text"
                                value={this.state.code}
                                onChange={event => {
                                  this.setState({ code: event.target.value });
                                }}
                              />
                            </FormGroup>
                            <div className="separator mb-4 mt-4" />

                            <FormGroup>
                              <Label>Change Team manager</Label>
                              <Select
                                components={{ Input: CustomSelectInput }}
                                className="react-select"
                                classNamePrefix="react-select"
                                name="form-field-name"
                                options={this.state.managers.map((x, i) => {
                                  return { label: x.firstname + " " + x.lastname, value: x, key: i };
                                })}
                                value={this.state.teammanager}

                                onChange={val => {
                                  console.clear()
                                  // console.log(val)
                                  this.setState({ teammanager: val });
                                }}
                              />
                            </FormGroup>



                          </Form>
                        </div>

                      </div>
                    </Collapse>
                  </Card>

                  <Card className={`question d-flex mb-4 ${this.state.mode}`}>
                    <div className="d-flex flex-grow-1 min-width-zero">
                      <div className="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                        <div className="list-item-heading mb-0 truncate w-80 mb-1 mt-1">
                          <span className="heading-number d-inline-block">
                            {this.props.order + 1}
                          </span>
                          {this.state.title}
                        </div>
                      </div>
                      <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">


                        <Button
                          outline
                          color={"theme-3"}
                          className={`icon-button ml-1 rotate-icon-click ${
                            this.state.collapse ? "rotate" : ""
                            }`}
                          onClick={this.toggleClick}
                        >
                          <i className="simple-icon-arrow-down" />
                        </Button>

                        <Button
                          outline
                          color={"theme-3"}
                          className="icon-button ml-1"
                          onClick={this.deleteClick}
                        >
                          <i className="simple-icon-ban" />
                        </Button>
                      </div>
                    </div>

                    <Collapse isOpen={this.state.collapse}>
                      <div className="card-body pt-0">
                        <div className="edit-mode">
                          <center>
                            <img
                              src={"https://ui-avatars.com/api/?bold=true&name="+this.props.dept.teachers[this.props.index].name}
                              alt={this.props.dept.teachers[this.props.index].name}
                              className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xlarge"
                            />
                            <Form>
                          
                            <FormGroup>
                              <Label>Mail : </Label>
                              {this.props.dept.teachers[this.props.index].mail}
                            </FormGroup>

                            <div className="separator mb-4 mt-4" />
                            <FormGroup>

                              <Label>Specialities : </Label>
                              {this.props.dept.teachers[this.props.index].specialities}
                            </FormGroup>
                            <div className="separator mb-4 mt-4" />

                            <FormGroup>

                              <Label>Description : </Label>
                              {this.props.dept.teachers[this.props.index].description}
                            </FormGroup>
{/* 
                            <div className="separator mb-4 mt-4" />

                            <FormGroup>

                              <Label>Skills : </Label>
                                  {console.log("skills : "+this.state.skills[this.props.index])} 

                            </FormGroup> */}

                          </Form>
                          </center>
                        </div>

                      </div>
                    </Collapse>
                  </Card>

                </>
              )}
          </>

        ) : (
            <div className="loading" />
          )}


      </>
    );


  }
  
}
