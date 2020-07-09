import React, { useEffect, useState } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, CustomInput, Col, Row} from 'reactstrap';
import Switch from 'rc-switch';
import IntlMessages from '../../../../helpers/IntlMessages';
import { connect } from 'react-redux';
import { getCategory, getCategorySubCategory } from '../../../../redux/category/actions';
import { getCaseTag } from '../../../../redux/case-tag/actions';
import Select from 'react-select';
import CustomSelectInput from '../../../../components/common/CustomSelectInput';

const MetaFieldsAddModal = ({
  modalOpen,
  toggleModal,
  handleSubmit,
  categories,
  caseTagList,
  subCategories,
  loadAllCategories,
  loadSubCategory,
  loadCaseTags
}) => {
  const [selectedCategory, setCategory] = useState();
  useEffect(() => {
    loadAllCategories();
  }, [loadAllCategories]);

  for(var i=0; i<caseTagList.length; i++){
    caseTagList[i].checked = false
  }

  const [checkedCaseTag, setCheckedCaseTag] = useState([]);
  const [selectedCaseTagArray, setCaseTagArray] = useState([]);
  useEffect(() => {
    loadCaseTags();
  }, [loadCaseTags]);

  const [selectedSubCategory, setSubCategory] = useState();

  useEffect(() => {
    setSubCategory(null);
    if (selectedCategory && selectedCategory.key) {
      loadSubCategory(selectedCategory.key);
    }
  }, [loadSubCategory, selectedCategory]);
  const [name, setName] = useState('');
  const [type, setType] = useState(null);
  const [boolean] = useState(false);
  const [boxName, setBoxName] = useState('');
  const [boxArray, setBoxArray] = useState([]);
  const [active, setActive] = useState(false);
  const [caseChecked, setCaseChecked] = useState(false);
  const handleAddBox = () => {
    setBoxArray([
      ...boxArray,
      {
        name: boxName
      }
    ]);
    setBoxName('');
  };

  const handleDeleteBox = (i) => {
    setBoxArray([
      ...boxArray.slice(0, i), ...boxArray.slice(i + 1)
    ]);
  }
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
          onChange={(e) => setCategory(e)}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
            key: cat.id,
          }))}
        />
        <br/>
        <Label>Select Sub Category</Label>
        <Select
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          value={selectedSubCategory}
          onChange={(e) => setSubCategory(e)}
          options={subCategories.length > 0 ? subCategories.map((cat) => ({
            label: cat.name,
            value: cat.id,
            key: cat.id,
          })) : [{
            label: 'none',
            value: 'null',
            key: 'null',
          }]}
        />
        <br/>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <br/>
        <div style={{display: 'flex'}}>
          <Label>Active &nbsp;</Label>
          <Switch
            id="Tooltip-Switch"
            className="custom-switch custom-switch-primary custom-switch-small"
            checked={active}
            onChange={setActive}
          />
        </div>
        <br/>
        <Label>Type</Label>
        <Select
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-type"
          value={type}
          onChange={(e) => setType(e)}
          options={[{name: 'String', id: 'str'}, {name: 'Integer', id: 'int'}, {name: 'Boolean', id: 'bool'}, {name: 'Select box', id: 'box'}, {name: 'Date', id: 'date'}, {name: 'Date Range', id: 'date_range'}, {name: 'Integer Range', id: 'int_range'}].map((type) => ({
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
              onChange={setBoolean}
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
                            setBoxArray([...boxArray])
                          )}/>
                      <Button className="ml-3" color="primary" onClick={() => handleDeleteBox(i)} >
                        <IntlMessages id="pages.delete" />
                      </Button>
                    </div>
                  </div>
                ))
              : null
            }
            <br/>
            <div className="d-flex">
              <Input value={boxName} onChange={(e) => setBoxName(e.target.value)} />
              <Button className="ml-3" color="primary" onClick={handleAddBox} >
                <IntlMessages id="pages.add" />
              </Button>
            </div>
           </div>
        }
        <br/>
        <Label>Case Tags</Label>
        <Row>
          {
            caseTagList && caseTagList.length > 0 ?
              caseTagList.map((value, i)=>(                
                <Col xs={6} key={i}>
                  <CustomInput
                    type="checkbox"
                    id={`case_tag_${value.id}`}
                    label={value.name}
                    checked={checkedCaseTag[i]}
                    onChange={(e) => (
                      checkedCaseTag[i] = e.target.checked,
                      (checkedCaseTag[i]) ?
                        selectedCaseTagArray[i] = {'id':value.id}
                      :
                        selectedCaseTagArray[i] = setCaseTagArray([...selectedCaseTagArray.slice(0, i), ...selectedCaseTagArray.slice(i + 1)]),
                      setCaseTagArray([...selectedCaseTagArray]),
                      console.log(selectedCaseTagArray.filter(function(el) { return el; }))
                    )}
                  />
                </Col>
              ))
            : null
          }
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        <Button color="primary" disabled={name !== "" && type && selectedSubCategory ? false : true} onClick={() => 
          handleSubmit({
            name, 
            type: type.value, 
            subCategoryId: selectedSubCategory.key === 'null' ? selectedCategory.key : selectedSubCategory.key, 
            boolean: boolean, 
            boxArray: boxArray,
            active: active,
            caseTags: selectedCaseTagArray.filter(function(el) { return el; })
          })}>
          <IntlMessages id="pages.submit" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default connect(
  ({ category, caseTag }) => ({
    categories: category.categoryList,
    subCategories: category.subCategories,
    caseTagList: caseTag.caseTagList,
  }),
  {
    loadAllCategories: getCategory,
    loadSubCategory: getCategorySubCategory,
    loadCaseTags: getCaseTag,
  },
)(MetaFieldsAddModal);
