import React, { Component } from "react";
import { connect } from "react-redux";
import { NavItem, Badge } from "reactstrap";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";

import IntlMessages from "../../helpers/IntlMessages";
import ApplicationMenu from "../../components/common/ApplicationMenu";
import { getTodoListWithFilter } from "../../redux/actions";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
const apiUrl="/training";
class TrainingApplicationMenu extends Component {
  constructor(props) {
    super();
    this.state={
      events:[]
    }
  }

  addFilter = (column, value) => {
    this.props.getTodoListWithFilter(column, value);
  };
  componentDidMount() {
    this.dataListRender();
  }

  dataListRender(){
  axios
      .get(
          `${apiUrl}`
      )
      .then(res => {
        return res.data;
      })
      .then(data => {
        this.setState({
          events:data.data
        });
      });
}
  render() {
    const {
      todoItems,
      filter,
      allTodoItems,
      loading,
      labels,
      categories
    } = this.props.todoApp;
const{events}=this.state;
    return (
      <ApplicationMenu>
        <PerfectScrollbar
          option={{ suppressScrollX: true, wheelPropagation: false }}
        >
          <div className="p-4">
            <p className="text-muted text-small">
              <IntlMessages id="todo.status" />
            </p>
            <ul className="list-unstyled mb-5">
              <NavItem className={classnames({ active: !filter })}>
                <NavLink to="#" onClick={e => this.addFilter("", "")}>
                  <i className="simple-icon-reload" />
                  <IntlMessages id="todo.all-tasks" />
                  <span className="float-right">
                    {loading && events.length}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem
                className={classnames({
                  active:
                    filter &&
                    filter.column === "status" &&
                    filter.value === "PENDING"
                })}
              >
                <NavLink
                  to="#"
                  onClick={e => this.addFilter("status", "PENDING")}
                >
                  <i className="simple-icon-refresh" />
                  <IntlMessages id="todo.pending-tasks" />
                  <span className="float-right">
                    {loading &&
                      events.filter(x => moment(x.end) > moment()).length}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem
                className={classnames({
                  active:
                    filter &&
                    filter.column === "status" &&
                    filter.value === "COMPLETED"
                })}
              >
                <NavLink
                  to="#"
                  onClick={e => this.addFilter("status", "COMPLETED")}
                >
                  <i className="simple-icon-check" />
                  <IntlMessages id="todo.completed-tasks" />
                  <span className="float-right">
                    {loading &&
                    events.filter(x => moment(x.end) < moment()).length}
                  </span>
                </NavLink>
              </NavItem>
            </ul>
            <p className="text-muted text-small">
              <IntlMessages id="todo.categories" />
            </p>
            <ul className="list-unstyled mb-5">
              {categories.map((c, index) => {
                return (
                  <NavItem key={index}>
                    <div onClick={e => this.addFilter("category", c)}>
                      <div >
                        <i className="simple-icon-minus" />
                        <label >{c}</label>
                      </div>
                    </div>
                  </NavItem>
                );
              })}
            </ul>
            <p className="text-muted text-small">
              <IntlMessages id="todo.labels" />
            </p>
            <div>
              {labels.map((l, index) => {
                return (
                  <p className="d-sm-inline-block mb-1" key={index}>
                    <NavLink
                      to="#"
                      onClick={e => this.addFilter("label", l.label)}
                    >
                      <Badge
                        className="mb-1"
                        color={`${
                          filter &&
                          filter.column === "label" &&
                          filter.value === l.label
                            ? l.color
                            : "outline-" + l.color
                        }`}
                        pill
                      >
                        {l.label}
                      </Badge>
                    </NavLink>

                  </p>
                );
              })}
            </div>
          </div>
        </PerfectScrollbar>
      </ApplicationMenu>
    );
  }
}

const mapStateToProps = ({ todoApp }) => {
  return {
    todoApp
  };
};
export default connect(
  mapStateToProps,
  {
    getTodoListWithFilter
  }
)(TrainingApplicationMenu);
