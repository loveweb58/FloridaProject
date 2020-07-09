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
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem
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
// import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import S3FileUpload from 'react-s3';
import { Base64 } from 'js-base64';
import Highlighter from "react-highlight-words";
import ReactHtmlParser from 'react-html-parser';
import { Document, Page } from 'react-pdf';

var Loader = require('react-loader');

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
    isPdfFile: false,
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
    extractText:[],
    btnDropright: false,
    fileName: '',
    fireText: "",
    fireSelectedArray: [],
    fireSelectedText: {},
    top: 0,
    right:'unset',
    left:0,
    fireDropShow: false,
    fileLoaded: false,
    JobId:'',
    fileNameLink: '',
    HighlightNewText: ''
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
    if(this.state.selectedCategory && this.state.selectedSubCategory){
      if(this.props.personId && this.state.selectedCategory.key && this.state.selectedCategory.label && this.state.selectedSubCategory.key && this.state.selectedSubCategory.label && this.state.editMetaFieldList && this.state.caseName && this.state.fullText && this.state.fileName){
        this.props.addNewCase({
          personId: this.props.personId,
          catId: this.state.selectedCategory.key,
          catName: this.state.selectedCategory.label,
          subCatId: this.state.selectedSubCategory.key,
          subCatName: this.state.selectedSubCategory.label,
          metaFields: this.state.editMetaFieldList,
          name: this.state.caseName,
          extractText: this.state.fullText,
          fileName: this.state.fileName,
        });
        this.props.toggleModal();
      }
    }
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
        'bucketName': process.env.REACT_APP_BUCKET_NAME,
        'region': process.env.REACT_APP_REGION,
        'accessKeyId': process.env.REACT_APP_ACCESS_KEY_ID,
        'secretAccessKey': process.env.REACT_APP_SECRET_ACCESS_KEY,
      }

      var fetch = require('isomorphic-fetch');
		  var Dropbox = require('dropbox').Dropbox;
		  var dbx = new Dropbox({ accessToken: process.env.REACT_APP_ACCESS_TOKEN, fetch: fetch });
		  dbx.filesUpload({path: '/' + e.target.files[0].name, contents: e.target.files[0]})
		  .then(function(response) {
        console.log(response);
        this.setState({
          fileName: '/' + response.name
        });
		  }.bind(this))
      .catch(function(error) {
        // console.log(error);
      });

      // S3FileUpload
      //   .uploadFile(e.target.files[0], config)
      //   .then(function(data){
      //     console.log(data);

        var AWS = require('aws-sdk');
        var Textract = require('aws-sdk/clients/textract');
        AWS.config.update({
          region: process.env.REACT_APP_REGION,
          accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
        });

        var textract = new Textract();

        let file = e.target.files[0];
        let reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onloadend = function(data) {
          // var arrayBuffer = data.target.result;
          console.log(data.target.result);

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
              var firePlainText = '';
              for (let i = 0; i < data.Blocks.length; i++) {
                if(data.Blocks[i].BlockType == "WORD"){
                  firePlainText = firePlainText + data.Blocks[i].Text+" ";
                }
              }

              var extractText_new = data.Blocks;

              this.setState({
                fullText: data,
                extractText: extractText_new,
                fireText: firePlainText,
                fileLoaded: false,
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

  // Convert pdf to text
  handlePdfUpload = (e) => {
    if (e.target.files[0]) {
      this.setState({
        fullText: ''
      })

      var fetch = require('isomorphic-fetch');
		  var Dropbox = require('dropbox').Dropbox;
		  var dbx = new Dropbox({ accessToken: process.env.REACT_APP_ACCESS_TOKEN, fetch: fetch });
		  dbx.filesUpload({path: '/' + e.target.files[0].name, contents: e.target.files[0]})
		  .then(function(response) {
        console.log(response);
        this.setState({
          fileName: '/' + response.name
        });
		  }.bind(this))
      .catch(function(error) {
        // console.log(error);
      });

      dbx.filesGetTemporaryLink({path: '/' + e.target.files[0].name})
      .then(function(response) {
        console.log(response);
        this.setState({
          fileNameLink: response.link
        });
      }.bind(this))
      .catch(function(error) {
        console.log(error);
      });

      const config = {
        'bucketName': process.env.REACT_APP_BUCKET_NAME,
        'region': process.env.REACT_APP_REGION,
        'accessKeyId': process.env.REACT_APP_ACCESS_KEY_ID,
        'secretAccessKey': process.env.REACT_APP_SECRET_ACCESS_KEY,
      }

      S3FileUpload
        .uploadFile(e.target.files[0], config)
        .then(function(data){
          console.log(data);

          var AWS = require('aws-sdk');
          var Textract = require('aws-sdk/clients/textract');
          AWS.config.update({
            region: process.env.REACT_APP_REGION,
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
          });

          var textract = new Textract();

          var params = {
            "DocumentLocation": {
              "S3Object": {
                "Bucket": process.env.REACT_APP_BUCKET_NAME,
                "Name": data.key
              }
            },
            // "ClientRequestToken": 'getDocumentTextDetection'
          };

          this.setState({
            JobId: data.key
          })

          textract.startDocumentTextDetection(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else{
              console.log(data);

              var params = {
                "JobId": data.JobId, /* required */
              };
              
              var fireSetInterval = window.setInterval(function() {
                textract.getDocumentTextDetection(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else {
                    console.log(data);
                    if(data.JobStatus == "SUCCEEDED"){
                      console.log(data.JobStatus)
                      clearInterval(fireSetInterval);

                      var firePlainText = '';
                      for (let i = 0; i < data.Blocks.length; i++) {
                        if(data.Blocks[i].BlockType == "WORD"){
                          firePlainText = firePlainText + data.Blocks[i].Text+" ";
                        }
                        data.Blocks[i]['show_hide'] = false;
                        data.Blocks[i]['background'] = 'inherit';
                        data.Blocks[i]['color'] = 'inherit'
                        data.Blocks[i]['padding'] = '0px';
                      }

                      var extractText_new = data.Blocks;

                      this.setState({
                        fullText: data,
                        extractText: extractText_new,
                        fireText: firePlainText,
                        fileLoaded: false,
                      })

                      var s3 = new AWS.S3();
                      var s3params = {  "Bucket": process.env.REACT_APP_BUCKET_NAME, "Key": this.state.JobId };

                      s3.deleteObject(s3params, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else     console.log(data);           // successful response
                      });
                    }
                  }           // successful response
                }.bind(this));
            }.bind(this), 2000);
              
              
              
            }; // successful response
          }.bind(this));
        }.bind(this))
        .catch(err => console.error(err))

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
    }
    else {
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

  // Read file
  onFileChange = (event) => {
    if (event.target.files[0]) {
      if(event.target.files[0].type.indexOf("png") >= 0 || event.target.files[0].type.indexOf("jpeg") >= 0 || event.target.files[0].type.indexOf("jpg") >= 0 || event.target.files[0].type.indexOf("pdf") >= 0){
        if(event.target.files[0].type.indexOf("pdf") >= 0) {
          this.setState({
            isPdfFile: false,
            fileLoaded: true,
            fileNameLink: '',
          });
          this.handlePdfUpload(event);
        }else if(event.target.files[0].type.indexOf("image") >= 0) {
          this.setState({
            isPdfFile: false,
            fileLoaded: true,
            fileNameLink: '',
          });
          this.handleUpload(event);
        }
      }
      else{
        this.setState({
          isPdfFile: true
        });
      }
      
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  caseNameField = (e) => {
    var selectedArray = [];

    if(e.target.value.length > 0 && e.target.value != ' '){
      selectedArray.push(e.target.value);
    }

    if(this.state.editMetaFieldList.length > 0){
      for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
        if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int'){
          selectedArray.push(this.state.editMetaFieldList[j].value);
        }
        if(this.state.editMetaFieldList[j].type == 'int_range' && this.state.editMetaFieldList[j].value){
          selectedArray.push(this.state.editMetaFieldList[j].value[0]);
          selectedArray.push(this.state.editMetaFieldList[j].value[1]);
        }
      }
    }

    if(selectedArray){
      var replaceString = this.state.fireText;
      for (var i = 0; i < selectedArray.length; i++) {
        if(selectedArray[i]){
          var selectedArrayF = selectedArray[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var regex = new RegExp(selectedArrayF, "i");
        }
        else{
          var regex = new RegExp(selectedArray[i], "i");
        }
        var replaceString = replaceString.replace(regex, '<mark class="highlight">'+selectedArray[i]+'</mark>');
      }
      var x = replaceString;
    }
    else{
      var x = this.state.fireText;
    }

    this.setState({
      caseName: e.target.value,
      fireSelectedArray : selectedArray,
      fireDropShow: false,
      HighlightNewText: ReactHtmlParser(x),
    })
  }

  changeShowHide = (Id) => {
    var text = this.state.extractText;
    for (let i = 0; i < text.length; i++) {
      if(text[i].Id == Id){
        text[i]['show_hide'] = !text[i]['show_hide']
      }
      else{
        text[i]['show_hide'] = false
      }
    }
    // console.log(plainFullText);
    this.setState({
      extractText: text
    })
  }

  searchInText = (e) => {
    var selectedArray = [];
    if(this.state.caseName){
      selectedArray.push(this.state.caseName);
    }

    if(e.target.value.length > 0 && e.target.value != ' '){
      selectedArray.push(e.target.value);
    }

    if(this.state.editMetaFieldList.length > 0){
      for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
        if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int'){
          selectedArray.push(this.state.editMetaFieldList[j].value);
        }
        if(this.state.editMetaFieldList[j].type == 'int_range' && this.state.editMetaFieldList[j].value){
          selectedArray.push(this.state.editMetaFieldList[j].value[0]);
          selectedArray.push(this.state.editMetaFieldList[j].value[1]);
        }
      }
    }

    if(selectedArray){
      var replaceString = this.state.fireText;
      for (var i = 0; i < selectedArray.length; i++) {
        if(selectedArray[i]){
          var selectedArrayF = selectedArray[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var regex = new RegExp(selectedArrayF, "i");
        }
        else{
          var regex = new RegExp(selectedArray[i], "i");
        }
        if(e.target.value == selectedArray[i]){
          var replaceString = replaceString.replace(regex, '<mark style="background:skyblue">'+selectedArray[i]+'</mark>');
        }
        else{
          var replaceString = replaceString.replace(regex, '<mark class="highlight">'+selectedArray[i]+'</mark>');
        }
      }
      var x = replaceString;
    }
    else{
      var x = this.state.fireText;
    }

    this.setState({
      fireSelectedArray : selectedArray,
      fireDropShow: false,
      HighlightNewText: ReactHtmlParser(x),
    })
  }

  finalUpdate = () => {
    var selectedArray = [];
    if(this.state.caseName){
      selectedArray.push(this.state.caseName);
    }

    if(this.state.editMetaFieldList.length > 0){
      for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
        if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int'){
          selectedArray.push(this.state.editMetaFieldList[j].value);
        }
        if(this.state.editMetaFieldList[j].type == 'int_range' && this.state.editMetaFieldList[j].value){
          selectedArray.push(this.state.editMetaFieldList[j].value[0]);
          selectedArray.push(this.state.editMetaFieldList[j].value[1]);
        }
      }
    }

    if(selectedArray){
      var replaceString = this.state.fireText;
      for (var i = 0; i < selectedArray.length; i++) {
        if(selectedArray[i]){
          var selectedArrayF = selectedArray[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var regex = new RegExp(selectedArrayF, "i");
        }
        else{
          var regex = new RegExp(selectedArray[i], "i");
        }
        var replaceString = replaceString.replace(regex, '<mark class="highlight">'+selectedArray[i]+'</mark>');
      }
      var x = replaceString;
    }
    else{
      var x = this.state.fireText;
    }

    this.setState({
      fireSelectedArray : selectedArray,
      fireDropShow: false,
      HighlightNewText: ReactHtmlParser(x),
    })
  }

  leftClickEvenetHandler = (e) => {
    this.setState({
      fireDropShow: false,
    })
  }

  someEvenetHandler = (e) => {
    e.preventDefault()
    if(window.getSelection().toString().length > 0 && window.getSelection().toString() != ' '){
      var dropShow = true
    }
    else{
      var dropShow = false
    }

    this.setState({
      fireSelectedText : window.getSelection(),
      left: e.nativeEvent.offsetX+25,
      top : e.nativeEvent.offsetY+15,
      fireDropShow: dropShow,
    })
  }

  changeFormFieldTextDataNameFire = () => {
    var selection = this.state.fireSelectedText;
    var selectedText = selection.toString() ? selection.toString() : this.state.caseName;
    var selectedArray = [];
    selectedArray.push(selectedText);

    if(this.state.editMetaFieldList.length > 0){
      for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
        if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int'){
          selectedArray.push(this.state.editMetaFieldList[j].value);
        }
        if(this.state.editMetaFieldList[j].type == 'int_range' && this.state.editMetaFieldList[j].value){
          selectedArray.push(this.state.editMetaFieldList[j].value[0]);
          selectedArray.push(this.state.editMetaFieldList[j].value[1]);
        }
      }
    }

    if(selectedArray){
      console.log(selectedArray);
      var replaceString = this.state.fireText;
      for (var i = 0; i < selectedArray.length; i++) {
        if(selectedArray[i]){
          var selectedArrayF = selectedArray[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var regex = new RegExp(selectedArrayF, "i");
        }
        else{
          var regex = new RegExp(selectedArray[i], "i");
        }
        var replaceString = replaceString.replace(regex, '<mark class="highlight">'+selectedArray[i]+'</mark>');
        console.log(replaceString);
        
      }
      var x = replaceString;
    }
    else{
      var x = this.state.fireText;
    }
    
    this.setState({
      caseName: selectedText,
      fireSelectedArray : selectedArray,
      fireDropShow: false,
      HighlightNewText: ReactHtmlParser(x),
    })

    selection.removeAllRanges();
  }

  changeFormFieldTextFire = (text, i) => {
    var selection = this.state.fireSelectedText;
    var selectedText = selection.toString() ? selection.toString() : text;

    if(this.state.editMetaFieldList[i].type == 'str'){
      this.state.editMetaFieldList[i].value = selectedText;
    }

    if(this.state.editMetaFieldList[i].type == 'int'){
      this.state.editMetaFieldList[i].value = selectedText.match(/\d+/g) ? selectedText.match(/\d+/g).join("") : 0;
    }

    if(this.state.editMetaFieldList[i].type == "int_range"){
      this.state.editMetaFieldList[i].value = selectedText.match(/\d+/g) ? [selectedText.match(/\d+/g).join(""), selectedText.match(/\d+/g).join("")] : [];
    }

    var selectedArray = [];
    if(this.state.caseName){
      selectedArray.push(this.state.caseName);
    }

    if(this.state.editMetaFieldList.length > 0){
      for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
        if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int'){
          selectedArray.push(this.state.editMetaFieldList[j].value);
        }
        if(this.state.editMetaFieldList[j].type == 'int_range' && this.state.editMetaFieldList[j].value){
          selectedArray.push(this.state.editMetaFieldList[j].value[0]);
          selectedArray.push(this.state.editMetaFieldList[j].value[1]);
        }
      }
    }

    if(selectedArray){
      console.log(selectedArray);
      
      var replaceString = this.state.fireText;
      for (var i = 0; i < selectedArray.length; i++) {
        if(selectedArray[i]){
          var selectedArrayF = selectedArray[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var regex = new RegExp(selectedArrayF, "i");
        }
        else{
          var regex = new RegExp(selectedArray[i], "i");
        }
        var replaceString = replaceString.replace(regex, '<mark class="highlight">'+selectedArray[i]+'</mark>');
        console.log(replaceString);
      }
      var x = replaceString;
    }
    else{
      var x = this.state.fireText;
    }

    this.setState({
      editMetaFieldList: this.state.editMetaFieldList,
      fireSelectedArray : selectedArray,
      fireDropShow: false,
      HighlightNewText: ReactHtmlParser(x),
    })

    selection.removeAllRanges();
  }

  render() {
    const { modalOpen, toggleModal, categories, subCategories, metaFieldsList } = this.props;
    const { selectedCategory, selectedSubCategory, error, editMetaFieldList, uploads, documents, file, numPages, isPdfFile, currentDate, startDate, endDate, startNumber, endNumber, startNumberError, endNumberError } = this.state;
    
    return (
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static" style={{maxWidth: '1600px', width: '96%'}} onClick={(e) => this.leftClickEvenetHandler(e)}>
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
                    style={{ float: "left", width: "175px"}}
                  />
                  { this.state.fileLoaded ?
                    <div style={{float: 'left', display: 'block', position: 'inherit', marginTop: '-3px'}} className="loading" />
                    :
                    null
                  }
                  <br/>
                  {
                    (this.state.isPdfFile) ?
                      <div style={{ marginTop: '10px', color: 'red'}}>* This file type is not accepted. Please try again. Accepted file type only: png, jpg, jpeg</div>
                    :
                      null
                  }
                </div>
              </div>
              <br/>
              {
                this.state.fullText && selectedSubCategory ? '' :
                  <Alert color="primary" className="rounded">
                    Please select Category and Sub Category and File
                  </Alert>
              }
            </Col>
          </Row>
          <hr/>
          {
            this.state.fullText && selectedSubCategory ?
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
                                  {/* <CardText>
                                    {
                                      this.state.extractText.map((text, i) => (
                                        (text.BlockType == "WORD") ?
                                          <span><ButtonDropdown direction="right" isOpen={text.show_hide} toggle={() => this.changeShowHide(text.Id)}>
                                            <DropdownToggle style={{ color:text.color, background: text.background, border: 'none', padding: text.padding, borderRadius: '0px' }}>
                                              {text.Text}
                                            </DropdownToggle>
                                            <DropdownMenu style={{ borderRadius: '5px', padding: 0, overflowY: 'scroll', height: '200px' }}>
                                              <DropdownItem style={{ paddingLeft: 10 }} onClick={() => this.changeFormFieldTextDataName(text.Text)}>Data Collection Name</DropdownItem>
                                              {
                                                this.state.editMetaFieldList.map((fields, j) => 
                                                  <DropdownItem style={{ paddingLeft: 10 }} onClick={() => this.changeFormFieldText(text.Text, j)}>{fields.name}</DropdownItem>
                                                )
                                              }
                                            </DropdownMenu>
                                          </ButtonDropdown> </span>
                                        :
                                          null
                                      ))
                                    }
                                  </CardText> */}


                                  <CardText onContextMenu={(e) => this.someEvenetHandler(e)} onClick={(e) => this.leftClickEvenetHandler(e)}>
                                    <Highlighter
                                      highlightClassName="highlight"
                                      searchWords={this.state.fireSelectedArray}
                                      autoEscape={true}
                                      textToHighlight={this.state.fireText}
                                    />
                                    {/* {
                                      (this.state.HighlightNewText) ?
                                      this.state.HighlightNewText
                                      :
                                      this.state.fireText
                                    } */}
                                    {
                                      this.state.fireDropShow ?
                                      <ListGroup style={{ position: 'absolute', top:this.state.top, left:this.state.left, height: 'auto', width:200, zIndex:9, overflowY:'auto', maxHeight:226}}>
                                        <ListGroupItem tag="a" href="#" onClick={() => this.changeFormFieldTextDataNameFire()}>Data Collection Name</ListGroupItem>
                                        {
                                          metaFieldsList && metaFieldsList.length > 0 && editMetaFieldList && editMetaFieldList.length > 0 &&
                                          metaFieldsList.map((fields, j) => 
                                            ((fields.type == 'str' || fields.type == 'int' || fields.type == 'int_range') && fields.active) ?
                                              <ListGroupItem tag="a" href="#" onClick={() => this.changeFormFieldTextFire(fields.value, j)}>{fields.name}</ListGroupItem>
                                            :
                                              null
                                          )
                                        }
                                      </ListGroup>
                                      :
                                      null
                                    }
                                    
                                  </CardText>
                                  

                                </Card>
                              </Col>
                            </Row>
                          </TabPane>
                          <TabPane tabId="2">
                            <Row>
                              <Col sm="12">
                                {
                                  this.state.fileNameLink ?
                                    <iframe src={'https://docs.google.com/viewerng/viewer?url='+this.state.fileNameLink+'&embedded=true'} frameborder="1" height="800" width="100%">
                                    </iframe>
                                  :
                                  uploads.map((value, index) => {
                                    return <img key={index} src={value} width="100%" alt={this.state.fileName}/>
                                  })
                                }
                               
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
                                  })
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
                                <Input value={this.state.editMetaFieldList[i] && this.state.editMetaFieldList[i].value ? this.state.editMetaFieldList[i].value : ""} onChange={(e) => (
                                    this.state.editMetaFieldList[i].value = e.target.value,
                                    this.setState({
                                      editMetaFieldList: this.state.editMetaFieldList,
                                    }),
                                    this.finalUpdate()
                                  )} />
                                <span>Values</span>
                              </Label> 
                            }
                            { curMetaField && curMetaField.type === "int" && curMetaField.active &&
                              <Label className="form-group has-top-label">
                                <Input value={this.state.editMetaFieldList[i] && this.state.editMetaFieldList[i].value ? this.state.editMetaFieldList[i].value : ""} type="number" onChange={(e) => (
                                    this.state.editMetaFieldList[i].value = e.target.value,
                                    this.setState({
                                      editMetaFieldList: this.state.editMetaFieldList,
                                    }),
                                    this.finalUpdate()
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
                                <Input value={this.state.editMetaFieldList[i] && this.state.editMetaFieldList[i].value ? this.state.editMetaFieldList[i].value[0] : ""} onChange={(e) =>{
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
                                    this.finalUpdate()
                                  }}
                                />
                                {startNumberError && (
                                  <Alert color="primary" className="rounded">
                                    {startNumberError}
                                  </Alert>
                                )}
                                <br/>
                                <Label>End Number</Label>
                                <Input value={this.state.editMetaFieldList[i] && this.state.editMetaFieldList[i].value ? this.state.editMetaFieldList[i].value[1] : ""} onChange={(e) =>{
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
                                  this.finalUpdate()
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
            :
              ''
          }
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
