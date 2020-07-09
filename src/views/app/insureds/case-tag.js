import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import ListPageHeading from '../../../components/pages/list-header';
import { connect } from 'react-redux';
import { getCaseTag, getCaseTagCount, addCaseTag, editCaseTag, getCaseTagPerPage } from '../../../redux/case-tag/actions';
import CaseTagList from "./case-tag/case-tag-list";
import AddCaseTagModal from "./case-tag/case-tag-add-model";
import EditCaseTagModal from "./case-tag/case-tag-edit-model";

function collect(props) {
  return { data: props.data };
}

class CaseTag extends Component {
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
      selectedCaseTag: null,
      cases: [],
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: '',
      selectedItems: [],
      lastChecked: null,
      isLoading: false,
      caseTags: [],
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
    if(this.props.caseTagPerPageList.length > 0 && prevProps.caseTagPerPageList !== this.props.caseTagPerPageList) {
      let caseTagArray = [];
      this.props.caseTagPerPageList.map((ct) => {
        caseTagArray.push(ct);
        return null;
      });
      this.setState({caseTags: caseTagArray});
    }
    if(this.props.caseTagList.length > 0 && prevProps.caseTagList !== this.props.caseTagList) {
      this.setState({totalItemCount: this.props.caseTagList.length})
    }
  }


  toggleModal = (modal) => {
    this.setState({
      [modal]: !this.state[modal],
    });
  };

  changeOrderBy = (column) => {
    const {caseTags} = this.state;
    if(column === "name") {
      caseTags.sort(function(a, b){
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
        caseTags: caseTags,
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
      let caseTagArray = this.props.caseTagPerPageList.filter((x) => x.name.toLowerCase().includes(searchKey.toLowerCase()));

      this.setState(
        {
          search: e.target.value.toLowerCase(),
          caseTags: caseTagArray,
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
      var items = this.state.caseTags;
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
    if (this.state.selectedItems.length >= this.props.caseTagPerPageList.length) {
      if (isToggle) {
        this.setState({
          selectedItems: [],
        });
      }
    } else {
      this.setState({
        selectedItems: this.props.caseTagPerPageList.map((x) => x.id),
      });
    }
    document.activeElement.blur();
    return false;
  };

  dataListRender = async () => {
    const { caseTagCount } = this.props;
    const fetchCount = caseTagCount === 0;

    this.props.getCaseTag({}, fetchCount);
    const { selectedPageSize, currentPage } = this.state;
    this.props.getCaseTagPerPage(selectedPageSize, (currentPage - 1) * selectedPageSize)

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
    
  };

  handleOnEdit = (caseTag) => {
    this.setState({ selectedCaseTag: caseTag }, () => {
      this.toggleModal('editModal');
      // console.log(this.state.selectedCaseTag);
    });
  };

  handleOnDelete = (caseTag) => {
  };

  onPageNext = () => {
    const {currentPage, selectedPageSize, totalItemCount} = this.state;
    if(currentPage * selectedPageSize < totalItemCount) {
      this.setState({
        currentPage: currentPage + 1,
        search: '',
        selectedOrderOption: { column: 'title', label: 'Product Name' },
      });
      this.props.getCaseTagPerPage(selectedPageSize, currentPage * selectedPageSize)
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
      this.props.getCaseTagPerPage(selectedPageSize, (currentPage - 2) * selectedPageSize)
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
      caseTags,
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
                    heading="menu.case-tag"
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
                    itemsLength={caseTags ? caseTags.length : 0}
                    onSearchKey={this.onSearchKey}
                    orderOptions={orderOptions}
                    pageSizes={pageSizes}
                    toggleModal={() => this.toggleModal('addModal')}
                  />
                  <AddCaseTagModal
                    modalOpen={addModal}
                    toggleModal={() => this.toggleModal('addModal')}
                    caseTags={caseTags}
                    handleSubmit={(e) => {
                      this.props.addCaseTag(e);
                      this.toggleModal('addModal');
                      this.dataListRender();
                    }}
                  />
                  {this.state.selectedCaseTag && (
                    <EditCaseTagModal
                      modalOpen={editModal}
                      toggleModal={() => this.toggleModal('editModal')}
                      caseTags={caseTags}
                      selectedCaseTag={this.state.selectedCaseTag}
                      handleSubmit={(e) => {
                        this.props.editCaseTag(this.state.selectedCaseTag.id, e);
                        this.toggleModal('editModal');
                        this.dataListRender();
                      }}
                    />
                  )}
                  <Row>
                    {caseTags.map((caseTag) => {
                      return (
                        <CaseTagList
                          key={caseTag.id}
                          product={caseTag}
                          isSelect={this.state.selectedItems.includes(caseTag.id)}
                          onCheckItem={(e)=>this.onCheckItem(e, caseTag.id)}
                          collect={collect}
                          onClick={() => this.handleOnClick(caseTag)}
                          onEdit={() => this.handleOnEdit(caseTag)}
                          onDelete={() => this.handleOnDelete(caseTag)}
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
  ({ caseTag }) => ({
    caseTagCount: caseTag.caseTagCount,
    caseTagList: caseTag.caseTagList,
    caseTagPerPageList: caseTag.perpagelist,
    error: caseTag.error,
    isLoading: caseTag.loading,
  }),
  {
    getCaseTag: getCaseTag,
    addCaseTag: addCaseTag,
    editCaseTag: editCaseTag,
    getCaseTagCount: getCaseTagCount,
    getCaseTagPerPage: getCaseTagPerPage,
  },
)(CaseTag);
