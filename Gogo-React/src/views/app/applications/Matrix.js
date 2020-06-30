import React, {Component} from "react";
import axios from "axios";
import {Card, CardBody, CardTitle} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import ReactTable from "react-table";
import DataTablePagination from "../../../components/DatatablePagination";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
/*
* getProps: (state, rowInfo) => ({
            style: {
                backgroundColor: (rowInfo.row.title === 'Nidhal' ? 'green' : null)
            }
        })*/
var obj = {};
var ds = [];
var dt = [];
const apiUrl = "/skills";
const apiUrl2 = "/teachers";
const CustomTbodyComponent = props => (
    <div {...props} className={classnames("rt-tbody", props.className || [])}>
        <PerfectScrollbar option={{suppressScrollX: true}}>
            {props.children}
        </PerfectScrollbar>
    </div>
);
var dddd = [];
const dataTableColumns = [
    {
        Header: "Name",
        accessor: "name",
        Cell: props => <p className="list-item-heading">{props.value}</p>,


    },
    {
        Header: "DevOps",
        accessor: "DevOps",
        Cell: props => <p className="text-muted">{props.value}</p>,
        getProps: (state, rowInfo) => ({
            style: {
                backgroundColor: (rowInfo.row.DevOps === 1 ? '#02C6A3' : null)
            }
        })
    },
    {
        Header: "JAVA",
        accessor: "JAVA",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Angular",
        accessor: "Angular",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "React",
        accessor: "React",
        Cell: props => <p className="text-muted">{props.value}</p>
    }
];

class Matrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataskills: [],
            dataskillsteachers: [],
            dd: []
        }
    }

    componentDidMount() {
        this.dataListRender();
    }


    dataListRender() {


        axios
            .get(
                `${apiUrl}?pageSize=${""}&currentPage=${""}&orderBy=${
                    ""
                }&search=${""}`
            )
            .then(res => {
                console.log(res.data.data);
                return res.data.data;

            }).then(data =>
            this.setState({
                dataskills: data
            })
        );
        axios
            .get(
                `${apiUrl2}?pageSize=${""}&currentPage=${""}&orderBy=${
                    ""
                }&search=${""}`
            )
            .then(res => {
                console.log(res.data.data);
                return res.data.data;

            }).then(data =>
            this.setState({
                dataskillsteachers: data
            })
        )


    }


    render() {
        const datacolumn = [];


        for (const [index, value] of this.state.dataskillsteachers.entries()) {
            var obj = {};
            obj['name'] = value.name;
            for (const [index1, value1] of value.skills.entries()) {
                obj[value1.title] = parseInt(value1.niveau)
            }
            this.state.dd.push(obj)
        }
        for (const [index, value] of this.state.dataskills.entries()) {
            for (const [index1, value1] of this.state.dd.entries()) {
                if (!value1[value.title]) {
                    value1[value.title] = 0;
                }

            }
        }
        console.log(this.state.dd);
        for (const [index, value] of this.state.dd.entries()) {
            if (index === 0) {
                for (const [index1, value1] of Object.keys(value).entries()) {
                    console.log(value1);
                    datacolumn.push({
                        Header: value1,
                        accessor: value1,
                        Cell: props => <p className="list-item-heading">{props.value}</p>,
                        getProps: (state, rowInfo) => ({
                            style: {
                                backgroundColor: (rowInfo.row[value1] === 1 ? '#02C6A3' : rowInfo.row[value1] === 0 ? 'red' : rowInfo.row[value1] === 2 ? 'blue' : rowInfo.row[value1] === 3 ? 'yellow' : null)
                            }
                        })


                    })
                }
            }
        }
        return this.state.dd.length === 0 ? (
            <div className="loading"/>
        ) : (
            <Card className="mb-4">
                <CardBody>
                    <CardTitle>
                        {<IntlMessages id="table.react-pagination"/>}
                    </CardTitle>

                    {<ReactTable
                        data={this.state.dd}
                        columns={datacolumn}
                        defaultPageSize={6}
                        showPageJump={false}
                        showPageSizeOptions={false}
                        PaginationComponent={DataTablePagination}
                        className={"react-table-fixed-height"}
                    />}
                </CardBody>

            </Card>

        );
    }
}

export default Matrix;
