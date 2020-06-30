import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import axios from "axios";

import DataListView from "../../../containers/pages/DataListView";
import Pagination from "../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import ListPageHeading from "../../../containers/pages/ListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
import AddNewTeacherModal from "../../../containers/pages/AddNewTeacher";
import UpdateTeacherModal from "../../../containers/pages/ModifierTeacher";

import Switch from "rc-switch";


function collect(props) {
  return { data: props.data };
}
const apiUrl = "/teachers";
var teacherM;
class Teachers extends Component {

  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');
    this.state = {
      displayMode: "thumblist",
      teachers:[],
      selectedPageSize: 8,
      orderOptions: [
        { column: "name", label: "Name" },
        { column: "mail", label: "Mail" },
        { column: "specialities", label: "Specialities" }
      ],
      pageSizes: [8, 12, 24],

      categories: [
        { label: "IT", value: "IT", key: 0 },
        { label: "Telecommunications", value: "Telecommunications", key: 1 },
        { label: "Electromechanical", value: "Electromechanical", key: 2 }
      ],

      selectedOrderOption: { column: "name", label: "Name" },
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
      OpT:"teacher.add-new-title",

      managers : [],
      displayManagers : true
    };
  }

  componentDidMount() {
    /*fetch('/teachers').then(res=>res.json()).then(teachers=>this.setState({teachers}));
    console.log(this.state.teachers);*/
    this.dataListRender();
    console.log(this.state.teachers)
    this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });

    let managersV2 = []
    axios.get('/managers/listmanagers')
    .then((res)=>{
      res.data.forEach(element => {
        let item ={
          id : element._id,
          title : element.firstname+" "+element.lastname,
          img : element.imageUrl,
          statusColor : "",
          status : element.role
        }
        managersV2.push(item)
      });
      this.setState({
        managers : managersV2
      })
    })
    .catch((err) => console.log("err at /managers/listmanagers : "+err))
  }

  componentWillUnmount() {
    this.mouseTrap.unbind("ctrl+a");
    this.mouseTrap.unbind("command+a");
    this.mouseTrap.unbind("ctrl+d");
    this.mouseTrap.unbind("command+d");
  }
  toggleModalUpdate = (x) => {

    this.setState({
      modalOpenUpdate: !this.state.modalOpenUpdate,

    });
    if(this.state.modalOpenUpdate){
      this.setState({
        modteacher:{},
        opT:"teacher.add-new-title"
      });
    }
    this.modif(x)
    this.dataListRender()
  };

  toggleModal = () => {

    this.setState({
      modalOpen: !this.state.modalOpen,

    });

    this.dataListRender()
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
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
  changeDisplayMode = mode => {
    this.setState({
      displayMode: mode
    });
    return false;
  };
  onChangePage = page => {
    this.setState(
      {
        currentPage: page
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

  onCheckItem = (event, id) => {
    if (
      event.target.tagName === "A" ||
      (event.target.parentElement && event.target.parentElement.tagName === "A")
    ) {

      return true;
    }
    if (this.state.lastChecked === null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = this.state.selectedItems;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems
    });

    if (event.shiftKey) {
      var items = this.state.teachers;
      var start = this.getIndex(id, items, "_id");
      var end = this.getIndex(this.state.lastChecked, items, "_id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item._id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.setState({
        selectedItems
      });
    }
    document.activeElement.blur();
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  handleChangeSelectAll = isToggle => {
    if (this.state.selectedItems.length >= this.state.items.length) {
      if (isToggle) {
        this.setState({
          selectedItems: []
        });
      }
    } else {
      this.setState({
        selectedItems: this.state.teachers.map(x => x._id)
      });
    }
    document.activeElement.blur();
    return false;
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
        `${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${
          selectedOrderOption.column
        }&search=${search}`
      )
      .then(res => {
        return res.data;
      })
      .then(data => {
        this.setState({
          totalPage: data.totalPage,
          teachers:data.data,
          items: data.data,
          selectedItems: [],
          totalItemCount: data.totalItem,
          isLoading: true
        });
      });
  }
   deleteteacher(x) {
    axios.delete('/teachers/deleteteacher/' + x)
        .then((res) => {
          console.log(x)
          console.log('teacher successfully deleted!')
        }).catch((error) => {
      console.log(x)
      console.log(error)
    })
  }


  onContextMenuClick = (e, data, target) => {


    console.log(this.state.modteacher);
    console.log(
      "onContextMenuClick - selected items",
      this.state.selectedItems
    );
    console.log("onContextMenuClick - action : ", data.action);
    if(data.action ==="delete"){
      this.state.selectedItems.map(x=>{this.deleteteacher(x)})
    }
    if(data.action ==="copy"){
        let x =this.state.teachers.find(t=>t._id===this.state.selectedItems[0]);
        console.log(this.state.teachers.values()+
            "onContextMenuClick 2 - selected items",
            this.state.selectedItems
        );
        console.log("Je suis X :"+data)
       /* this.setState({
            modteacher:x,
            opT:"teacher.modif-title"
        })*/
      this.toggleModalUpdate(x)
    }
    //for the delete refresh
    this.dataListRender()
  };


  onContextMenu = (e, data) => {

    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId]
      });
    }
