import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import {LineChart} from "../../components/charts"

import { lineChartData } from "../../data/charts";
import { ThemeColors } from '../../helpers/ThemeColors'
import axios from 'axios';


const colors = ThemeColors()

//const SalesChartCard = () => {
export class SalesChartCard extends Component{
  constructor(props) {
    super(props);
    this.state = {
        teachers: [],
    }
}




componentDidMount (){

  this.getTeachersData()
       // .then(()=>this.doSkillsTeachersStat())

 }


  getTeachersData = async()=> {

    const result = await axios.get('/managers/listteachers')
     .then(res => {
      // console.log(res.data)
       this.setState({
        teachers: res.data
      })
      //console.log("in SalesChartCard :"+this.state.teachers)  
      
     })
     .catch(err => console.log("err : " + err))  

 }

 /* doSkillsTeachersStat(){
 
  
  
 } */
    
  render(){
  
    let labels= [];
    let skillsnumber= []
 
 
    
    this.state.teachers.map((value,index)=>{    
      labels.push(value.name)
      skillsnumber.push(value.skills.length)
      

    })
    let lineChartData1 = {
      labels: labels,
      datasets: [
        {
          label: '',
          data: skillsnumber,
          borderColor: colors.themeColor1,
          pointBackgroundColor: colors.foregroundColor,
          pointBorderColor: colors.themeColor1,
          pointHoverBackgroundColor: colors.themeColor1,
          pointHoverBorderColor: colors.foregroundColor,
          pointRadius: 6,
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          fill: false
        }
      ]
    }
       
    
   // console.log("skillsnumber : "+this.skillsnumber )
    //console.log(lineChartData1.datasets[0].data.length)

     

    
  return (
    <Card>
      {/* <div className="position-absolute card-top-buttons">
        <UncontrolledDropdown>
          <DropdownToggle color="" className="btn btn-header-light icon-button">
            <i className="simple-icon-refresh" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <IntlMessages id="dashboards.sales" />
            </DropdownItem>
            <DropdownItem>
              <IntlMessages id="dashboards.orders" />
            </DropdownItem>
            <DropdownItem>
              <IntlMessages id="dashboards.refunds" />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div> */}
      <CardBody>
        <CardTitle>
         {/*  <IntlMessages id="Number of skills of each teacher of your team"  /> */}
         Number of skills of each teacher of your team
        </CardTitle>
        <div className="dashboard-line-chart">
          <LineChart shadow data={lineChartData1} />
        </div>
      </CardBody>
    </Card>
  );
};
}

export default SalesChartCard;
