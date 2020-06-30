import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  Nav,
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  TabContent,
  TabPane,
  Badge,
  Input
} from "reactstrap";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox
} from "availity-reactstrap-validation";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import Rating from "../../../components/common/Rating";

import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import RadialProgressCard from "../../../components/cards/RadialProgressCard";
import { injectIntl } from "react-intl";
import SmallLineCharts from "../../../containers/dashboards/SmallLineCharts";
import WebsiteVisitsChartCard from "../../../containers/dashboards/WebsiteVisitsChartCard";
import NewComments from "../../../containers/dashboards/NewComments";
import Orders from "../../../containers/pages/Orders";

import axios from 'axios'

class DetailsPages extends Component {
  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);
    this.state = {
      activeFirstTab: "1",
      teacher :{},
      dept : {},
      feedback : "",
      rate : 0,
      teachersfeedbacks :[],
      chowinput : false
    };
  }

  componentDidMount(){
    
    //window.location.reload()
    let link =window.location.href.slice(window.location.href.indexOf('?')+1,window.location.href.length)  
    axios.get('/managers/getteacher/'+link)
    .then(res=>{
       this.setState({teacher : res.data})
       localStorage.setItem("teacher",JSON.stringify(res.data))
    })
    .catch(err => console.log("err at /managers/getteacher/ : " + err))
    

   let teach =JSON.parse( localStorage.getItem("teacher"))
   //console.log(teach)

    axios.get('/depts/getdept/'+teach.id_dept)
    .then(res=>{
       this.setState({dept : res.data})
       //localStorage.setItem("teacher",JSON.stringify(res.data))
    })
    .catch(err => console.log("err at /depts/getdept/ : " + err))
   
    this.getTeachersfeedbacks(teach)

    
  }

  getTeachersfeedbacks = (teach)=>{
    axios.get('/managers/getteachersfeedbacks/'+teach._id)
    .then((res)=>{
      this.setState({
        teachersfeedbacks : res.data
      })
      localStorage.setItem("teachersfeedbacks",JSON.stringify(res.data))
    })
  }

  sendfeedback =()=>{

    const feedback = {
      manager: JSON.parse( localStorage.getItem("connectedUser")),
      teacher: JSON.parse( localStorage.getItem("teacher")),
      rate: this.state.rate,
      feedback: this.state.feedback
    }

    axios.post('/managers/addteacherfeedback/',feedback)
    .then(()=>
    {
      console.log("feedback and rate added successfuly");
        window.location.reload()
        
    }
        
    )
    .catch(err => console.log("err at /managers/addteacherfeedback/ : " + err))
  }