//non render
    return true;
  };
    modif(x){
        this.setState({
            modteacher:x,
            opT:"teacher.modif-title"
        });
        return this.state.modteacher
    }
  render() {
    const {
      currentPage,
      items,
      displayMode,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      selectedItems,
      orderOptions,
      pageSizes,
      modalOpen,
      modalOpenUpdate,
      categories
    } = this.state;
    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;

    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (

      <Fragment>

        <div className="disable-text-selection">

          <ListPageHeading
            heading="menu.teachers"
            displayMode={displayMode}
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

            <center>
              <div style={{ marginBottom: "50px" }} >

                {this.state.displayManagers ? (<>Display List of Managers</>) : (<>Display List of Teachers</>)}
                <Switch
                  className="custom-switch custom-switch-primary"
                  checked={this.state.displayManagers}
                  onChange={displayManagers => {
                    this.setState({ displayManagers: !this.state.displayManagers });
                  }}
                />
              </div>
            </center>

          <UpdateTeacherModal
            modalOpen={modalOpenUpdate}
            toggleModal={this.toggleModalUpdate}
            categories={categories}
            modif={this.state.modteacher}
            op={this.state.opT}
            onModif={this.modif}

          />
          <AddNewTeacherModal
              modalOpen={modalOpen}
              toggleModal={this.toggleModal}
              categories={categories}
          />

          {this.state.displayManagers ? (
            

          <Row>
            {this.state.managers.map(teacher => {
            
                return (
                  
                  <DataListView
                    key={teacher._id}
                    product={teacher}
                    isSelect={this.state.selectedItems.includes(teacher._id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                  />
                );
              
            })}{" "}
            <Pagination
              currentPage={this.state.currentPage}
              totalPage={this.state.totalPage}
              onChangePage={i => this.onChangePage(i)}
            />
            <ContextMenuContainer
              onContextMenuClick={this.onContextMenuClick}
              onContextMenu={this.onContextMenu}
            />
          </Row>
          ):(
          



          <Row>
            {this.state.teachers.map(teacher => {
              if (this.state.displayMode === "imagelist") {
                return (
                  <ImageListView
                    key={teacher._id}
                    product={teacher}
                    isSelect={this.state.selectedItems.includes(teacher._id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                );
              } else if (this.state.displayMode === "thumblist") {
                return (
                  <ThumbListView
                    key={teacher._id}
                    product={teacher} 
                    isSelect={this.state.selectedItems.includes(teacher._id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                    toggleModal={this.toggleModal}
                  />
                );
              } else {
                return (
                  <DataListView
                    key={teacher._id}
                    product={teacher}
                    isSelect={this.state.selectedItems.includes(teacher._id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                  />
                );
              }
            })}{" "}
            <Pagination
              currentPage={this.state.currentPage}
              totalPage={this.state.totalPage}
              onChangePage={i => this.onChangePage(i)}
            />
            <ContextMenuContainer
              onContextMenuClick={this.onContextMenuClick}
              onContextMenu={this.onContextMenu}
            />
          </Row>

      )}
        </div>
      </Fragment>
    );
  }
}
export default Teachers;
/*
* <i
                className=
                     "simple-icon-check heading-icon"

            />*/
