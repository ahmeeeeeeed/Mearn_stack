import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Card, CardBody, CardTitle} from "reactstrap";
import moment from "moment";
import IntlMessages from "../../helpers/IntlMessages";
import axios from "axios";

const apiUrlTeachers = "/teachers";

class TeachersDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teachers: []
        }
    }

    componentDidMount() {
        this.dataListRenderTeachers();
    }

    dataListRenderTeachers() {
        axios
            .get(
                `${apiUrlTeachers}?pageSize=${""}&currentPage=${""}&orderBy=${
                    ""
                }&search=${""}`
            )
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .then(data => {
                this.setState({
                    teachers: data.data.sort((a, b) => (moment(b.createDate) - moment(a.createDate)))
                });
                console.log(this.state.teachers)
            });
    }

    render() {


        return (
            <Card>
                <CardBody>
                    <CardTitle>
                        <IntlMessages id="dashboards.recent-teachers"/>
                    </CardTitle>
                    <div className="dashboard-list-with-user">
                        <PerfectScrollbar
                            option={{suppressScrollX: true, wheelPropagation: false}}
                        >
                            {this.state.teachers.map(x =>

                                <div
                                    key={x._id}
                                    className="d-flex flex-row mb-3 pb-3 border-bottom"
                                >
                                    <NavLink to="/app/pages/details">
                                        <img
                                            src={x.img}
                                            alt={x.name}
                                            className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall"
                                        />
                                    </NavLink>

                                    <div className="pl-3 pr-2">
                                        <NavLink to="/app/pages/details">
                                            <p className="font-weight-medium mb-0 ">{x.name}</p>
                                            <p className="text-muted mb-0 text-small">
                                                {x.createDate}
                                            </p>
                                        </NavLink>
                                    </div>
                                </div>
                            )}
                        </PerfectScrollbar>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default TeachersDashBoard;
