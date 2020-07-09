import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import ListPageHeading from '../../../components/pages/list-header';
import { connect } from 'react-redux';
import {addMetaFields, editMetaFields, getMetaFields, getMetaFieldsPerPage } from "../../../redux/meta-fields/actions";
import { getSubCategoryCategoryArray } from '../../../redux/category/actions';
import MetaFieldsDataList from "./meta-fields/meta-fields-list";
import MetaFieldsAddModal from "./meta-fields/meta-field-add-model";
import MetaFieldsEditModal from "./meta-fields/meta-field-edit-model";

function collect(props) {
  return { data: props.data };
}

class MetaFields extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');
    this.state = {
      displayMode: 'list',
      selectedPageSize: 10,
      orderOptions: [
        { column: 'name', label: 'Name' },
        { column: 'type', label: 'Type' },
      ],
      pageSizes: [10, 20, 30, 50, 100],

      selectedOrderOption: { column: 'title', label: 'Product Name' },
      addModal: false,
      editModal: false,
      selectedMetaField: null,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: '',
      selectedItems: [],
      lastChecked: null,
      subCategoryModal: false,
      metafields: [],
    };
  }

  componentDidMount() {
    this.dataListRender();
    this.mouseTrap.bind(['ctrl+a', 'command+a'], () => this.handleChangeSelectAll(false));
    this.mouseTrap.bind(['ctrl+d', 'command+d'], () => {
      this.setState({
        selectedItems: [],
      });
      return false;
    });
  }

  componentWillUnmount() {
    this.mouseTrap.unbind('ctrl+a');
    this.mouseTrap.unbind('command+a');
    this.mouseTrap.unbind('ctrl+d');
    this.mouseTrap.unbind('command+d');
  }

  componentDidUpdate(prevProps) {
    if(this.props.metaFieldsPerPageList.length > 0 && prevProps.metaFieldsPerPageList !== this.props.metaFieldsPerPageList) {
      let idArray = []; let mfArray = [];
      this.props.metaFieldsPerPageList.map(mf => {
        idArray.push(mf.subCategoryId);
        mfArray.push(mf);
        return null;
      });
      this.props.loadSubCategoryCategoryArray(idArray);
      this.setState({metafields: mfArray});
    }
    if(this.props.metaFieldsList.length > 0 && prevProps.metaFieldsList !== this.props.metaFieldsList) {
      this.setState({totalItemCount: this.props.metaFieldsList.length})
    }
  }

  toggleModal = (modal) => {
    this.setState({
      [modal]: !this.state[modal],
    });
  };

  changeOrderBy = (column) => {
    const {metafields} = this.state;
    if(column === "name") {
      metafields.sort(function(a, b){
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
    }else if(column === "type") {
      metafields.sort(function(a, b){
        var x = a.type.toLowerCase();
        var y = b.type.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
    }

    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find((x) => x.column === column),
        metafields: metafields,
      }
    );
  };
  changePageSize = (size) => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1,
      },
      () => this.dataListRender(),
    );
  };
  changeDisplayMode = (mode) => {
    this.setState({
      displayMode: mode,
    });
    return false;
  };
  onChangePage = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => this.dataListRender(),
    );
  };

  onSearchKey = (e) => {
    if (e.key === 'Enter') {
      let searchKey = e.target.value.toLowerCase();
      let metafieldArray = this.props.metaFieldsPerPageList.filter((x) => x.name.toLowerCase().includes(searchKey.toLowerCase()));
      this.setState(
        {
          search: searchKey,
          metafields: metafieldArray,
          selectedOrderOption: { column: 'title', label: 'Product Name' },
        }
      );
    }
  };

  onCheckItem = (event, id) => {
    if (event.target.tagName === 'A' || (event.target.parentElement && event.target.parentElement.tagName === 'A')) {
      return true;
    }
    if (this.state.lastChecked === null) {
      this.setState({
        lastChecked: id,
      });
    }

    let selectedItems = this.state.selectedItems;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter((x) => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems,
    });

    if (event.shiftKey) {
      var items = this.state.metafields;
      var start = this.getIndex(id, items, 'id');
      var end = this.getIndex(this.state.lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map((item) => {
          return item.id;
        }),
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.setState({
        selectedItems,
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

  handleChangeSelectAll = (isToggle) => {
    if (this.state.selectedItems.length >= this.props.metaFieldsPerPageList.length) {
      if (isToggle) {
        this.setState({
          selectedItems: [],
        });
      }
    } else {
      this.setState({
        selectedItems: this.props.metaFieldsPerPageList.map((x) => x.id),
      });
    }
    document.activeElement.blur();
    return false;
  };

  dataListRender = async () => {
    const { categoryCount } = this.props;
    const fetchCount = categoryCount === 0;
    this.props.getMetaFields({}, fetchCount);
    const { selectedPageSize, currentPage } = this.state;
    this.props.getMetaFieldsPerPage(selectedPageSize, (currentPage - 1) * selectedPageSize)
  };

  handleOnEdit = (mf) => {
    this.setState({ selectedMetaField: mf }, () => {
      this.toggleModal('editModal');
    });
  };

  onPageNext = () => {
    const {currentPage, selectedPageSize, totalItemCount} = this.state;
    if(currentPage * selectedPageSize < totalItemCount) {
      this.setState({
        currentPage: currentPage + 1,
        search: '',
        selectedOrderOption: { column: 'title', label: 'Product Name' },
      });
      this.props.getMetaFieldsPerPage(selectedPageSize, currentPage * selectedPageSize)
    }
  }

  onPagePrev = () => {
    const {currentPage, selectedPageSize} = this.state;
    if(currentPage > 1) {
      this.setState({
        currentPage: currentPage - 1,
        search: '',
        selectedOrderOption: { column: 'title', label: 'Product Name' },
      });
      this.props.getMetaFieldsPerPage(selectedPageSize, (currentPage - 2) * selectedPageSize)
    }
  }
  
  render() {
    const {
      currentPage,
      displayMode,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      selectedItems,
      orderOptions,
      pageSizes,
      editModal,
      addModal,
      categories,
      metafields,
    } = this.state;

    const { subCategoryDataArray } = this.props;

    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize + 1;
    const endIndex = currentPage * selectedPageSize;

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" className="mb-4">
            {this.props.isLoading ? (
              <div className="loading" />
            ) : (
              <Fragment>
                <div className="disable-text-selection">
                  <ListPageHeading
                    heading="menu.meta-field"
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
                    itemsLength={metafields ? metafields.length : 0}
                    onSearchKey={this.onSearchKey}
                    orderOptions={orderOptions}
                    pageSizes={pageSizes}
                    toggleModal={() => this.toggleModal('addModal')}
                  />
                  <MetaFieldsAddModal
                    modalOpen={addModal}
                    toggleModal={() => this.toggleModal('addModal')}
                    categories={categories}
                    handleSubmit={(e) => {
                      this.props.addMetaField(e);
                      this.toggleModal('addModal');
                      this.dataListRender();
                    }}
                  />
                  {this.state.selectedMetaField && (
                    <MetaFieldsEditModal
                      modalOpen={editModal}
                      toggleModal={() => this.toggleModal('editModal')}
                      categories={categories}
                      selectedMetaField={this.state.selectedMetaField}
                      handleSubmit={(e) => {
                        this.props.editCategory(this.state.selectedMetaField.id, e);
                        this.toggleModal('editModal');
                        this.dataListRender();
                      }}
                    />
                  )}
                  <Row>
                    {metafields.map((mf) => {
                      var catData = null;
                      for (let categoryData of subCategoryDataArray) {
                        if(categoryData.subCategory) {
                          if(mf.subCategoryId === categoryData.subCategory.id) {
                            catData = categoryData;
                            break;
                          }
                        }else{
                          if(mf.subCategoryId === categoryData.category.id) {
                            catData = categoryData;
                            break;
                          }
                        }
                      }
                      return (
                        <MetaFieldsDataList
                          key={mf.id}
                          product={mf}
                          categoryData={catData}
                          isSelect={this.state.selectedItems.includes(mf.id)}
                          onCheckItem={(e)=>this.onCheckItem(e, mf.id)}
                          collect={collect}
                          onClick={() => {}}
                          onEdit={() => this.handleOnEdit(mf)}
                        />
                      );
                    })}
                  </Row>
                  <Row style={{ justifyContent: 'center' }}>
                    <div>
                      <span className="text-default text-medium" style={{marginRight: "20px"}} onClick={this.onPagePrev}>Prev</span>
                      <span className="text-default text-medium">{`${currentPage}`}</span>
                      <span className="text-default text-medium" style={{marginLeft: "20px"}} onClick={this.onPageNext}>Next</span>
                    </div>
                  </Row>
                </div>
              </Fragment>
            )}
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

export default connect(
  ({ metaFields, category }) => ({
    metaFieldCount: metaFields.count,
    metaFieldsList: metaFields.list,
    metaFieldsPerPageList: metaFields.perpagelist,
    error: metaFields.error,
    addError: metaFields.addError,
    isLoading: metaFields.loading,
    subCategoryDataArray: category.subCategoryDataArray,
  }),
  {
    getMetaFields: getMetaFields,
    addMetaField: addMetaFields,
    editCategory: editMetaFields,
    loadSubCategoryCategoryArray: getSubCategoryCategoryArray,
    getMetaFieldsPerPage: getMetaFieldsPerPage,
  },
)(MetaFields);
