import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, CustomInput, Col, Row } from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import { connect } from 'react-redux';
import { getCategory, getCategorySubCategory, getSubCategoryCategory } from '../../../../redux/category/actions';
import { getCaseTag } from '../../../../redux/case-tag/actions';
import Select from 'react-select';
import CustomSelectInput from '../../../../components/common/CustomSelectInput';
import inputHandler from '../../../../helpers/inputHandler';
import Switch from 'rc-switch';

class MetaFieldEdit extends React.Component {

  constructor(prop) {
    super(prop);
    const { selectedMetaField, loadSelectedSubCategory} = prop;
    this.state = {
      selectedCategory: null,
      selectedSubCategory: null,
      name: selectedMetaField.name,
      type: selectedMetaField.type,
      boolean: selectedMetaField.boolean,
      active: selectedMetaField.active,
      boxName: "",
      boxArray : [],
      allCaseTag: selectedMetaField.caseTags,
      selectedCaseTagArray: [],
      newList:[],
      checkedCaseTag:[],
      checkboxes: null
    };
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    loadSelectedSubCategory(selectedMetaField.subCategoryId);
  }

  

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.selectedMetaField !== this.props.selectedMetaField) {
      nextProps.loadSelectedSubCategory(nextProps.selectedMetaField.subCategoryId);
    }
    // if (nextProps.selectedMetaField !== this.props.selectedMetaField) {
      const { category, subCategory} = nextProps.selectedCategoryData;
      if (category) {
        this.setState({
          ...this.state,
          selectedCategory: { label: category.name, key: category.id, value: category.id },
          selectedSubCategory: { label: subCategory ? subCategory.name : 'none', key: subCategory ? subCategory.id : 'null', value: subCategory ? subCategory.id : 'null'},
          name: nextProps.selectedMetaField.name,
          type:
              nextProps.selectedMetaField.type === 'int'
              ? { label: 'Integer', key: 'int', id: 'int' }
              : nextProps.selectedMetaField.type === 'str'
              ? { label: 'String', key: 'str', id: 'str' }
              : nextProps.selectedMetaField.type === 'bool'
              ? { label: 'Boolean', key: 'bool', id: 'bool' }
              : nextProps.selectedMetaField.type === 'box'
              ? { label: 'Select box', key: 'box', id: 'box'}
              : nextProps.selectedMetaField.type === 'date'
              ? { label: 'Date', key: 'date', id: 'date'}
              : nextProps.selectedMetaField.type === 'date_range'
              ? { label: 'Date Range', key: 'date_range', id: 'date_range'}
              : nextProps.selectedMetaField.type === 'int_range'
              ? { label: 'Integer Range', key: 'int_range', id: 'int_range'}
              : null,
          boolean: nextProps.selectedMetaField.boolean,
          boxArray: nextProps.selectedMetaField.boxArray,
          active: nextProps.selectedMetaField.active,
          boxName: "",
        }, () => {
          // console.log(this.state);
        });
      }
    // }
  }

  componentDidMount(){
    console.log("================================================");
    console.log(this.state.allCaseTag);
    
    this.setState({
      checkedCaseTag: this.props.caseTagList,
      selectedCaseTagArray: this.state.allCaseTag
    }, ()=>{
      // console.log('props', this.props.caseTagList)
    })
  }

  handleCategoryChange(e) {
    this.setState(
      {
        ...this.state,
        selectedCategory: e,
        selectedSubCategory: null,
      },
      () => {
        this.props.loadSubCategory(e.key);
      },
    );
  }
  handleSubCategoryChange(e) {
    this.setState({
      ...this.state,
      selectedSubCategory: e,
    });
  }

  handleTypeChange(e) {
    this.setState({
      ...this.state,
      type: e,
    });
  }

  handleBooleanChange(e) {
    this.setState({
      ...this.state,
      boolean: e,
    });
  }

  handleActiveChange(e) {
    this.setState({
      ...this.state,
      active: e,
    });
  }


  handleAddBox = ()=> {
    let boxList = this.state.boxArray;
    boxList.push({name: this.state.boxName});
    this.setState({
      ...this.state,
      boxName: "",
      boxArray: boxList,
    });
  }

  handleDeleteBox = (i)=> {
    let boxList = this.state.boxArray;
    boxList.splice(i, 1);
    this.setState({
      ...this.state,
      boxArray: boxList,
    });
  }

  

  handleCheckBoxChange(e, value){
    var removeByAttr = function(arr, attr, value){
      var i = arr.length;
      while(i--){
         if( arr[i] 
             && arr[i].hasOwnProperty(attr) 
             && (arguments.length > 2 && arr[i][attr] === value ) ){ 
  
             arr.splice(i,1);
  
         }
      }
      return arr;
    }
    let list = JSON.parse(JSON.stringify(this.state.checkedCaseTag));

    let arr = [];
    let newTag = this.state.selectedCaseTagArray ? this.state.selectedCaseTagArray : [];
    let id = value.id;
    list.forEach((val)=>{
      if(val.id == id){
        val['checked'] = e.target.checked;
        if(e.target.checked){
          newTag.push({"id": value.id})
        }
        else{
          removeByAttr(newTag, 'id', value.id);
        }
      }
      arr.push(val);
    })
    this.setState({
      checkedCaseTag: arr
    })
    this.setState({
      selectedCaseTagArray: newTag
    })
    // console.log(this.state.selectedCaseTagArray);
  }

  render() {
    const { modalOpen, toggleModal, handleSubmit, categories, subCategories, caseTagList} = this.props;
    const { name, type, selectedCategory, selectedSubCategory, boolean, boxArray, boxName, active, allCaseTag} = this.state;

    for(var i=0; i<caseTagList.length; i++){
      if(this.state.allCaseTag){
        for(var j=0; j < this.state.allCaseTag.length; j++){
          if(this.state.allCaseTag[j].id == caseTagList[i].id){
            caseTagList[i].checked = true
          }
        }
      }
    }

    const handleInput = inputHandler(this).normal;
    return (
      <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id="pages.add-new-modal-title" />
        </ModalHeader>
        <ModalBody>
          <Label>Select Category</Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            value={selectedCategory}
            onChange={(e) => this.handleCategoryChange(e)}
            options={categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
              key: cat.id,
            }))}
          />
          <br />
          <Label>Select Sub Category</Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            value={selectedSubCategory ? selectedSubCategory : 'none'}
            onChange={(e) => this.handleSubCategoryChange(e)}
            options={subCategories.length > 0 ? subCategories.map((cat) => ({
              label: cat.name,
              value: cat.id,
              key: cat.id,
            })):[{
              label: 'none',
              value: 'null',
              key: 'null',
            }]}
          />
          <br />
          <Label>Name</Label>
          <Input value={name} onChange={handleInput('name')} />
          <br/>
          <div style={{display: 'flex'}}>
            <Label>Active &nbsp;</Label>
            <Switch
              id="Tooltip-Switch"
              className="custom-switch custom-switch-primary custom-switch-small"
              checked={active}
              onChange={(e) => this.handleActiveChange(e)}
            />
          </div>
          <br />
          <Label>Type</Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-type"
            value={type}
            onChange={(e) => this.handleTypeChange(e)}
            options={[{ name: 'String', id: 'str' }, { name: 'Integer', id: 'int' }, { name: 'Boolean', id: 'bool' }, {name: 'Select box', id: 'box'},{name: 'Date', id: 'date'}, {name: 'Date Range', id: 'date_range'}, {name: 'Integer Range', id: 'int_range'}].map((type) => ({
              label: type.name,
              value: type.id,
              key: type.id,
            }))}
          />
          {/* {type != null && type.key === 'bool'
            ?<div className="d-none d-md-inline-block align-middle mr-3">
              <br/>
              <Switch
                id="Tooltip-Switch"
                className="custom-switch custom-switch-primary custom-switch-small"
                checked={boolean}
                onChange={(e) => this.handleBooleanChange(e)}
              />
            </div>
            :null
          } */}
          {type != null && type.key === 'box' &&
            <div>
              {boxArray && boxArray.length > 0 
                ? boxArray.map((box, i)=>(
                    <div>
                      <br/>
                      <div className="d-flex" key={i}>
                        <Input value={box.name} onChange={(e) => (
                            box.name = e.target.value,
                            boxArray[i] = box,
                            this.setState({
                              boxArray: boxArray,
                            })
                          )}/>
                        <Button className="ml-3" color="primary" onClick={() => this.handleDeleteBox(i)} >
                          <IntlMessages id="pages.delete" />
                        </Button>
                      </div>
                    </div>
                  ))
                : null
              }
              <br/>
              <div className="d-flex">
                <Input value={boxName} onChange={handleInput('boxName')} />
                <Button className="ml-3" color="primary" onClick={this.handleAddBox} >
                  <IntlMessages id="pages.add" />
                </Button>
              </div>
            </div>
          }
          <br/>
          <Label>Case Tags</Label>
          <Row>
            { this.state.checkedCaseTag.map((value, i)=>{
                return <Col xs={6} key={i}>
                  <CustomInput
                  type="checkbox"
                  id={`case_tag_${value.id}`}
                  label={value.name}
                  checked={value.checked}
                  onChange={(e) => this.handleCheckBoxChange(e, value)}
                />
            </Col>})}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggleModal}>
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button color="primary" disabled={name !== "" && type && selectedSubCategory ? false : true} onClick={() =>
            handleSubmit({
              name, 
              type: type.key, 
              subCategoryId: selectedSubCategory.key === 'null' ? selectedCategory.key : selectedSubCategory.key,
              boolean: boolean, 
              boxArray: boxArray,
              active: active,
              caseTags: this.state.selectedCaseTagArray
            })}>
            <IntlMessages id="pages.submit" />
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(
  ({ category, caseTag }) => ({
    categories: category.categoryList,
    subCategories: category.subCategories,
    selectedCategoryData: category.subCategoryData,
    caseTagList: caseTag.caseTagList,
  }),
  {
    loadAllCategories: getCategory,
    loadSubCategory: getCategorySubCategory,
    loadSelectedSubCategory: getSubCategoryCategory,
    loadCaseTags: getCaseTag,
  },
)(MetaFieldEdit);
