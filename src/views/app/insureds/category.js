import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import ListPageHeading from '../../../components/pages/list-header';
import { connect } from 'react-redux';
import { getCategory, getCategoryCount, addCategory, editCategory, getCategorySubCategory, getCategoryPerPage } from '../../../redux/category/actions';
import CategoryDataList from "./category/category-data-list";
import AddCategoryModal from "./category/category-add-model";
import EditCategoryModal from "./category/category-edit-model";
import SubCategoryViewer from "./category/sub-category-viewer";

function collect(props) {
  return { data: props.data };
}

class Category extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');

    this.state = {
      displayMode: 'list',
      selectedPageSize: 10,
      orderOptions: [
        { column: 'name', label: 'Name' },
      ],
      pageSizes: [10, 20, 30, 50, 100],

      selectedOrderOption: { column: 'title', label: 'Product Name' },
      dropdownSplitOpen: false,
      addModal: false,
      editModal: false,
      caseModal: false,
      selectedCategory: null,
      cases: [],
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: '',
      selectedItems: [],
      lastChecked: null,
      isLoading: false,
      subCategoryModal: false,
      categories: [],
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
    if(this.props.categoryPerPageList.length > 0 && prevProps.categoryPerPageList !== this.props.categoryPerPageList) {
      let categoryArray = [];
      this.props.categoryPerPageList.map((ct) => {
        categoryArray.push(ct);
        return null;
      });
      this.setState({categories: categoryArray});
    }
    if(this.props.categoryList.length > 0 && prevProps.categoryList !== this.props.categoryList) {
      this.setState({totalItemCount: this.props.categoryList.length})
    }
  }


  toggleModal = (modal) => {
    this.setState({
      [modal]: !this.state[modal],
    });
  };

  changeOrderBy = (column) => {
    const {categories} = this.state;
    if(column === "name") {
      categories.sort(function(a, b){
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
    }

    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find((x) => x.column === column),
        categories: categories,
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
      let categoryArray = this.props.categoryPerPageList.filter((x) => x.name.toLowerCase().includes(searchKey.toLowerCase()));

      this.setState(
        {
          search: e.target.value.toLowerCase(),
          categories: categoryArray,
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
      var items = this.state.categories;
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
    if (this.state.selectedItems.length >= this.props.categoryPerPageList.length) {
      if (isToggle) {
        this.setState({
          selectedItems: [],
        });
      }
    } else {
      this.setState({
        selectedItems: this.props.categoryPerPageList.map((x) => x.id),
      });
    }
    document.activeElement.blur();
    return false;
  };

  dataListRender = async () => {
    const { categoryCount } = this.props;
    const fetchCount = categoryCount === 0;

    this.props.getCategory({}, fetchCount);
    const { selectedPageSize, currentPage } = this.state;
    this.props.getCategoryPerPage(selectedPageSize, (currentPage - 1) * selectedPageSize)

  };

  onContextMenuClick = (e, data, target) => {
    console.log('onContextMenuClick - selected items', this.state.selectedItems);
    console.log('onContextMenuClick - action : ', data.action);
  };

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId],
      });
    }

    return true;
  };

  handleOnClick = (category) => {
    this.props.loadSubCategory(category.id);
    this.setState({ selectedCategory: category }, () => {
      this.toggleModal('subCategoryModal');
    });
  };

  handleOnEdit = (category) => {
    this.setState({ selectedCategory: category }, () => {
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
      this.props.getCategoryPerPage(selectedPageSize, currentPage * selectedPageSize)
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
      this.props.getCategoryPerPage(selectedPageSize, (currentPage - 2) * selectedPageSize)
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
    } = this.state;

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
                    heading="menu.category"
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
                    itemsLength={categories ? categories.length : 0}
                    onSearchKey={this.onSearchKey}
                    orderOptions={orderOptions}
                    pageSizes={pageSizes}
                    toggleModal={() => this.toggleModal('addModal')}
                  />
                  <AddCategoryModal
                    modalOpen={addModal}
                    toggleModal={() => this.toggleModal('addModal')}
                    categories={categories}
                    handleSubmit={(e) => {
                      this.props.addCategory(e);
                      this.toggleModal('addModal');
                      this.dataListRender();
                    }}
                  />
                  {this.state.selectedCategory && (
                    <EditCategoryModal
                      modalOpen={editModal}
                      toggleModal={() => this.toggleModal('editModal')}
                      categories={categories}
                      selectedCategory={this.state.selectedCategory}
                      handleSubmit={(e) => {
                        this.props.editCategory(this.state.selectedCategory.id, e);
                        this.toggleModal('editModal');
                        this.dataListRender();
                      }}
                    />
                  )}
                  {this.state.selectedCategory && (
                    <SubCategoryViewer
                      modalOpen={this.state.subCategoryModal}
                      category={this.state.selectedCategory}
                      subCategory={this.props.subCategories}
                      subCategoryLoading={this.props.subCategoryLoading}
                      subError={this.props.subCategoryError}
                      toggleModal={() => this.toggleModal('subCategoryModal')}
                    />
                  )}
                  <Row>
                    {categories.map((category) => {
                      return (
                        <CategoryDataList
                          key={category.id}
                          product={category}
                          isSelect={this.state.selectedItems.includes(category.id)}
                          onCheckItem={(e)=>this.onCheckItem(e, category.id)}
                          collect={collect}
                          onClick={() => this.handleOnClick(category)}
                          onEdit={() => this.handleOnEdit(category)}
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
  ({ category }) => ({
    categoryCount: category.categoryCount,
    categoryList: category.categoryList,
    categoryPerPageList: category.perpagelist,
    error: category.error,
    isLoading: category.loading,
    subCategories: category.subCategories,
    subCategoryLoading: category.subCategoriesLoading,
    subCategoryError: category.subCategoriesError,
  }),
  {
    getCategory: getCategory,
    addCategory: addCategory,
    editCategory: editCategory,
    getCategoryCount: getCategoryCount,
    loadSubCategory: getCategorySubCategory,
    getCategoryPerPage: getCategoryPerPage,
  },
)(Category);
