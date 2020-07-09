import React, {Component, Fragment} from "react";
import {Row} from "reactstrap";

import {servicePath} from "../../../../constants/defaultValues";

import DataListView from "../../../../containers/pages/DataListView";
import Pagination from "../../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../../containers/pages/ContextMenuContainer";
import ListPageHeading from "../../../../containers/pages/ListPageHeading";
import AddNewModal from "../../../../containers/pages/AddNewModal";

import {API} from '../../../../util/api';
import CaseModal from "../../../../containers/pages/CaseModal";

function collect(props) {
  return {data: props.data};
}

const apiUrl = servicePath + "/cakes/paging";

class DataListPages extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require("mousetrap");

    this.state = {
      displayMode: "list",

      selectedPageSize: 10,
      orderOptions: [
        {column: "title", label: "Product Name"},
        {column: "category", label: "Category"},
        {column: "status", label: "Status"}
      ],
      pageSizes: [10, 20, 30, 50, 100],

      categories: [
        {label: "Cakes", value: "Cakes", key: 0},
        {label: "Cupcakes", value: "Cupcakes", key: 1},
        {label: "Desserts", value: "Desserts", key: 2}
      ],

      selectedOrderOption: {column: "title", label: "Product Name"},
      dropdownSplitOpen: false,
      modalOpen: false,
      editModal: false,
      caseModal: false,
      editingPerson: null,
      cases: [],
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

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  toggleEditModal = () => {
    this.setState({
      editModal: !this.state.editModal,
      editingPerson: this.state.editModal ? null : this.state.editingPerson,
    })
  };

  toggleCaseModal = async () => {
    if(!this.state.caseModal) {
      const [err, data] = await API.get('People/' + this.state.editingPerson.id + '/case');
      this.setState({cases: data});
    }
    this.setState({
      caseModal: !this.state.caseModal,
      editingPerson: this.state.caseModal ? null : this.state.editingPerson,
    })
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
      var items = this.state.items;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
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
        selectedItems: this.state.items.map(x => x.id)
      });
    }
    document.activeElement.blur();
    return false;
  };

  dataListRender = async () => {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;
    const [err, data] = await API.get('People');
    this.setState({
      totalPage: 1,
      items: data,
      selectedItems: [],
      totalItemCount: data.length,
      isLoading: true
    });
  };

  onContextMenuClick = (e, data, target) => {
    console.log(
      "onContextMenuClick - selected items",
      this.state.selectedItems
    );
    console.log("onContextMenuClick - action : ", data.action);
  };

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId]
      });
    }

    return true;
  };

  handleSubmit = (newPerson) => {
    this.setState({
      totalPage: 1,
      items: [...this.state.items, newPerson],
      selectedItems: [],
      totalItemCount: this.state.items.length + 1,
      isLoading: true
    });
    this.toggleModal();
  };

  handleOnClick = (event, product) => {
    this.setState({editingPerson: product}, () => {
      this.toggleCaseModal();
    });
  };

  handleOnEdit = () => {
    this.dataListRender();
    this.toggleEditModal();
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
      modalOpen,
      categories
    } = this.state;
    const {match} = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;

    return !this.state.isLoading ? (
      <div className="loading"/>
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <ListPageHeading
            heading="menu.data-list"
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
          <AddNewModal
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            categories={categories}
            handleSubmit={this.handleSubmit}
          />
          {/*{this.state.editingPerson && <EditModal*/}
          {/*  modalOpen={this.state.editModal}*/}
          {/*  initObject={this.state.editingPerson}*/}
          {/*  toggleModal={this.toggleEditModal}*/}
          {/*  handleSubmit={this.handleOnEdit}*/}
          {/*/>}*/}
          {this.state.editingPerson && <CaseModal
            modalOpen={this.state.caseModal}
            initObject={{person: this.state.editingPerson, cases: this.state.cases}}
            toggleModal={this.toggleCaseModal}
          />}
          <Row>
            {this.state.items.map(product => {
              return (
                <DataListView
                  key={product.id}
                  product={product}
                  isChecked={this.state.selectedItems.includes(product.id)}
                  onCheckItem={this.onCheckItem}
                  collect={collect}
                  onClick={this.handleOnClick}
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

export default DataListPages;
