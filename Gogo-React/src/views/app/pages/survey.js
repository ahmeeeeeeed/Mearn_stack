import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  ButtonDropdown,
  CustomInput
} from "reactstrap";

import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";

import {
  getSurveyList,
  getSurveyListWithOrder,
  getSurveyListSearch,
  selectedSurveyItemsChange
} from "../../../redux/actions";

import SurveyListItem from "../../../components/applications/SurveyListItem";
import AddNewSurveyModal from "../../../containers/applications/AddNewSurveyModal";
import SurveyApplicationMenu from "../../../containers/applications/SurveyApplicationMenu";

import { NotificationManager } from "../../../components/common/react-notifications";


import axios from 'axios';

class SurveyApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      lastChecked: null,

      title: "",
      label: {},
      category: {},
      status: "ACTIVE",
      displayOptionsIsOpen: false,

      depts : [],

      teachers :[],
      managers : [],

      selectedItems :[]
    };
  }
  componentDidMount() {
    this.props.getSurveyList();
    //console.log(this.props.surveyListApp)
    this.getDepts();
    //console.log(this.state.depts)
    
  }

  getDepts(){
    axios.get('/depts/listdepts')
    .then(res => {
      //console.log(res.data)
     // this.state.depts = res.data
      this.setState({
        depts : res.data
      })

     
    })
    .catch(err => console.log("err at /depts/listdepts : " + err)) 
    
  }

  getTeachersAndManagers(){
    axios.get('/managers/listteachers')
    .then(res => {
       axios.get('/managers/listmanagers')
      .then(r=>{
        this.setState({
        teachers : res.data,
        managers : r.data
      })
      })
      .catch(err => console.log("err at managers/listmanagers: " + err)) 
  
    })
    .catch(err => console.log("err at managers/listteachers: " + err))  
  }

  deleteDept=()=>{

    console.log("deleteDept() : "+this.state.selectedItems)
     this.state.selectedItems.forEach(element => {
       axios.delete(`/depts/deletedept/${element._id}/${element.managers[0]._id}`)
       .then(res=>
        {
          
          
          console.log("deleted !")
        }) .catch((err) => console.log("er at /depts/deletedept/ : "+err))
    })
   
    NotificationManager.success(
      "Department removed successfuly",
      "Success",
      3000,
      null,
      null,
      "filled"
    );
     setTimeout(() => {
       window.location.reload()
    }, 1000); 
   

   

  }

  toggleDisplayOptions = () => {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    },()=>this.getDepts());
    
  };

  toggleSplit = () => {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  };

  changeOrderBy = column => {
    this.props.getSurveyListWithOrder(column);
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.props.getSurveyListSearch(e.target.value);
    }
  };

  handleCheckChange = (event, id) => {
    
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = Object.assign(
      [],
      this.props.surveyListApp.selectedItems
    );
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.props.selectedSurveyItemsChange(selectedItems);

    if (event.shiftKey) {
      var items = this.props.surveyListApp.surveyItems;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.props.selectedSurveyItemsChange(selectedItems);
      
    }

    this.setState({selectedItems : selectedItems})
    console.log(selectedItems)
    
    return;
  };
  handleChangeSelectAll = () => {
    if (this.props.surveyListApp.loading) {
      if (
        this.props.surveyListApp.selectedItems.length >=
        this.props.surveyListApp.surveyItems.length
      ) {
        this.props.selectedSurveyItemsChange([]);
        this.setState({selectedItems : []})
      } else {
        this.props.selectedSurveyItemsChange(
          this.props.surveyListApp.surveyItems.map(x => x.id)
        );
       
      }
    }
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  render() {
    const {
      surveyItems,
      searchKeyword,
      loading,
      orderColumn,
      orderColumns,
      selectedItems
    } = this.props.surveyListApp;
    const { messages } = this.props.intl;
    const { modalOpen } = this.state;
    return (
      <Fragment>
        
        <Row className="app-row survey-app">
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>
                <IntlMessages id="menu.depeatement" />
              </h1>

              {loading && (
                <div className="float-sm-right">
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button mr-1"
                    onClick={this.toggleModal}
                  >
                    <IntlMessages id="survey.add-new" />
                  </Button>
                 
                 {/*  <Button
                    color="danger"
                    size="lg"
                    className=" btn btn-primary pl-4 pr-0"
                    onClick={this.deleteDept}
                  >
                   Delete
                  </Button> */}
                  
                  
                  
                  <ButtonDropdown
                    isOpen={this.state.dropdownSplitOpen}
                    toggle={this.toggleSplit}
                   // disabled={this.state.selectedItems.length==0}
                    
                  >
                    <div className="btn btn-primary pl-4 pr-0 check-button check-all">
                      <CustomInput
                        className="custom-checkbox mb-0 d-inline-block"
                        type="checkbox"
                        id="checkAll"
                        checked={selectedItems.length >= surveyItems.length}
                        onClick={() => this.handleChangeSelectAll()}
                        onChange={() => this.handleChangeSelectAll()}
                        label={
                          <span
                            className={`custom-control-label ${
                              selectedItems.length > 0 &&
                              selectedItems.length < surveyItems.length
                                ? "indeterminate"
                                : ""
                            }`}
                          />
                        }
                      />
                    </div>
                    <DropdownToggle
                      caret
                      color="primary"
                      className="dropdown-toggle-split pl-2 pr-2"
                      
                    />
                    <DropdownMenu right>
                      <DropdownItem onClick={this.deleteDept} disabled={this.state.selectedItems.length==0} >
                        <IntlMessages id="survey.delete" />
                      </DropdownItem>
                     {/*  <DropdownItem>
                        <IntlMessages id="survey.another-action" />
                      </DropdownItem> */}
                    </DropdownMenu>
                  </ButtonDropdown> 
                </div>
              )}

              <Breadcrumb match={this.props.match} />
            </div>

            <div className="mb-2">
              <Button
                color="empty"
                id="displayOptions"
                className="pt-0 pl-0 d-inline-block d-md-none"
                onClick={this.toggleDisplayOptions}
              >
                <IntlMessages id="survey.display-options" />{" "}
                <i className="simple-icon-arrow-down align-middle" />
              </Button>

              <Collapse
                className="d-md-block"
                isOpen={this.state.displayOptionsIsOpen}
              >
                <div className="d-block mb-2 d-md-inline-block">
                  <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                    <DropdownToggle caret color="outline-dark" size="xs">
                      <IntlMessages id="survey.orderby" />
                      {orderColumn ? orderColumn.label : ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {orderColumns.map((o, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => this.changeOrderBy(o.column)}
                          >
                            {o.label}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                    <input
                      type="text"
                      name="keyword"
                      id="search"
                      placeholder={messages["menu.search"]}
                      defaultValue={searchKeyword}
                      onKeyPress={e => this.handleKeyPress(e)}
                    />
                  </div>
                </div>
              </Collapse>
            </div>
            <Separator className="mb-5" />
            
            <Row>
              {loading ? (
                /* surveyItems.map((item, index) => { */
                  this.state.depts.map((item, index) => {
                    //console.log(item.managers[0].firstname)
                  return (
                    <SurveyListItem
                      key={`todo_item_${index}`}
                      item={item}
                      handleCheckChange={this.handleCheckChange}
                      isSelected={
                        loading ? selectedItems.includes(item) : false
                      }
                    />
                  );
                })
              ) : (
                <div className="loading" />
              )}
            </Row>
          </Colxx>
        </Row>

        {loading && <SurveyApplicationMenu />}
        <AddNewSurveyModal
          toggleModal={this.toggleModal}
          modalOpen={modalOpen}
          teachers = {this.state.teachers}
          managers ={this.state.managers}
        />
      </Fragment>
    );
  }
}
const mapStateToProps = ({ surveyListApp }) => {
  return {
    surveyListApp
  };
};
export default injectIntl(
  connect(
    mapStateToProps,
    {
      getSurveyList,
      getSurveyListWithOrder,
      getSurveyListSearch,
      selectedSurveyItemsChange
    }
  )(SurveyApp)
);
