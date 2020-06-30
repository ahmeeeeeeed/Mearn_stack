import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import data from "../../data/cakes";
import axios from "axios";

class SkillsDashBoard extends Component{
  constructor(props) {
    super(props);
    this.state={
      skills:[]
    }
  }
  componentDidMount() {
    this.dataListRender()
  }

  dataListRender() {

    axios
        .get(
            `${'/skills'}?pageSize=${''}&currentPage=${''}&orderBy=${
                ''
            }&search=${''}`
        )
        .then(res => {
          return res.data;
        })
        .then(data => {
          this.setState({
            skills:data.data
          });
          console.log(this.state.skills)
        });
  }
render() {
const {skills}=this.state.skills;

  return (
    <Card className="dashboard-link-list">
      <CardBody>
        <CardTitle>
          <IntlMessages id="dashboards.skills" />
        </CardTitle>
        <div className="d-flex flex-row">
          <div className="w-50">
            <ul className="list-unstyled mb-0">
              {this.state.skills.map(x =>

                  <li key={x._id} className="mb-1">
                    <i className="simple-icon-badge" />
                    {"  "+x.title}
                  </li>

              )}
            </ul>
          </div>

          <div className="w-50">
            <ul className="list-unstyled mb-0">
              {this.state.skills.map(x =>

                  <li key={x._id} className="mb-1">

                    {x.type}
                  </li>

              )}
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
}

export default SkillsDashBoard;
