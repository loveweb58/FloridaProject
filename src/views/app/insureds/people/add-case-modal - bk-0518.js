import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Alert,
  Form,
  Label,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardText,
  FormGroup,
  Tooltip,
} from 'reactstrap';
import classnames from 'classnames';
import { getMetaFields } from '../../../../redux/meta-fields/actions';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';

import IntlMessages from '../../../../helpers/IntlMessages';
import { connect } from 'react-redux';
import { getCategory, getCategorySubCategory } from '../../../../redux/category/actions';
import Select from 'react-select';
import CustomSelectInput from '../../../../components/common/CustomSelectInput';
import { addCase } from '../../../../redux/people/actions';
import Tesseract  from 'tesseract.js';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import S3FileUpload from 'react-s3';
import { Base64 } from 'js-base64';
import Highlighter from "react-highlight-words";
import ReactHtmlParser from 'react-html-parser';

var validator = require('validator');

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

class AddCaseModal extends React.Component {
  state = {
    selectedMetaField: null,
    value: '',
    error: null,
    selectedCategory: null,
    selectedSubCategory: null,
    curMetaField: null,
    editMetaFieldList: [],
    uploads: [],
    patterns: [],
    documents: [],
    file: '',
    numPages: null,
    isPdfFile: true,
    caseName: '',
    currentDate: null,
    startDate: null,
    endDate: null,
    startNumber: "",
    endNumber: "",
    startNumberError: null,
    endNumberError: null,
    fullText:'',
    activeTab:'1',
    searchingWord:'',
    fullTextNew: '',
    tooltipOpen: false,
    caseNameText:'',
  };

  componentDidMount() {
    this.props.loadAllCategories();
  }

  handleSelectCategory = (cat) => {
    this.setState({ selectedCategory: cat });
    this.props.getCategorySubCategories(cat.key);
  };

  handleSelectSubCategory = (subCat) => {
    this.setState({ selectedSubCategory: subCat });
    this.props.getMetaFields({ where: { subCategoryId: subCat.value } });
  };

  handleSelect = (metaField) => {
    const { metaFieldsList } = this.props;
    const selectedMF = metaFieldsList[metaField.key];
    this.setState({ selectedMetaField: metaField, value: selectedMF.boolean ? "true" : "false", curMetaField: selectedMF, selectedType: selectedMF.boolean });
  };

  handleSubmit = () => {
    this.setState({ error: null });
    this.props.addNewCase({
      personId: this.props.personId,
      catId: this.state.selectedCategory.key,
      catName: this.state.selectedCategory.label,
      subCatId: this.state.selectedSubCategory.key,
      subCatName: this.state.selectedSubCategory.label,
      metaFields: this.state.editMetaFieldList,
      name: this.state.caseName,
    });
    this.props.toggleModal();
  };

  componentDidUpdate(prevProps) {
    if(this.props.metaFieldsList.length > 0 && prevProps.metaFieldsList !== this.props.metaFieldsList) {
      let metaFieldsArray = [];
      this.props.metaFieldsList.map((mf) => {
        metaFieldsArray.push({id: mf.id, name: mf.name, type: mf.type, value: null});
        return null;
      });
      this.setState({
        editMetaFieldList: metaFieldsArray,
      })
    }
  }

  toggle = tab => {
    if(this.state.activeTab !== tab){
      this.setState({
        activeTab: tab
      })
    }
  }

