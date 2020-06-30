import React ,{ useState, Component }from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Card, CardBody, CardTitle } from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import data from "../../data/logs";
import axios from 'axios';

//const Logs = ({props,title="trainings"}) => {
export class Logs extends Component{
 constructor(props) {
   super(props);
   this.state={
     trainings :[]
   }
   
 }
 
 componentDidMount(){
   axios.get('/managers/gettrainings')
    .then(res=>{
     this.setState({
       trainings : res.data
     })
    })
    .catch(err => console.log("error at /managers/gettrainings/ : " + err))
 }

    render(){
      //console.log(this.state.trainings)
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>
            {/* <IntlMessages id={title}/> */} Trainings
          </CardTitle> 
         
          <div className="dashboard-logs">
            <PerfectScrollbar
              option={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <table className="table table-sm table-borderless">
                <tbody>
                  {this.state.trainings.map((log, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span
                            className={`log-indicator align-middle ${
                              log.hexColor
                            }`}
                          />
                        </td>
                        <td>
                          <span className="font-weight-medium">
                            {log.title}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="text-muted">{log.start}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </PerfectScrollbar>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
}
export default Logs;
