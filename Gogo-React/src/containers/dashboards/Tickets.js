import React,{Component} from "react";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Card, CardBody, CardTitle } from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import data from "../../data/tickets";


import axios from 'axios';

//const Tickets = () => {
  export class Tickets extends Component{
    constructor(props) {
      super(props);
      this.state = {
          teachers: [],
      }
  }

  componentDidMount (){

     if(this.props.role =="Team Manager")
    this.getTeachersData()
    else if(this.props.role =="admin")
     this.getAllTeachersData()
     else console.log("shit !!"+this.props.role) 
     this.getAllTeachersData()

   }
 getTeachersData=()=>{
  let user = JSON.parse( localStorage.getItem('connectedUser'))
  console.log(user.id)
  axios.get('/managers/getteambymanager/'+user.id)
  .then(res => {
   // console.log(res.data)
    this.setState({
     teachers: res.data
   })
   //console.log("in Tickets :"+this.state.teachers)
   
  })
  
  .catch(err => console.log("err at /getteambymanager/ : " + err))
 }
 
   getAllTeachersData=()=> {
     axios.get('/managers/listteachers')
       .then(res => {
         console.log("fezzefzefez")
        // console.log(res.data)
         this.setState({
          teachers: res.data
        })
        //console.log("in Tickets :"+this.state.teachers)
        
       })
       
       .catch(err => console.log("err : " + err))
 
   }
render() {
  return (
    <Card>
      <CardBody>
        <CardTitle>
        {/*   <IntlMessages id="Your Team" /> */}
       {this.state.role =="admin" ? (<p> All Teachers</p>): (<p> Your Team</p>) }
        </CardTitle>
        <div className="dashboard-list-with-user">
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
             {/*   {this.state.teachers.map((order, index) => { */}
            {this.state.teachers.map((ticket, index) => {
              return (
                <div
                  key={index}
                  className="d-flex flex-row mb-3 pb-3 border-bottom"
                >
                  
                  <NavLink  to={{ pathname: `/app/pages/details/?${ticket._id}` }}  >
                 
                    <img
                      src={"https://ui-avatars.com/api/?bold=true&name="+ticket.name}
                      alt={ticket.name}
                      className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall"
                    />
                  </NavLink>

                  <div className="pl-3 pr-2">
                  <NavLink  to={{ pathname: `/app/pages/details/?${ticket._id}` }}  >
                      <p className="font-weight-medium mb-0 ">{ticket.name}</p>
                      <p className="text-muted mb-0 text-small">
                        {ticket.description}
                      </p>
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </PerfectScrollbar>
        </div>
      </CardBody>
    </Card>
  );
};
  }
export default Tickets;