rating(x){
  //console.log(x)
    this.setState({
    rate:x.rating,
    chowinput : true
  })
    
}
  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab
      });
    }
  }
  render() {
    const { messages } = this.props.intl;

    let total = 5

    let teachFromLS =JSON.parse( localStorage.getItem("teacher"))

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
    <h1>{this.state.teacher.name} </h1>
            <div className="float-sm-right mb-2">
              <UncontrolledDropdown>
                <DropdownToggle
                  caret
                  color="primary"
                  size="lg"
                  outline
                  className="top-right-button top-right-button-single"
                >
                  <IntlMessages id="pages.actions" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>
                    <IntlMessages id="pages.header" />
                  </DropdownItem>
                  <DropdownItem disabled>
                    <IntlMessages id="pages.delete" />
                  </DropdownItem>
                  <DropdownItem>
                    <IntlMessages id="pages.another-action" />
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <IntlMessages id="pages.another-action" />
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <Breadcrumb match={this.props.match} />

            <Nav tabs className="separator-tabs ml-0 mb-5">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeFirstTab === "1",
                    "nav-link": true
                  })}
                  onClick={() => {
                    this.toggleTab("1");
                  }}
                  to="#"
                >
                  <IntlMessages id="pages.details" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeFirstTab === "2",
                    "nav-link": true
                  })}
                  onClick={() => {
                    this.toggleTab("2");
                  }}
                  to="#"
                >
                  <IntlMessages id="pages.orders" />
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.activeFirstTab}>
              <TabPane tabId="1">
                <Row>
                  <Colxx xxs="12" lg="4" className="mb-4">  
                    <Card className="mb-4">
                      <div className="position-absolute card-top-buttons">
                        <Button outline color={"white"} className="icon-button">
                          <i className="simple-icon-pencil" />
                        </Button>
                      </div>
                      <img
                        //src="https://lh3.googleusercontent.com/a-/AOh14Gi1-beXvA5XSuyTWPp60BWPEkrQAA6ssR7grmn0=s96-c"
                        src={this.state.teacher.img}
                        alt={this.state.teacher.name}
                       /*  className="card-img-top" */
                        className="border-0 rounded-circle  align-self-center "
                      />

                      <CardBody>
                        <p className="text-muted text-small mb-2">
                         {/*  <IntlMessages id="pages.description" /> */} Description
                        </p>
                        <p className="mb-3">
                         {this.state.teacher.description}
                        </p>

                        <p className="text-muted text-small mb-2">
                         {/*  <IntlMessages id="pages.description" /> */} Department
                        </p>
                        <p className="mb-3">
                         {this.state.dept.name}
                        </p>

                        <p className="text-muted text-small mb-2">
                          <IntlMessages id="pages.rating" />
                        </p>
                        <div className="mb-3">
                          <Rating total={5} rating={this.state.rate} onRate={x=>this.rating(x)} interactive={true}   />
                      
                        
                        </div>
                        <div>
                        <p className="text-muted text-small mb-2">
                          Set your feedback if you want
                        </p>

                        {this.state.chowinput ? (
                          <Input type="textarea"  id="details"
                          defaultValue={this.state.feedback}
                          onChange={event => {
                            this.setState({ feedback: event.target.value });
                          }}
                          
                          />
                          ):<></>}
                        
                          <Button color="primary" className="mb-2" onClick={this.sendfeedback} ><i className="simple-icon-check "></i>
                            {/* <IntlMessages id="button.primary" /> */} Send
                           </Button>
                        </div>

                        {/* <p className="text-muted text-small mb-2">
                          <IntlMessages id="pages.price" />
                        </p>
                        <p className="mb-3">$8,14</p> */}
                        
                        <p className="text-muted text-small mb-2">
                         {/*  <IntlMessages id="pages.ingredients" /> */} Skills
                        </p>
                        <div className="mb-3">
                          <p className="d-sm-inline-block mb-1">
                             {
                             teachFromLS.skills.map((value,index)=>{
                              return (
                                <Badge color="outline-secondary mb-1 mr-1" pill key={index} >
                              {value.title}
                            </Badge>
                              )
                            })} 
                            
                           {/*  <Badge color="outline-secondary mb-1 mr-1" pill>
                              Flour
                            </Badge>
                            <Badge color="outline-secondary mb-1 mr-1" pill>
                              Chocolate
                            </Badge>
                            <Badge color="outline-secondary mb-1 mr-1" pill>
                              Caster Sugar
                            </Badge>
                            <Badge color="outline-secondary mb-1 mr-1" pill>
                              Baking Powder
                            </Badge>
                            <Badge color="outline-secondary mb-1 mr-1" pill>
                              Milk
                            </Badge>
                            <Badge color="outline-secondary mb-1 mr-1" pill>
                              Eggs
                            </Badge>
                            <Badge color="outline-secondary mb-1 mr-1" pill>
                              Vegetable Oil
                            </Badge> */}
                          </p>
                        </div>

                        {/* <p className="text-muted text-small mb-2">
                          <IntlMessages id="pages.is-vegan" />
                        </p>
                        <p>No</p> */}
                      </CardBody>
                    </Card>
                    <Row>
                      <Colxx xxs="12" className="mb-4">
                        <RadialProgressCard
                          className="mb-4"
                          title={messages["pages.order-status"]}
                          percent={85}
                          isSortable={false}
                        />
                      </Colxx>
                      <Colxx xxs="12" className="mb-4">
                        <RadialProgressCard
                          className="mb-4"
                          title={messages["pages.order-status"]}
                          percent={40}
                          isSortable={false}
                        />
                      </Colxx>
                    </Row>
                  </Colxx>

                  <Colxx xxs="12" lg="8">
                    <SmallLineCharts itemClass="dashboard-small-chart-analytics" />
                    <WebsiteVisitsChartCard className="mb-4" controls={false} />
                    {console.log(this.state.teachersfeedbacks)}
                    <NewComments className="mb-4" teachersfeedbacks={this.state.teachersfeedbacks} displayRate={true} />
                  </Colxx>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Orders />
              </TabPane>
            </TabContent>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
export default injectIntl(DetailsPages);
