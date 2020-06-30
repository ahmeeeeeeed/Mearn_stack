import React, { Component, Fragment } from "react";
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
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";

import {
  getTodoList,
  getTodoListWithOrder,
  getTodoListSearch,
  selectedTodoItemsChange
} from "../../../redux/actions";
import TodoListItem from "../../../components/applications/TodoListItem";
import AddNewTodoModal from "../../../containers/applications/AddNewTodoModal";
import TrainingApplicationMenu from "../../../containers/applications/TrainingApplicationMenu";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddNewTrainingModal from "../../../containers/applications/AddNewTrainingModal";
import UpdateTrainingModal from "../../../containers/applications/ModifierTrainingModal";
import axios from "axios";
import UpdateTeacherModal from "../../../containers/pages/ModifierTeacher";
const localizer = BigCalendar.momentLocalizer(moment)
const apiUrl="/training";
class TrainingCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      modalOpenUpdate: false,
      lastChecked: null,
      events:[],
      eventmod:{},
      displayOptionsIsOpen: false,
      categories: [
        { label: "IT", value: "IT", key: 0 },
        { label: "Telecommunications", value: "Telecommunications", key: 1 },
        { label: "Electromechanical", value: "Electromechanical", key: 2 }
      ]
    };
  }
  mapToRBCFormat = e => Object.assign({}, e, {
    title : e.title,
    start: new Date(e.start),
    end: new Date(e.end)
  });
  componentDidMount() {
    this.dataListRender();
    this.props.getTodoList();

  }

  toggleDisplayOptions = () => {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  };
  toggleModalUpdate = () => {
    this.setState({
      modalOpenUpdate: !this.state.modalOpenUpdate
    });
    if(this.state.modalOpenUpdate){
      this.setState({
        eventmod:{}
        //opT:"teacher.add-new-title"
      });
    }
    this.dataListRender();
  };
  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });

    this.dataListRender();
  };

  toggleSplit = () => {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  };

  changeOrderBy = column => {
    this.props.getTodoListWithOrder(column);
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.props.getTodoListSearch(e.target.value);
    }
  };

  handleCheckChange = (event, id) => {
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = Object.assign([], this.props.todoApp.selectedItems);
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.props.selectedTodoItemsChange(selectedItems);

    if (event.shiftKey) {
      var items = this.props.todoApp.todoItems;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
          ...items.map(item => {
            return item.id;
          })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.props.selectedTodoItemsChange(selectedItems);
    }
    return;
  };

  handleChangeSelectAll = () => {
    if (this.props.todoApp.loading) {
      if (
          this.props.todoApp.selectedItems.length >=
          this.props.todoApp.todoItems.length
      ) {
        this.props.selectedTodoItemsChange([]);
      } else {
        this.props.selectedTodoItemsChange(
            this.props.todoApp.todoItems.map(x => x.id)
        );
      }
    }
  };
  dataListRender() {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;
    axios
        .get(
            `${apiUrl}`
        )
        .then(res => {
          return res.data;
        })
        .then(data => {
          this.setState({
            totalPage: data.totalPage,
            events:data.data,
            items: data.data,
            selectedItems: [],
            totalItemCount: data.totalItem,
            isLoading: true
          });
        });
  }
  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }

f(){

    this.toggleModalUpdate();
}
  eventStyleGetter(event, start, end, isSelected) {
    //console.log(event);
    var backgroundColor = '#'+event.hexColor;
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      opacity: 0.9,
      color: 'black',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };
  render() {
    const {
      todoItems,
      searchKeyword,
      loading,
      orderColumn,
      orderColumns,
      selectedItems
    } = this.props.todoApp;

    const { messages } = this.props.intl;

    const { modalOpen,modalOpenUpdate,events,categories } = this.state;


    return (
        <Fragment>
          <Row className="app-row survey-app">
            <Colxx xxs="12">
              <div className="mb-2">
                <h1>
                  <IntlMessages id="menu.trianing-calendar" />
                </h1>
                {loading && (
                    <div className="float-sm-right">
                      <Button
                          color="primary"
                          size="lg"
                          className="top-right-button"
                          onClick={this.toggleModal}
                      >
                        <IntlMessages id="todo.add-new" />
                      </Button>{" "}
                      <ButtonDropdown
                          isOpen={this.state.dropdownSplitOpen}
                          toggle={this.toggleSplit}
                      >
                        <div className="btn btn-primary pl-4 pr-0 check-button check-all">
                          <CustomInput
                              className="custom-checkbox mb-0 d-inline-block"
                              type="checkbox"
                              id="checkAll"
                              checked={
                                selectedItems.length >= todoItems.length
                              }
                              onClick={() => this.handleChangeSelectAll()}
                              onChange={() => this.handleChangeSelectAll()}
                              label={
                                <span
                                    className={`custom-control-label ${
                                        selectedItems.length > 0 &&
                                        selectedItems.length < todoItems.length
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
                          <DropdownItem>
                            <IntlMessages id="todo.action" />
                          </DropdownItem>
                          <DropdownItem>
                            <IntlMessages id="todo.another-action" />
                          </DropdownItem>
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
                  <IntlMessages id="todo.display-options" />{" "}
                  <i className="simple-icon-arrow-down align-middle" />
                </Button>
                <Collapse
                    className="d-md-block"
                    isOpen={this.state.displayOptionsIsOpen}
                >
                  <div className="d-block mb-2 d-md-inline-block">
                    <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                      <DropdownToggle caret color="outline-dark" size="xs">
                        <IntlMessages id="todo.orderby" />
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



              <div>
                <BigCalendar

                    selectable
                    events={events.map(this.mapToRBCFormat)}
                    defaultView='week'
                    defaultDate={new Date()}
                    onSelectEvent={event => {
                      this.f();
                      alert(event._id);
                      this.setState({
                        eventmod: event
                      })

                    }}
                    onSelectSlot={(slotInfo) =>{this.f()}}
                    eventPropGetter={(this.eventStyleGetter)}
                    eventmodi={this.state.eventmod}


                />
              </div>
            </Colxx>
          </Row>
          {loading && <TrainingApplicationMenu />}

          <AddNewTrainingModal
              toggleModal={this.toggleModal}
              modalOpen={modalOpen}
              categories={categories}/>
          <UpdateTrainingModal
              toggleModal={this.toggleModalUpdate}
              modalOpen={modalOpenUpdate}
              eventmod={this.state.eventmod}
              categories={categories}
          />
        </Fragment>
    );
  }
}
const mapStateToProps = ({ todoApp }) => {
  return {
    todoApp
  };
};
export default injectIntl(
    connect(
        mapStateToProps,
        {
          getTodoList,
          getTodoListWithOrder,
          getTodoListSearch,
          selectedTodoItemsChange
        }
    )(TrainingCalendar)
);
