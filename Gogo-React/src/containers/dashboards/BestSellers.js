import React ,{ useState,useEffect, Component }  from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import ReactTable from "react-table";

import IntlMessages from "../../helpers/IntlMessages";
import Pagination from "../../components/DatatablePagination";

import data from "../../data/products"; 

import axios from 'axios'; 


//const BestSellers = ({title="Top skills of each one"}) => {
export class BestSellers extends Component{

  constructor(props) {
    super(props);
    this.state={
      teachers : [],
      teacherstopskills : [] 
    }
  }
  componentDidMount(){
    axios.get('/managers/listteachers')
    .then(res => {

      this.setState({
        teachers : res.data
      })
      
      this.state.teachers.forEach(element => {
        let level = 0
        let topskills = ""
        let name = element.name
        element.skills.forEach(element1 => {
          //console.log(element1)
          
          if(element1.niveau>=level)
            {
              topskills = element1.title+", "+topskills
                level = element1.niveau
                
            }
        });

        topskills = topskills.substring(0,topskills.length-2)
        this.setState({
          teacherstopskills : [...this.state.teacherstopskills,
            {name:name,
              skills : topskills,
              niveau : level
            }]
        })
      });
     
    this.setState({
      teacherstopskills : this.state.teacherstopskills.sort( (a,b)=> b.niveau - a.niveau)
    }) 
//     console.log(this.state.teacherstopskills)
       
    })
    .catch(err => console.log("err at managers/listteachers: " + err))  

  }
  
   
/*  useEffect(()=>{
  getTeachersData()
 },[]) */

 //getTeachersData();
  

  render(){

   const columns = [
      {
        Header: "Name",
        accessor: "name",
        Cell: props => <p className="list-item-heading">{props.value}</p>
      },
      {
        Header: "Top Skill",
        accessor: "skills",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
      /*{
        Header: "Stock",
        accessor: "stock",
        Cell: props => <p className="text-muted">{props.value}</p>
      },*/
      {
        Header: "Level",
        accessor: "niveau",
        Cell: props => <p className="text-muted">{props.value}</p>
      }
    ];
  return (
    <Card className="h-100">
      <CardBody>
        <CardTitle>
          {/* <IntlMessages id={title} /> */}Top skills of each one
        </CardTitle>
        <ReactTable
          defaultPageSize={3}
          data={this.state.teacherstopskills}
          columns={columns}
          minRows={0}
          showPageJump={false}
          showPageSizeOptions={false}
          PaginationComponent={Pagination}
        />
      </CardBody>
    </Card>
  );
};
}
export default BestSellers;
