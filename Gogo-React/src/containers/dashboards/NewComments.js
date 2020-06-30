import React, { Component } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink } from "react-router-dom";

import IntlMessages from "../../helpers/IntlMessages";

import comments from "../../data/comments";
import Rating from "../../components/common/Rating";
import axios from 'axios'
import { render } from "jade";
export class  NewComments extends Component{

  constructor(props) {
    super(props);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

  }
  forceUpdateHandler(){
    this.forceUpdate();
   
  };
  componentWillReceiveProps({props}) {
    //console.log(this.props.teachersfeedbacks)
    this.setState({...this.state,props})
  }

  
  componentDidMount() {
    this.handleUpdateName();
  }
  componentDidUpdate(prevProps, prevState) {
   // console.log("prevProps : "+prevProps.teachersfeedbacks )
   // console.log("props : "+this.props.teachersfeedbacks)
   /*  if (prevState.name !== this.state.name) {
      this.handleUpdateName();
    } */
  }
  handleUpdateName = () => {
    //this.setState({ name: this.props.name })
     
  }



 //= ({teachersfeedbacks, className = "", displayRate = false }) => {


/* var test = []
 const getTeachersfeedbacks = ()=>{
    let teach =JSON.parse( localStorage.getItem("teacher"))

    axios.get('/managers/getteachersfeedbacks/'+teach._id)
    .then((res)=>{
      test.push(  res.data)
      console.log("incommets : "+test)
    })
  } */

  render(){
    
  
  return (
    <Card className={this.props.className}>
    {/*   {console.log("in comments fiedl : "+teachersfeedbacks)}
       */}
      <CardBody>
        <CardTitle>
          <IntlMessages id="dashboards.feedback" />
        </CardTitle>
        <div className="dashboard-list-with-user">
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
             {this.props.teachersfeedbacks &&   this.props.teachersfeedbacks.map((item, index) => {
              return (
                <div
                  key={index}
                  className="d-flex flex-row mb-3 pb-3 border-bottom"
                >
                  {/* <NavLink to="/app/pages/details"> */}
                    <img
                      src={"https://ui-avatars.com/api/?bold=true&name="+item.manager.firstname}
                      alt={item.teacher.name}
                      className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall"
                    />
                {/*   </NavLink> */}

                  <div className="pl-3 pr-2">
                   {/*  <NavLink to="/app/pages/details"> */}
                      <p className="font-weight-medium mb-0">{item.manager.firstname+" "+item.manager.lastname}</p>
                      <p className="text-muted mb-0 text-small">
                        {item.feedback}
                      </p>
                      {this.props.displayRate && (
                        <div className="form-group mb-1 mt-2">
                          <Rating total={5} rating={item.rate} interactive={false} />
                        </div>
                      )}
                   {/*  </NavLink> */}
                  </div>
                </div>
              );
            })}
           {/*  {comments.map((item, index) => {
              return (
                <div
                  key={index}
                  className="d-flex flex-row mb-3 pb-3 border-bottom"
                >
                  <NavLink to="/app/pages/details">
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall"
                    />
                  </NavLink>

                  <div className="pl-3 pr-2">
                    <NavLink to="/app/pages/details">
                      <p className="font-weight-medium mb-0">{item.title}</p>
                      <p className="text-muted mb-0 text-small">
                        {item.detail}
                      </p>
                      {displayRate && (
                        <div className="form-group mb-1 mt-2">
                          <Rating total={5} rating={5} interactive={false} />
                        </div>
                      )}
                    </NavLink>
                  </div>
                </div>
              );
            })} */}
          </PerfectScrollbar>
        </div>
      </CardBody>
    </Card>
  );
}
 }

export default NewComments;
