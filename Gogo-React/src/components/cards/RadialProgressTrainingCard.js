import React, {Component} from "react";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";
import CircularProgressbar from "react-circular-progressbar";
import axios from "axios";
import moment from "moment";

class RadialProgressTrainingCard extends Component {
  constructor(props) {
    super(props);
    this.state={
      events:[],
        trainingProgress:0
    }
  }
  componentDidMount() {
    this.dataListRenderTrainings();
  }

  dataListRenderTrainings(){
    axios
        .get(
            `${'/training'}`
        )
        .then(res => {
          console.log(res.data);
          return res.data;
        })
        .then(data => {
          this.setState({
            events:data.data,
              trainingProgress: Math.floor(data.data.filter(x=>moment(x.end)<moment()).length*100/data.data.length)
          });
          console.log(this.state.trainingProgress)
        });
  }
render(){
  const
      {
        title ,
        isSortable
      }  =this.props;

  return (
    <Card>
      {isSortable && (
        <CardHeader className="p-0 position-relative">
          <div className="position-absolute handle card-icon">
            <i className="simple-icon-shuffle" />
          </div>
        </CardHeader>
      )}
      <CardBody className="d-flex justify-content-between align-items-center">
        <CardTitle className="mb-0">{title}</CardTitle>
        <div className="progress-bar-circle">
          <CircularProgressbar
            strokeWidth={4}
            percentage={this.state.trainingProgress}
            text={`${this.state.trainingProgress}%`}
          />
        </div>
      </CardBody>
    </Card>
  );
};}
export default RadialProgressTrainingCard;
