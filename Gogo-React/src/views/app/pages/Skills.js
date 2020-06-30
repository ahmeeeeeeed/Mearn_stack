import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import axios from "axios";

import { servicePath } from "../../../constants/defaultValues";

import DataListView from "../../../containers/pages/DataListView";
import Pagination from "../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import ListPageHeading from "../../../containers/pages/ListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import UpdateSkillModal from "../../../containers/pages/ModifierSkill";
import AddNewSkillModal from "../../../containers/pages/AddNewSkill";
import ListItemSkills from "../../../components/applications/ListItemSkills";
import ThumbListView from "../../../containers/pages/ThumbListView";
function collect(props) {
  return { data: props.data };
}
const apiUrl = "/skills";

class Skills extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');
    this.state = {
      displayMode: "thumblist",
      skills:[],
      selectedPageSize: 8,
      orderOptions: [
        { column: "title", label: "Skill" },
        { column: "description", label: "Description" },
        { column: "type", label: "Type" }
      ],
      pageSizes: [8, 12, 24],

      categories: [
        { label: "IT", value: "IT", key: 1 },
        { label: "Telecommunications", value: "Telecommunications", key: 2 },
        { label: "Electromechanical", value: "Electromechanical", key: 3 }
      ],

      selectedOrderOption: { column: "title", label: "Skill" },
      dropdownSplitOpen: false,
      modalOpen: false,
      modalOpenUpdate: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: "",
      selectedItems: [],
      lastChecked: null,
      isLoading: false
    };
  }

  componentDidMount() {
    /*fetch('/teachers').then(res=>res.json()).then(teachers=>this.setState({teachers}));
    console.log(this.state.teachers);*/
    this.dataListRender();
    this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
        this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });
  }

  componentWillUnmount() {
    this.mouseTrap.unbind("ctrl+a");
    this.mouseTrap.unbind("command+a");
    this.mouseTrap.unbind("ctrl+d");
    this.mouseTrap.unbind("command+d");
  }
  toggleModalUpdate = (x) => {
    this.setState({
      modalOpenUpdate: !this.state.modalOpenUpdate
    });
    if(this.state.modalOpenUpdate){
      this.setState({
        modskill:{},

      });
    }
    this.modif(x)
    this.dataListRender()
  };
  toggleModal = (x) => {
    this.setState({
      modalOpen: !this.state.modalOpen
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
      var items = this.state.skills;
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
        selectedItems: this.state.skills.map(x => x._id)
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
            skills:data.data,
            items: data.data,
            selectedItems: [],
            totalItemCount: data.totalItem,
            isLoading: true
          });
        });
  }
  deleteskills(x) {
    axios.delete('/skills/deleteskills/' + x)
        .then((res) => {
          console.log(x)
          console.log('teacher successfully deleted!')
        }).catch((error) => {
      console.log(x)
      console.log(error)
    })
  }
  onContextMenuClick = (e, data, target) => {
    console.log(
        "onContextMenuClick - selected items",
        this.state.selectedItems
    );
    console.log("onContextMenuClick - action : ", data.action);
    if(data.action ==="delete"){
      this.state.selectedItems.map(x=>{this.deleteskills(x)})
    }
    if(data.action ==="copy"){
      let x =this.state.skills.find(t=>t._id===this.state.selectedItems[0]);
      console.log(this.state.skills.values()+
          "onContextMenuClick 2 - selected items",
          this.state.selectedItems
      );
      this.toggleModalUpdate(x)
    }
    //for the delete refresh
    this.dataListRender()
  };
  modif(x){
    this.setState({
      modskill:x,
      opT:"teacher.modif-title"
    })
    return this.state.modskill
  }
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
      modalOpenUpdate,
      modalOpen,
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
                heading="menu.skills"
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
            <AddNewSkillModal
                modalOpen={modalOpen}
                toggleModal={this.toggleModal}
                categories={categories}

            />
            <UpdateSkillModal
                modalOpen={modalOpenUpdate}
                toggleModal={this.toggleModalUpdate}
                categories={categories}
                modif={this.state.modskill}
            />
            <Row>
              {this.state.skills.map(skill => {

                  return (
                      <ListItemSkills
                          key={skill._id}
                          product={skill}
                          isSelect={this.state.selectedItems.includes(skill._id)}
                          collect={collect}
                          onCheckItem={this.onCheckItem}

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
          </div>
        </Fragment>
    );
  }
}
export default Skills;
