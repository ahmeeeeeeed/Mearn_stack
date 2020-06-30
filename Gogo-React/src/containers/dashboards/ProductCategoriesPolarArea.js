import React, { Component,useState } from "react";
import {  Card,  CardBody,  CardTitle} from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import {PolarAreaChart} from "../../components/charts"

import { polarAreaChartData } from "../../data/charts";

import { ThemeColors } from '../../helpers/ThemeColors'
import axios from 'axios';
const colors = ThemeColors()

//const ProductCategoriesPolarArea = ({chartClass="chart-container"}) => {
export class ProductCategoriesPolarArea extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trainings: [],
      tottrainings:0
  }
  }
  
  componentDidMount(){
    
    this.getTrainings()
    this.getTrainingsTeachersSameDept()
   
    
  }

  getTrainings(){
    axios.get('/managers/gettrainings')
    .then(res => {
      //console.log(res.data)
      this.setState({
        trainings : res.data
      })
    })
    .catch(err => console.log("err : " + err)) 
  }

  getTrainingsTeachersSameDept(){

    const connectedUser = JSON.parse(localStorage.getItem('connectedUser'))
    axios.get('/managers/getmanager/' + connectedUser.id)
      .then(r => {
        axios.get('/managers/getteachersbydept/'+r.data.id_dept)
          .then(res => {
            res.data.forEach(element => {
              this.setState({ tottrainings: this.state.tottrainings + element.trainings.length })
            });

           // console.log(this.state.tottrainings)

          })
          .catch(err => console.log("error at /managers/getmanager/ : " + err))
      })
      .catch(err => console.log("err at /managers/getteachersbydept/ : " + err))

  }
 
render(){

 

  const polarAreaChartData1 = {
    labels: ['Trainings Done', 'All trainings'],
    datasets: [
      {
        data: [this.state.trainings.length, /*this.state.tottrainings*/10],
        borderWidth: 2,
        borderColor: [colors.themeColor1, colors.themeColor2, colors.themeColor3],
        backgroundColor: [
          colors.themeColor1_10,
          colors.themeColor2_10,
          colors.themeColor3_10
        ]
      }
    ]
  }
  return (
    <Card>
      <CardBody>
        <CardTitle>
        {/* <IntlMessages id="Training done / All trainings" /> */}Training done / All trainings
        </CardTitle>
        <div className="chart-container">
          <PolarAreaChart shadow data={polarAreaChartData1} />
        </div>
      </CardBody>
    </Card>
  );
};
}

export default ProductCategoriesPolarArea;
