import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import ListPageHeading from '../../../components/pages/list-header';
import DataListView from './people/people-data-list';
import { connect } from 'react-redux';
import AddNewModal from './people/people-add-model';
import CaseViewer from './people/people-case-viewer';
import { getPeople, getPeopleCount, addPeople, getPeopleCases, editPeople, getPeoplePerPage, getCombinedCases } from '../../../redux/people/actions';
import EditModal from './people/people-edit-model';
import CombinedCaseViewer from './people/people-combined-cases-viewer';

function collect(props) {
  return { data: props.data };
}

class People extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require('mousetrap');

    this.state = {
      displayMode: 'list',
      selectedPageSize: 10,
      orderOptions: [
        { column: 'firstname', label: 'First Name' },
        { column: 'lastname', label: 'Last Name' },
      ],
      pageSizes: [10, 20, 30, 50, 100],

      categories: [
        { label: 'Cakes', value: 'Cakes', key: 0 },
        { label: 'Cupcakes', value: 'Cupcakes', key: 1 },
        { label: 'Desserts', value: 'Desserts', key: 2 },
      ],

      selectedOrderOption: { column: 'title', label: 'Product Name' },
      dropdownSplitOpen: false,
      addModal: false,
      editModal: false,
      caseModal: false,
      combinedCaseModal: false,
      selectedPerson: null,
      cases: [],
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: '',
      selectedItems: [],
      lastChecked: null,
      isLoading: false,
      peoples: [],
    };

  }

  componentDidMount() {
    const url = window.location.href;
    console.log(url);
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
    if(this.props.peoplePerPageList.length > 0 && prevProps.peoplePerPageList !== this.props.peoplePerPageList) {
      let peopleArray = [];
      this.props.peoplePerPageList.map((pp) => {
        peopleArray.push(pp);
        return null;
      });
      this.setState({peoples: peopleArray});
    }
    if(this.props.peopleList.length > 0 && prevProps.peopleList !== this.props.peopleList) {
      this.setState({totalItemCount: this.props.peopleList.length})
    }
  }

  toggleModal = (modal) => {
    this.setState({
      [modal]: !this.state[modal],
    });
  };

  changeOrderBy = (column) => {
    const {peoples} = this.state;
    if(column === "firstname") {
      peoples.sort(function(a, b){
        var x = a.firstName.toLowerCase();
        var y = b.firstName.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
    }else if(column === "lastname") {
      peoples.sort(function(a, b){
        var x = a.lastName.toLowerCase();
        var y = b.lastName.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
    }
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find((x) => x.column === column),
        peoples: peoples,
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
      let peopleArray = this.props.peoplePerPageList.filter((x) => x.firstName.toLowerCase().includes(searchKey.toLowerCase()) || x.lastName.toLowerCase().includes(searchKey.toLowerCase()));
      this.setState(
        {
          search: searchKey,
          peoples: peopleArray,
          selectedOrderOption: { column: 'title', label: 'Product Name' },
        },
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
      var items = this.state.peoples;
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

  updateCaseForCategory = (caseList) => {
    var sortCases = [];
    if(caseList && caseList.length > 0) {
      caseList.map((caseItem) => {
        if(sortCases.length > 0) {
          var bIncludeItem = false;
          sortCases.map((sortItem) => {
            if(sortItem.catName === caseItem.catName) {
              sortItem.dataList.push(caseItem);
              bIncludeItem = true;
            }
          })
          if(bIncludeItem === false) {
            sortCases.push({catName : caseItem.catName, dataList : [caseItem]})
          }
        }else{
          sortCases.push({catName : caseItem.catName, dataList : [caseItem]})
        }
      })
    }
    return sortCases;
  }
  handleChangeSelectAll = (isToggle) => {
    if (this.state.selectedItems.length >= this.props.peoplePerPageList.length) {
      if (isToggle) {
        this.setState({
          selectedItems: [],
        });
      }
    } else {
      this.setState({
        selectedItems: this.props.peoplePerPageList.map((x) => x.id),
      });
    }
    document.activeElement.blur();
    return false;
  };

  dataListRender = async () => {
    const { selectedPageSize, currentPage } = this.state;
    const { peopleCount } = this.props;
    const fetchCount = peopleCount === 0;
    this.props.getPeople({}, fetchCount);
    this.props.getPeoplePerPage(selectedPageSize, (currentPage - 1) * selectedPageSize)
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

  handleOnClick = (person) => {
    this.props.loadCases(person.id);
    this.setState({ selectedPerson: person }, () => {
      this.toggleModal('caseModal');
    });
  };

  handleOnEdit = (person) => {
    this.setState({ selectedPerson: person }, () => {
      this.toggleModal('editModal');
    });
  };

  handleOnCases = (person) => {
    this.props.loadCases(person.id);
    this.props.getCombinedCases(person.id);
    this.setState({ selectedPerson: person }, () => {
      this.toggleModal('combinedCaseModal');
    });
  }

  onPageNext = () => {
    const {currentPage, selectedPageSize, totalItemCount} = this.state;
    if(currentPage * selectedPageSize < totalItemCount) {
      this.setState({
        currentPage: currentPage + 1,
        search: '',
        selectedOrderOption: { column: 'title', label: 'Product Name' },
      });
      this.props.getPeoplePerPage(selectedPageSize, currentPage * selectedPageSize)
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
      this.props.getPeoplePerPage(selectedPageSize, (currentPage - 2) * selectedPageSize)
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
      peoples,
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
                    heading="people.name"
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
                    itemsLength={peoples ? peoples.length : 0}
                    onSearchKey={this.onSearchKey}
                    orderOptions={orderOptions}
                    pageSizes={pageSizes}
                    toggleModal={() => this.toggleModal('addModal')}
                  />
                  <AddNewModal
                    modalOpen={addModal}
                    toggleModal={() => this.toggleModal('addModal')}
                    categories={categories}
                    handleSubmit={(e) => {
                      this.props.addPeople(e);
                      this.toggleModal('addModal');
                      this.dataListRender();
                    }}
                  />
                  {this.state.selectedPerson && (
                    <EditModal
                      modalOpen={editModal}
                      toggleModal={() => this.toggleModal('editModal')}
                      categories={categories}
                      selectedPerson={this.state.selectedPerson}
                      handleSubmit={(e) => {
                        this.props.editPeople(this.state.selectedPerson.id, e);
                        this.toggleModal('editModal');
                        this.dataListRender();
                      }}
                    />
                  )}
                  {this.state.selectedPerson && (
                    <CaseViewer
                      modalOpen={this.state.caseModal}
                      person={this.state.selectedPerson}
                      cases={this.updateCaseForCategory(this.props.cases)}
                      caseLoading={this.props.caseLoading}
                      caseError={this.props.caseError}
                      toggleModal={() => this.toggleModal('caseModal')}
                    />
                  )}
                  {this.state.selectedPerson && (
                    <CombinedCaseViewer
                      modalOpen={this.state.combinedCaseModal}
                      person={this.state.selectedPerson}
                      cases={this.props.cases}
                      combinedCases={this.props.combinedCases}
                      caseLoading={this.props.caseLoading}
                      caseError={this.props.caseError}
                      toggleModal={() => this.toggleModal('combinedCaseModal')}
                    />
                  )}
                  <Row>
                    {peoples.map((person) => {
                      return (
                        <DataListView
                          key={person.id}
                          product={person}
                          isSelect={this.state.selectedItems.includes(person.id)}
                          onCheckItem={(e) => this.onCheckItem(e,person.id)}
                          collect={collect}
                          onClick={() => this.handleOnClick(person)}
                          onEdit={() => this.handleOnEdit(person)}
                          onCases={() => this.handleOnCases(person)}
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
  ({ people }) => ({
    peopleCount: people.peopleCount,
    peopleList: people.peopleList,
    peoplePerPageList: people.perpagelist,
    error: people.error,
    isLoading: people.loading,
    caseLoading: people.caseLoading,
    caseError: people.caseError,
    cases: people.cases,
    combinedCases: people.combinedCases
  }),
  {
    getPeople: getPeople,
    getPeopleCount: getPeopleCount,
    addPeople: addPeople,
    editPeople: editPeople,
    loadCases: getPeopleCases,
    getPeoplePerPage: getPeoplePerPage,
    getCombinedCases: getCombinedCases,
  },
)(People);
