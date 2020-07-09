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
import { addCase, editCase } from '../../../../redux/people/actions';
import Tesseract  from 'tesseract.js';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Highlighter from "react-highlight-words";
import ReactHtmlParser from 'react-html-parser';
import S3FileUpload from 'react-s3';

var validator = require('validator');

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

class EditCaseModal extends React.Component {
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
    startDate: null,
    endDate: null,
    startNumber: "",
    endNumber: "",
    startNumberError: null,
    endNumberError: null,
    extractText:[],
    fullText:'',
    activeTab:'1',
    searchingWord:'',
    fileName:'',
    fileNameLink: '',
    fireText:'',
    fireSelectedArray: [],
    fireSelectedText: {},
    top: 0,
    right:'unset',
    left:0,
    fireDropShow: false,
    fileLoaded: true,
    JobId:'',
    fileNameLink: '',
    HighlightNewText: ''
  };

  componentDidMount() {
    this.props.loadAllCategories();
    this.props.getCategorySubCategories(this.props.selectedCase.catId);
    this.props.getMetaFields({ where: { subCategoryId: this.props.selectedCase.subCatId } });

    // get fileLink
    var fetch = require('isomorphic-fetch');
		var Dropbox = require('dropbox').Dropbox;
    var dbx = new Dropbox({ accessToken: process.env.REACT_APP_ACCESS_TOKEN, fetch: fetch });
    
    dbx.filesGetTemporaryLink({path: this.props.selectedCase.fileName})
    .then(function(response) {
      // console.log(response);
      this.setState({
        fileNameLink: response.link
      });
    }.bind(this))
    .catch(function(error) {
      console.log(error);
    });

    var firePlainText = '';
    if(this.props.selectedCase.extractText){
      if(this.props.selectedCase.extractText.Blocks){
        for (let i = 0; i < this.props.selectedCase.extractText.Blocks.length; i++) {
          if(this.props.selectedCase.extractText.Blocks[i].BlockType == "WORD"){
            firePlainText = firePlainText + this.props.selectedCase.extractText.Blocks[i].Text+" ";
          }
        }
      }
    }

    var selectedArray = [];
    if(this.props.selectedCase.name){
      selectedArray.push(this.props.selectedCase.name);
    }

    if(this.props.selectedCase.metaFields.length > 0){
      for (let j = 0; j < this.props.selectedCase.metaFields.length; j++) {
        if(this.props.selectedCase.metaFields[j].type == 'str' || this.props.selectedCase.metaFields[j].type == 'int'){
          selectedArray.push(this.props.selectedCase.metaFields[j].value);
        }
        if(this.props.selectedCase.metaFields[j].type == 'int_range' && this.props.selectedCase.metaFields[j].value){
          selectedArray.push(this.props.selectedCase.metaFields[j].value[0]);
          selectedArray.push(this.props.selectedCase.metaFields[j].value[1]);
        }
      }
    }

    if(selectedArray){
      // console.log(selectedArray);
      
      var replaceString = firePlainText;
      for (var i = 0; i < selectedArray.length; i++) {
        if(selectedArray[i]){
          var selectedArrayF = selectedArray[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var regex = new RegExp(selectedArrayF, "i");
        }
        else{
          var regex = new RegExp(selectedArray[i], "i");
        }
        var replaceString = replaceString.replace(regex, '<mark class="highlight">'+selectedArray[i]+'</mark>');
        // console.log(replaceString);
      }
      var x = replaceString;
    }
    else{
      var x = firePlainText;
    }

    this.setState({
        caseName: this.props.selectedCase.name,
        extractText: this.props.selectedCase.extractText ? this.props.selectedCase.extractText.Blocks : '',
        fileName: this.props.selectedCase.fileName,
        fullText: this.props.selectedCase.extractText ? this.props.selectedCase.extractText : '',
        fireText: firePlainText,
        fireSelectedArray : selectedArray,
        HighlightNewText: ReactHtmlParser(x),
    })
  }

  componentDidUpdate(prevProps) {
    if(this.props.categories.length > 0 && prevProps.categories !== this.props.categories) {
        for(let i = 0; i < this.props.categories.length; i++) {
            let cat = this.props.categories[i];
            if(cat.id === this.props.selectedCase.catId) {
                this.setState({ selectedCategory: {
                    label: cat.name,
                    value: cat.id,
                    key: cat.id,
                  }});
            }
        }
    }
    if(prevProps.subCategories !== this.props.subCategories) {
      if(this.props.subCategories.length > 0) {
        for(let i = 0; i < this.props.subCategories.length; i++) {
          let cat = this.props.subCategories[i];
          if(cat.id === this.props.selectedCase.subCatId) {
              this.setState({ selectedSubCategory: {
                  label: cat.name,
                  value: cat.id,
                  key: cat.id,
                }});
          }
      }
     }else{
        this.setState({ selectedSubCategory: {
          label: 'none',
          value: 'null',
          key: 'null',
        }});
      }
    }
    if(this.props.metaFieldsList.length > 0 && prevProps.metaFieldsList !== this.props.metaFieldsList) {
      this.setState({
        editMetaFieldList: this.props.selectedCase.metaFields,
      })
    }
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
      if(this.props.selectedCase.personId && this.state.selectedCategory.key && this.state.selectedCategory.label && this.state.selectedSubCategory.key && this.state.selectedSubCategory.label && this.state.editMetaFieldList && this.state.caseName && this.state.fullText && this.state.fileName){
        this.props.editCase(this.props.selectedCase.id, {
          personId: this.props.selectedCase.personId,
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
        // console.log(response);
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
              // console.log(data);           // successful response
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
        // console.log(response);
        this.setState({
          fileName: '/' + response.name
        });
		  }.bind(this))
      .catch(function(error) {
        // console.log(error);
      });

      dbx.filesGetTemporaryLink({path: '/' + e.target.files[0].name})
      .then(function(response) {
        // console.log(response);
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
          // console.log(data);

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
              // console.log(data);

              var params = {
                "JobId": data.JobId, /* required */
              };
              
              var fireSetInterval = window.setInterval(function() {
                textract.getDocumentTextDetection(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else {
                    // console.log(data);
                    if(data.JobStatus == "SUCCEEDED"){
                      // console.log(data.JobStatus)
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
        // console.log(result);
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

  toggle = tab => {
    if(this.state.activeTab !== tab){
      this.setState({
        activeTab: tab
      })
    }
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

  changeFormFieldTextDataName = (text) => {
    var extractText_new = this.state.extractText;
    var searchWord = this.state.searchingWord;

    for (let i = 0; i < extractText_new.length; i++) {
      extractText_new[i]['background'] = 'inherit'
      extractText_new[i]['color'] = 'inherit'
      extractText_new[i]['padding'] = '0px'

      if(extractText_new[i].BlockType == "WORD"){
        if(this.state.editMetaFieldList.length > 0){
          for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
            if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int' || this.state.editMetaFieldList[j].type == 'int_range'){
              if(this.state.editMetaFieldList[j].value == extractText_new[i].Text){
                extractText_new[i]['background'] = 'yellow'
                extractText_new[i]['color'] = 'black'
                extractText_new[i]['padding'] = '0px 2px'
              }
            }
          }
        }
        
        if(text == extractText_new[i].Text){
          extractText_new[i]['background'] = 'yellow'
          extractText_new[i]['color'] = 'black'
          extractText_new[i]['padding'] = '0px 2px'
        }

        var re = new RegExp(searchWord, "gi");
        var word = extractText_new[i].Text;
        if(word.match(re) && searchWord.length > 0){
          if(word.match(re).length > 0){
            extractText_new[i]['background'] = '#13ff92'
            extractText_new[i]['color'] = 'black'
            extractText_new[i]['padding'] = '0px 2px'
          }
        }
      }
    }
    this.setState({
      caseName: text,
      extractText: extractText_new
    })
  }

  changeFormFieldText = (text, i) => {
    var searchWord = this.state.searchingWord;
    var extractText_new = this.state.extractText;
    
    if(this.state.editMetaFieldList[i].type == 'str'){
      this.state.editMetaFieldList[i].value = text;
    }

    if(this.state.editMetaFieldList[i].type == 'int'){
      this.state.editMetaFieldList[i].value = text.replace( /^\D+/g, '');
    }

    if(this.state.editMetaFieldList[i].type == "int_range"){
      this.state.editMetaFieldList[i].value = [text.replace( /^\D+/g, ''), text.replace( /^\D+/g, '')];
    }

    for (let i = 0; i < extractText_new.length; i++) {
      if(extractText_new[i].BlockType == "WORD"){
        extractText_new[i]['background'] = 'inherit'
        extractText_new[i]['color'] = 'inherit'
        extractText_new[i]['padding'] = '0px'

        if(this.state.editMetaFieldList.length > 0){
          for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
            if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int' || this.state.editMetaFieldList[j].type == 'int_range'){
              if(this.state.editMetaFieldList[j].value == extractText_new[i].Text){
                extractText_new[i]['background'] = 'yellow'
                extractText_new[i]['color'] = 'black'
                extractText_new[i]['padding'] = '0px 2px'
              }
            }
          }
        }

        if(this.state.caseName == extractText_new[i].Text){
          extractText_new[i]['background'] = 'yellow'
          extractText_new[i]['color'] = 'black'
          extractText_new[i]['padding'] = '0px 2px'
        }

        var re = new RegExp(searchWord, "gi");
        var word = extractText_new[i].Text;
        if(word.match(re) && searchWord.length > 0){
          if(word.match(re).length > 0){
            extractText_new[i]['background'] = '#13ff92'
            extractText_new[i]['color'] = 'black'
            extractText_new[i]['padding'] = '0px 2px'
          }
        }
      }
    }
    
    this.setState({
      editMetaFieldList: this.state.editMetaFieldList,
      extractText: extractText_new
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
    console.log(window.event);
    
    e.preventDefault()
    if(window.getSelection().toString().length > 0 && window.getSelection().toString() != ' '){
      var dropShow = true
    }
    else{
      var dropShow = false
    }

    console.log(window.getSelection().toString());
    
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
      // console.log(selectedArray);
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
        // console.log(replaceString);
        
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
    selectedArray.push(selectedText);
    if(this.state.caseName){
      selectedArray.push(this.state.caseName);
    }

    if(this.state.editMetaFieldList.length > 0){
      for (let j = 0; j < this.state.editMetaFieldList.length; j++) {
        if(i != j){
          if(this.state.editMetaFieldList[j].type == 'str' || this.state.editMetaFieldList[j].type == 'int'){
            selectedArray.push(this.state.editMetaFieldList[j].value);
          }
          if(this.state.editMetaFieldList[j].type == 'int_range' && this.state.editMetaFieldList[j].value){
            selectedArray.push(this.state.editMetaFieldList[j].value[0]);
            selectedArray.push(this.state.editMetaFieldList[j].value[1]);
          }
        }
      }
    }

    if(selectedArray){
      // console.log(selectedArray);
      
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
        // console.log(replaceString);
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
    const { selectedCategory, selectedSubCategory, error, editMetaFieldList, uploads, documents, file, numPages, isPdfFile,startDate, endDate, startNumber, endNumber, startNumberError, endNumberError } = this.state;
    return (
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static" style={{maxWidth: '1600px', width: '96%'}} onClick={(e) => this.leftClickEvenetHandler(e)}>
        <ModalHeader toggle={toggleModal}>Edit DataCollection</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={6}>
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
                  <br/>
                  {
                    (this.state.isPdfFile) ?
                      <div style={{ marginTop: '10px', color: 'red'}}>* Accept file type only: png, jpg, jpeg</div>
                    :
                      null
                  }
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
          <Row>
            <Col xs={6}>
              {
                this.state.extractText && this.state.extractText.length > 0 ?
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
                            <CardText onContextMenu={(e) => this.someEvenetHandler(e)} onClick={(e) => this.leftClickEvenetHandler(e)}>
                              {/* {
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
                              } */}
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
                                            ((fields.type == 'str' || fields.type == 'int' || fields.type == 'int_range') && fields.active && editMetaFieldList[j]) ?
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
                            (uploads.length > 0) ?
                              uploads.map((value, index) => {
                                return <img key={index} src={value} width="100%" />
                              })
                              :
                              <img src={this.state.fileNameLink} width="100%" />
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
              {
                metaFieldsList && metaFieldsList.length > 0 && editMetaFieldList && editMetaFieldList.length > 0 && 
                metaFieldsList.map((curMetaField, i)=>(
                  <>
                    {
                      curMetaField && curMetaField.active && editMetaFieldList[i] && curMetaField.name ?
                        <>
                          <br />
                          <h4>{curMetaField.name}</h4>
                        </>
                      :
                        ''
                    }
                    <Form>
                        {curMetaField && curMetaField.type === "bool" && curMetaField.active && editMetaFieldList[i] &&
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
                        { curMetaField && curMetaField.type === "box" && curMetaField.active && editMetaFieldList[i] &&
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
                        {curMetaField && curMetaField.type === "str" && curMetaField.active && editMetaFieldList[i] &&
                          <Label className="form-group has-top-label">
                            <Input value={editMetaFieldList[i].value ? editMetaFieldList[i].value : ""} onChange={(e) => (
                                editMetaFieldList[i].value = e.target.value,
                                this.setState({
                                  editMetaFieldList: editMetaFieldList,
                                }),
                                this.finalUpdate()
                              )} />
                            <span>Value</span>
                          </Label> 
                        }
                        {curMetaField && curMetaField.type === "int" && curMetaField.active && editMetaFieldList[i] &&
                          <Label className="form-group has-top-label">
                            <Input value={editMetaFieldList[i].value ? editMetaFieldList[i].value : ""} type="number" onChange={(e) => (
                                editMetaFieldList[i].value = e.target.value,
                                this.setState({
                                  editMetaFieldList: editMetaFieldList,
                                }),
                                this.finalUpdate()
                              )} />
                            <span>Value</span>
                          </Label> 
                        }
                        {curMetaField && curMetaField.type === "date" && curMetaField.active && editMetaFieldList[i] &&
                          <DatePicker
                            selected={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value) : ''}
                            onChange={(date) => ( 
                              editMetaFieldList[i].value = date,
                              this.setState({
                                editMetaFieldList: editMetaFieldList,
                              })
                            )}
                          />
                        }
                        {curMetaField && curMetaField.type === "date_range" && curMetaField.active && editMetaFieldList[i] &&
                          <div>
                            <br/>
                            <Label>Start Date</Label>
                            <DatePicker
                              selected={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value[0]) : ''}
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
                              startDate={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value[0]) : ''}
                              endDate={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value[1]) : ''}
                            />        
                            <br/>
                            <br/>
                            <Label>End Date</Label>
                            <DatePicker
                              selected={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value[1]) : ''}
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
                              startDate={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value[0]) : ''}
                              endDate={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value[1]) : ''}
                              minDate={editMetaFieldList[i].value ? moment(editMetaFieldList[i].value[0]) : ''}
                            />        
                          </div>
                        }
                        { curMetaField && curMetaField.type === "int_range" && curMetaField.active && editMetaFieldList[i] &&
                          <div>
                            <br/>
                            <Label>Start Number</Label>
                            <Input value={editMetaFieldList[i].value ? editMetaFieldList[i].value[0] : ''} 
                              onChange={(e) =>{
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
                            <Input value={editMetaFieldList[i].value ? editMetaFieldList[i].value[1] : ''} onChange={(e) =>{
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
    editCase: editCase,
  },
)(EditCaseModal);