  // Convert img to text
  handleUpload = (e) => {
    if (e.target.files[0]) {

      this.setState({
        fullText: ''
      })

      const config = {
        'bucketName': 'florida-textract',
        'region': 'us-east-1',
        'accessKeyId': 'AKIAIIBM2O2QHWQD3YUQ',
        'secretAccessKey': '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',
      }

      var fetch = require('isomorphic-fetch');
		  var Dropbox = require('dropbox').Dropbox;
		  var dbx = new Dropbox({ accessToken: 'DmE2e3M5o58AAAAAAAACWiAXAqwSHDDBzoQV45MI8Bd2cXWhJoX--bfyl7hfynho', fetch: fetch });
		  dbx.filesUpload({path: '/' + e.target.files[0].name, contents: e.target.files[0]})
		  .then(function(response) {
			  // console.log(response);
		  })
      .catch(function(error) {
        // console.log(error);
      });

      // S3FileUpload
      //   .uploadFile(e.target.files[0], config)
      //   .then(function(data){
      //     console.log(data);

      //   var AWS = require('aws-sdk');
        var Textract = require('aws-sdk/clients/textract');

        var textract = new Textract();

        let file = e.target.files[0];
        let reader = new FileReader();
		
		    reader.readAsArrayBuffer(file);

        reader.onloadend = function(data) {
          // var arrayBuffer = data.target.result;
          // console.log(data.target.result);

          var params = {
            "Document": {
              "Bytes":  data.target.result,
              // "S3Object": {
              //   "Bucket": 'florida-textract',
              //   "Name": data.key
              // }
            }
          };
	
          textract.detectDocumentText(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else{
              console.log(data);           // successful response
              var fullTextNew = '';
              for (let i = 0; i < data.Blocks.length; i++) {
              if(data.Blocks[i].BlockType == "LINE"){
                // console.log(data.Blocks[i].Text);
                fullTextNew = fullTextNew+data.Blocks[i].Text+"\n";
              }
              }
              // console.log(fullTextNew);
              this.setState({
              fullText: fullTextNew
              })
            }
          }.bind(this));
		    }.bind(this);

      //   }.bind(this))
		//   .catch(err => console.error(err))

      var uploads = []
      for (var key in e.target.files) {
        if (!e.target.files.hasOwnProperty(key)) continue;
        let upload = e.target.files[key]
        uploads.push(URL.createObjectURL(upload))
      }
      this.setState({
        isPdfFile: false,
        uploads: uploads
      })
    } else {
      this.setState({
        uploads: []
      })
    }
  }

  handleGenerate = () => {
    let uploads = this.state.uploads
    for(var i = 0; i < uploads.length; i++) {
      Tesseract.recognize(uploads[i], {
        lang: 'eng'
      })
      .catch(err => {
        console.error(err);
      })
      .then(result => {
        let confidence = result.confidence
        let text = result.text
        let pattern = /\b\w{10,10}\b/g
        let patterns = result.text.match(pattern);
        this.setState({
          patterns: this.state.patterns.concat(patterns),
          documents: this.state.documents.concat({
            pattern: patterns,
            text: text,
            confidence: confidence
          })
        })
      })
    }
  }

  // Read Pdf
  onFileChange = (event) => {
    if (event.target.files[0]) {
      if(event.target.files[0].type.indexOf("pdf") >= 0) {
        this.setState({
          isPdfFile: true,
          file: event.target.files[0],
        });
      }else if(event.target.files[0].type.indexOf("image") >= 0) {
        this.handleUpload(event);
      }
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  finalUpdate = () => {
    // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');  
    var f_Text = this.state.fullText;

    var Obj = new Object();
    if(this.state.caseName.length > 0 ){
      Obj[this.state.caseName] = this.state.caseName;
    }

    if(this.state.searchingWord.length > 0){
      Obj[this.state.searchingWord] = this.state.searchingWord;
    }

    for(var i =0; i < this.state.editMetaFieldList.length; i++){
      if(this.state.editMetaFieldList[i].value != ''){
        Obj[this.state.editMetaFieldList[i].value] = this.state.editMetaFieldList[i].value;
      }
    }

    if(Object.keys(Obj).length > 0){
      var re = new RegExp(Object.keys(Obj).join("|"), "gi");
      var str = f_Text.replace(re, function(m){
        var nre = new RegExp(m, "gi");
        if(this.state.searchingWord.match(nre)){
          return '<span style="background: #13ff92;padding: 0 2px;">'+m+'</span>'
        }
        else{
          var t1 = '';
          if(this.state.caseName != null && m == this.state.caseName){
            t1 = this.state.caseNameText;
          }
          
          for(var i = 0; i < this.state.editMetaFieldList.length; i++){
            if(this.state.editMetaFieldList[i].value != null && m == this.state.editMetaFieldList[i].value){
              t1 = this.state.editMetaFieldList[i].name + '<br>' + t1;
            }
          }
          return '<span style="background: yellow;padding: 0 2px;" class="customtooltip">'+m+'<span class="customtooltiptext">'+t1+'</span></span>'
        }
      }.bind(this));
    }
    else{
      var str = f_Text;
    }

    if(Object.keys(Obj).length > 0){
      this.setState({
        fullTextNew: str
      });
    }
    else{
      this.setState({
        fullTextNew: str
      });
    }
  }

  caseNameField = (e) => {
    this.setState({
      caseName: e.target.value,
      caseNameText: 'Data Collection Name'
    })

    var f_Text = this.state.fullText;

    var Obj = new Object();
    if(e.target.value.length > 0 ){
      Obj[e.target.value] = e.target.value;
    }

    if(this.state.searchingWord.length > 0){
      Obj[this.state.searchingWord] = this.state.searchingWord;
    }

    for(var i =0; i < this.state.editMetaFieldList.length; i++){
      if(this.state.editMetaFieldList[i].value != ''){
        Obj[this.state.editMetaFieldList[i].value] = this.state.editMetaFieldList[i].value;
      }
    }

    if(Object.keys(Obj).length > 0){
      var re = new RegExp(Object.keys(Obj).join("|"), "gi");
      var str = f_Text.replace(re, function(m){
        var nre = new RegExp(m, "gi");
        if(this.state.searchingWord.match(nre)){
          return '<span style="background: #13ff92;padding: 0 2px;">'+m+'</span>'
        }
        else{
          var t1 = '';
          if(e.target.value.length != null && m == e.target.value){
            t1 = 'Data Collection Name';
          }
          
          for(var i = 0; i < this.state.editMetaFieldList.length; i++){
            if(this.state.editMetaFieldList[i].value != null && m == this.state.editMetaFieldList[i].value){
              t1 = this.state.editMetaFieldList[i].name + '<br>' + t1;
            }
          }
          return '<span style="background: yellow;padding: 0 2px;" class="customtooltip">'+m+'<span class="customtooltiptext">'+t1+'</span></span>'
        }
      }.bind(this).bind(e));
    }
    else{
      var str = f_Text;
    }

    if(e.target.value > 0){
      this.setState({
        fullTextNew: str
      });
    }
    else{
      this.setState({
        fullTextNew: str
      });
    }

  }

  searchInText = (e) => {
    var searchWord = e.target.value;
    var f_Text = this.state.fullText;

    var Obj = new Object();
    if(searchWord.length > 0){
      Obj[searchWord] = searchWord;
    }
    if(this.state.caseName.length > 0){
      Obj[this.state.caseName] = this.state.caseName;
    }

    for(var i =0; i < this.state.editMetaFieldList.length; i++){
      if(this.state.editMetaFieldList[i].value != ''){
        Obj[this.state.editMetaFieldList[i].value] = this.state.editMetaFieldList[i].value;
      }
    }

    

    if(Object.keys(Obj).length > 0){
      var re = new RegExp(Object.keys(Obj).join("|"), "gi");
      var str = f_Text.replace(re, function(m){
        var nre = new RegExp(m, "gi");
        // console.log(this.state.editMetaFieldList);
        if(e.target.value.match(nre)){
          return '<span style="background: #13ff92;padding: 0 2px;">'+m+'</span>'
        }
        else{
          var t1 = '';
          if(this.state.caseName.length != null && m == this.state.caseName){
            t1 = this.state.caseNameText;
          }
          
          for(var i = 0; i < this.state.editMetaFieldList.length; i++){
            if(this.state.editMetaFieldList[i].value != null && m == this.state.editMetaFieldList[i].value){
              t1 = this.state.editMetaFieldList[i].name + '<br>' + t1;
            }
          }
          return '<span style="background: yellow;padding: 0 2px;" class="customtooltip">'+m+'<span class="customtooltiptext">'+t1+'</span></span>'
        }
      }.bind(this).bind(e));
    }
    else{
      var str = f_Text;
    }

    if(searchWord.length > 0){
      this.setState({
        searchingWord: searchWord,
        fullTextNew: str
      });
    }
    else{
      this.setState({
        searchingWord: '',
        fullTextNew: str
      });
    }
  }

  render() {
    const { modalOpen, toggleModal, categories, subCategories, metaFieldsList } = this.props;
    const { selectedCategory, selectedSubCategory, error, editMetaFieldList, uploads, documents, file, numPages, isPdfFile, currentDate, startDate, endDate, startNumber, endNumber, startNumberError, endNumberError } = this.state;
    return (
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
        <ModalHeader toggle={toggleModal}>Add New DataCollection</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={6}>
              <Label>Select Category and Sub Category</Label>
              <Select
                components={{ Input: CustomSelectInput }}
                className="react-select"
                classNamePrefix="react-select"
                name="form-field-name"
                value={selectedCategory}
                onChange={(e) => this.handleSelectCategory(e)}
                options={categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                  key: cat.id,
                }))}
              />
              <br />
              {/* <Label>Select Sub Category</Label> */}
              <Select
                components={{ Input: CustomSelectInput }}
                className="react-select"
                classNamePrefix="react-select"
                name="form-field-name"
                value={selectedSubCategory}
                onChange={(e) => this.handleSelectSubCategory(e)}
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
            </Col>
            <Col sm={6}>
              <Label>Select File</Label>
              <div className="Example__container">
                <div className="Example__container__load">
                  <input
                    onChange={this.onFileChange}
                    type="file"
                  />
                </div>
              </div>
              <br/>
              {selectedSubCategory ? '' :
                <Alert color="primary" className="rounded">
                  Please select Category and Sub Category
                </Alert>
              }
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col xs={6}>
              {
                this.state.fullText != '' ?
                  <>
                  <Nav tabs>
                    <NavItem style={{cursor: 'pointer'}}>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => this.toggle('1')}
                      >
                        Converted
                      </NavLink>
                    </NavItem>
                    <NavItem style={{cursor: 'pointer'}}>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => this.toggle('2')}
                      >
                        Original
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <br/>
                    <TabPane tabId="1">
                      <FormGroup>
                        <Input type="text" placeholder="Search" onChange={(e) => this.searchInText(e)} />
                      </FormGroup>
                      <Row>
                        <Col sm="12">
                          <Card body>
                            <CardText>
                              {/* <Highlighter
                                highlightStyle={{backgroundColor: '#7eff7e'}}
                                searchWords={this.state.searchingWord}
                                autoEscape={true}
                                textToHighlight={this.state.fullText}
                              /> */}
                              { (this.state.fullTextNew == '') ?
                                this.state.fullText
                                :
                                ReactHtmlParser(this.state.fullTextNew)
                              }
                            </CardText>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">
                          { uploads.map((value, index) => {
                            return <img key={index} src={value} width="100%" />
                          }) }
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                  </>
                :
                  null
              }
            </Col>
            <Col xs={6}>
              <h2>{selectedCategory && selectedCategory.label}</h2>
              <h3>{selectedSubCategory && selectedSubCategory.label}</h3>
              <h4>{selectedSubCategory && 'Data Collection Name'}</h4>
              {selectedSubCategory && 
                <Input value={this.state.caseName} onChange={(e) => this.caseNameField(e)} />
              }
              {metaFieldsList && metaFieldsList.length > 0 && editMetaFieldList && editMetaFieldList.length > 0 &&
                  metaFieldsList.map((curMetaField, i)=>(
                    <>
                    <br />
                    <h4>{curMetaField && curMetaField.active && curMetaField.name}</h4>
                    <Form>
                      {curMetaField && curMetaField.type === "bool" && curMetaField.active && 
                       <Switch
                          id="Tooltip-Switch"
                          className="custom-switch custom-switch-primary custom-switch-small"
                          checked={editMetaFieldList[i] && editMetaFieldList[i].value ? editMetaFieldList[i].value : false}
                          onChange={(e) => (
                            editMetaFieldList[i].value = e,
                            this.setState({
                              editMetaFieldList: editMetaFieldList,
                            }),
                            this.finalUpdate()
                          )}
                        />
                      }
                      { curMetaField && curMetaField.type === "box" && curMetaField.active &&
                       <Select
                        components={{ Input: CustomSelectInput }}
                        className="react-select"
                        classNamePrefix="react-select"
                        name="form-field-type"
                        value={editMetaFieldList[i] && editMetaFieldList[i].value ? editMetaFieldList[i].value : ""}
                        onChange={(e) => (
                          editMetaFieldList[i].value = e,
                            this.setState({
                              editMetaFieldList: editMetaFieldList,
                            })
                          )}
                        options={curMetaField.boxArray.map((box, i) => ({
                          label: box.name,
                          value: i,
                          key: i,
                        }))}
                      />
                      }
                      { curMetaField && curMetaField.type === "str" && curMetaField.active &&
                        <Label className="form-group has-top-label">
                          <Input value={editMetaFieldList[i] && editMetaFieldList[i].value ? editMetaFieldList[i].value.label : ""} onChange={(e) => (
                              editMetaFieldList[i].value = e.target.value,
                              this.setState({
                                editMetaFieldList: editMetaFieldList,
                              }),
                              this.finalUpdate()
                            )} />
                          <span>Values</span>
                        </Label> 
                      }
                      { curMetaField && curMetaField.type === "int" && curMetaField.active &&
                        <Label className="form-group has-top-label">
                          <Input value={editMetaFieldList[i] && editMetaFieldList[i].value ? editMetaFieldList[i].value.label : ""} type="number" onChange={(e) => (
                              editMetaFieldList[i].value = e.target.value,
                              this.setState({
                                editMetaFieldList: editMetaFieldList,
                              })
                            )} />
                          <span>Value</span>
                        </Label> 
                      }
                      { curMetaField && curMetaField.type === "date" && curMetaField.active &&
                        <DatePicker
                          selected={currentDate ? moment(currentDate) : ''}
                          onChange={(date) => ( 
                            editMetaFieldList[i].value = date,
                            this.setState({
                              currentDate: date,
                              editMetaFieldList: editMetaFieldList,
                            })
                          )}
                        />        
                      }
                      { curMetaField && curMetaField.type === "date_range" && curMetaField.active &&
                        <div>
                          <br/>
                          <Label>Start Date</Label>
                          <DatePicker
                            selected={startDate ? moment(startDate) : ''}
                            onChange={(date) => {
                              if(editMetaFieldList[i].value && editMetaFieldList[i].value.length > 0) {
                                editMetaFieldList[i].value[0] = date
                              }else{
                                editMetaFieldList[i].value = [date, endDate];
                              }
                              this.setState({
                                startDate: date,
                                editMetaFieldList: editMetaFieldList,
                              })
                            }}
                            selectsStart
                            startDate={startDate ? moment(startDate) : ''}
                            endDate={endDate ? moment(endDate) : ''}
                          />        
                          <br/>
                          <br/>
                          <Label>End Date</Label>
                          <DatePicker
                            selected={endDate ? moment(endDate) : ''}
                            onChange={(date) => {
                              if(editMetaFieldList[i].value && editMetaFieldList[i].value.length > 1) {
                                editMetaFieldList[i].value[1] = date
                              }else{
                                editMetaFieldList[i].value = [startDate, date];
                              }
                              this.setState({
                                endDate: date,
                                editMetaFieldList: editMetaFieldList,
                              })
                            }}
                            selectsEnd
                            startDate={startDate ? moment(startDate) : ''}
                            endDate={endDate ? moment(endDate) : ''}
                            minDate={startDate ? moment(startDate) : ''}
                          />        
                        </div>
                      }
                      { curMetaField && curMetaField.type === "int_range" && curMetaField.active &&
                        <div>
                          <br/>
                          <Label>Start Number</Label>
                          <Input value={startNumber} onChange={(e) =>{
                              if(validator.isInt(e.target.value)) {
                                if(editMetaFieldList[i].value && editMetaFieldList[i].value.length > 0) {
                                  editMetaFieldList[i].value[0] = e.target.value
                                }else{
                                  editMetaFieldList[i].value = [e.target.value, endNumber];
                                }
                                this.setState({
                                  startNumber: e.target.value,
                                  editMetaFieldList: editMetaFieldList,
                                  startNumberError: null
                                })
                              }else{
                                this.setState({
                                  startNumberError: 'Value should be a number'
                                })
                              }
                            }}
                          />
                          {startNumberError && (
                            <Alert color="primary" className="rounded">
                              {startNumberError}
                            </Alert>
                          )}
                          <br/>
                          <Label>End Number</Label>
                          <Input value={endNumber} onChange={(e) =>{
                            if(validator.isInt(e.target.value)) {
                              if(editMetaFieldList[i].value && editMetaFieldList[i].value.length > 1) {
                                editMetaFieldList[i].value[1] = e.target.value
                              }else{
                                editMetaFieldList[i].value = [startNumber, e.target.value];
                              }
                              this.setState({
                                endNumber: e.target.value,
                                editMetaFieldList: editMetaFieldList,
                                endNumberError: null
                              })
                            }else{
                              this.setState({
                                endNumberError: 'Value should be a number'
                              })
                            }
                          }} />
                          {endNumberError && (
                            <Alert color="primary" className="rounded">
                              {endNumberError}
                            </Alert>
                          )}
                        </div>
                      }
                      {error && (
                        <Alert color="primary" className="rounded">
                          {error}
                        </Alert>
                      )}
                    </Form>
                    </>
                ))
              }
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggleModal}>
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button color="secondary" onClick={this.handleSubmit}>
            <IntlMessages id="pages.submit" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(
  ({ metaFields, category }) => ({
    metaFieldsList: metaFields.list,
    subCategoryData: category.subCategoryData,
    categories: category.categoryList,
    subCategories: category.subCategories,
  }),
  {
    getMetaFields: getMetaFields,
    getCategorySubCategories: getCategorySubCategory,
    loadAllCategories: getCategory,
    addNewCase: addCase,
  },
)(AddCaseModal);
