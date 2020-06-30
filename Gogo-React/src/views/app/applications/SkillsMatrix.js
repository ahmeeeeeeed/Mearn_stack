import React, {Component, Fragment} from "react";

import ListPageHeadingSkillsMatrix from "../../../containers/pages/ListPageHeadingSkillsMatrix";
import axios from "axios";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Badge, Card, CardBody, CardTitle} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import ReactTable from "react-table";
import DataTablePagination from "../../../components/DatatablePagination";
import {centerTextPlugin} from "../../../components/charts/util";

const CustomTbodyComponent = props => (
    <div {...props} className={classnames("rt-tbody", props.className || [])}>
        <PerfectScrollbar option={{suppressScrollX: true}}>
            {props.children}
        </PerfectScrollbar>
    </div>
);
const apiUrl = "/skills";
const apiUrl2 = "/teachers";


class SkillsMatrix extends Component {
    constructor(props) {
        super(props);
        this.mouseTrap = require('mousetrap');
        this.state = {
            dataskills: [],
            dataskillsteachers: [],
            dd: [],
            datacolumn: [],
            displayMode: "thumblist",
            selectedPageSize: 8,
            orderOptions: [
                {column: "name", label: "Name"},
                {column: "mail", label: "Mail"},
                {column: "specialities", label: "Specialities"}
            ],
            pageSizes: [8, 12, 24],


            selectedOrderOption: {column: "name", label: "Name"},
            dropdownSplitOpen: false,
            modalOpen: false,
            modalOpenUpdate: false,
            currentPage: 1,
            totalItemCount: 0,
            totalPage: 1,
            search: "",
            selectedItems: [],
            lastChecked: null,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.dataListRender();

    }

    dataListRender() {
        const {
            selectedPageSize,
            currentPage,
            selectedOrderOption,
            search
        } = this.state;
        this.setState({
            dataskills: [],
            dataskillsteachers: [],
            dd: [],
            datacolumn: []
        });
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
                `${apiUrl2}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${
                    selectedOrderOption.column
                }&search=${search}`
            )
            .then(res => {
                console.log(res.data.data);
                return res.data.data;

            }).then(data => {
                this.setState({
                    dataskillsteachers: data,
                    isLoading:true
                });
                 if(this.state.dataskillsteachers.length===0){
                     this.setState({
                         dataskillsteachers:[{name:"",skills:[]}]
                     })

                 }
            }
        );


    }



    changeOrderBy = column => {
        this.setState(
            {
                selectedOrderOption: this.state.orderOptions.find(
                    x => x.column === column
                )
            }
        );
    };
    changePageSize = size => {
        this.setState(
            {
                selectedPageSize: size,
                currentPage: 1
            },
            () => this.dataListRender()
        );
    };


    onSearchKey = e => {
        if (e.key === "Enter") {
            this.setState(
                {
                    search: e.target.value.toLowerCase()
                },
                () => this.dataListRender()
            );
        }
    };


    render() {
        const {
            currentPage,
            items,
            selectedPageSize,
            totalItemCount,
            selectedOrderOption,
            selectedItems,
            orderOptions,
            pageSizes,
            modalOpenUpdate,
            modalOpen,
            categories,
            dd,
            datacolumn
        } = this.state;
        const {match} = this.props;
        const startIndex = (currentPage - 1) * selectedPageSize;
        const endIndex = currentPage * selectedPageSize;
        for (const [index, value] of this.state.dataskillsteachers.entries()) {
            var obj = {};
            obj['name'] = value.name;
            for (const [index1, value1] of value.skills.entries()) {
                obj[value1.title] = parseInt(value1.niveau)
            }
            console.log(obj);
            this.state.dd.push(obj)
        }

        console.log(this.state.dd);
        for (const [index, value] of this.state.dataskills.entries()) {
            for (const [index1, value1] of this.state.dd.entries()) {
                if (!value1[value.title]) {
                    value1[value.title] = 0;
                }

            }
        }
        console.log(this.state.dataskills);
        for (const [index, value] of this.state.dd.entries()) {
            if (index === 0) {
                for (const [index1, value1] of Object.keys(value).entries()) {
                    console.log(value1);
                    this.state.datacolumn.push({
                        Header: value1,
                        accessor: value1,
                        Cell: props => <p className="list-item-heading">{props.value}</p>,
                        getProps: (state, rowInfo) => ({
                            style: {
                                backgroundColor: ((!rowInfo ) ? null :rowInfo.row[value1]===1?"#A9F1DF":
                                        (!rowInfo ) ? null :rowInfo.row[value1]===0?"#EA8D8D":
                                            (!rowInfo ) ? null :rowInfo.row[value1]===2?"#00B7FF":
                                                (!rowInfo ) ? null :rowInfo.row[value1]===3?"#C6EA8D":null
                                    )
                            }
                        })


                    })
                }
            }
        }

        return this.state.dd.length===0? (
            <div className="loading" />
        ) :(
            <Fragment>
                <div className="disable-text-selection">
                    <ListPageHeadingSkillsMatrix
                        heading="menu.skillsmatrix"
                        changeDisplayMode={this.changeDisplayMode}
                        handleChangeSelectAll={this.handleChangeSelectAll}
                        changeOrderBy={this.changeOrderBy}
                        changePageSize={this.changePageSize}
                        selectedPageSize={selectedPageSize}
                        totalItemCount={totalItemCount}
                        selectedOrderOption={selectedOrderOption}
                        match={match}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        selectedItemsLength={selectedItems ? selectedItems.length : 0}
                        itemsLength={items ? items.length : 0}
                        onSearchKey={this.onSearchKey}
                        orderOptions={orderOptions}
                        pageSizes={pageSizes}
                        toggleModal={this.toggleModal}
                    />
                    <div>
                        <Card className="mb-4">
                            <CardBody>
                                <CardTitle className="align-content-xs-center">
                                    <center>
                                    <div>
                                    <Badge color="niveau0" pill className="mb-1">
                                        {"Level 0"}
                                    </Badge>{" "}
                                    <Badge color= "niveau1" pill className="mb-1">
                                        {"Level 1"}
                                    </Badge>{" "}
                                    <Badge color="niveau2" pill className="mb-1">
                                        {"Level 2"}
                                    </Badge>{" "}
                                    <Badge color="niveau3" pill className="mb-1">
                                        {"Level 3"}
                                    </Badge>{" "}
                                    </div>
                                    </center>
                                </CardTitle>

                                {<ReactTable
                                    data={this.state.dd}
                                    columns={this.state.datacolumn}
                                    defaultPageSize={10}
                                    showPageJump={false}
                                    showPageSizeOptions={false}
                                    PaginationComponent={DataTablePagination}
                                    className={"react-table-fixed-height"}
                                />}
                            </CardBody>

                        </Card>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default SkillsMatrix;
