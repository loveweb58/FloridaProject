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
  Table,
  CustomInput,
} from 'reactstrap';
import { getMetaFields } from '../../../../redux/meta-fields/actions';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';

import IntlMessages from '../../../../helpers/IntlMessages';
import { connect } from 'react-redux';
import { getCategory, getCategorySubCategory } from '../../../../redux/category/actions';
import Select from 'react-select';
import CustomSelectInput from '../../../../components/common/CustomSelectInput';
import { getPeopleCases, editCombinedCase } from '../../../../redux/people/actions';
import Tesseract  from 'tesseract.js';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pdf from "react-to-pdf";
import jsPDF from 'jspdf'
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "./document-pdf";
import { servicePath } from '../../../../constants/defaultValues';

const API_ROOT = servicePath; // root of the api url

var validator = require('validator');

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

const ref = React.createRef();
const pdfOptions = {
  getTextColor: 'black'
};

class ShowCombinedCaseModal extends React.Component {
  state = {
    error: null,
    combined_case_name: '',
    combined_case_description: '',
    data_collections: [],
    show_case_modal: true,
    nestedModal: false,
    show: false,
    selectedTags: [],
    data_collections_new: [],
    checkedCaseTag: [],
    selectedCaseTagArray: [],
    setChecked: false,
    caseTagName: '',
    getCaseTags: [],
    getMetaFields:[],
    selectedMetaFields: [],
    fireSelectedArray:[],
  };

  componentDidMount() {
    
    fetch(API_ROOT+"/MetaData")
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        this.setState({
          getCaseTags: result,
        })
      },
      (error) => {
      }
    )
    
    fetch(API_ROOT+"/MetaFields")
    .then(res => res.json())
    .then(
      (result) => {
        var getSubCatIds = [];
        for (let i = 0; i < this.props.selectedCombinedCase.data_collections.length; i++) {
          if(this.props.selectedCombinedCase.data_collections[i].isSelect){
            getSubCatIds.push(this.props.selectedCombinedCase.data_collections[i].subCatId);
          }
        }
        var resultNew = [];
        for (let j = 0; j < result.length; j++) {
          if(getSubCatIds.includes(result[j].subCategoryId)){
            resultNew.push(result[j]);
          }
        }
        this.setState({
          getMetaFields: resultNew,
        })
        console.log(resultNew);
      },
      (error) => {
      }
    )

    this.setState({
      person_name: this.props.personName,
      combined_case_name: this.props.selectedCombinedCase.name,
      combined_case_description: this.props.selectedCombinedCase.description,
      data_collections: this.props.selectedCombinedCase.data_collections,
    })
  }

  componentDidUpdate(prevProps) {
  }


  handleCancel = () => {
    this.props.toggleModal();
  }

  handleExport = () => {
  }

  handleExportToPdf = () => {
    let doc = new jsPDF('p', 'pt');
    doc.fromHTML(document.getElementById('divToPrint'));
    doc.save(this.state.person_name+"-Combined-Case.pdf");
  }
 
  toggleNested = () => {
    var all_collections = this.state.data_collections;
    var new_collections = [];
    for (let i = 0; i < all_collections.length; i++) {
      if(all_collections[i].isSelect){
        new_collections.push(all_collections[i]);
      }
    }

    this.setState({
      nestedModal : !this.state.nestedModal,
      data_collections_new : new_collections,
      selectedTags: [],
    });
  }

  toggleNestedExport = () => {
    if(this.state.selectedCaseTagArray && this.state.selectedCaseTagArray.length > 0){
      this.setState({
        show : true,
      });
    }
  }

  handleSelectTag = (tag) => {
    this.setState({
      selectedTags: [],
      show : false,
      selectedCaseTagArray: [],
      setChecked: false,
      caseTagName: ''
    });

    var allMetaFields = this.state.getMetaFields;
    var selectedMetaFieldsArray = [];
    
    for (let i = 0; i < allMetaFields.length; i++) {
      if(allMetaFields[i].caseTags && allMetaFields[i].caseTags.length > 0){
        var allCaseTags = allMetaFields[i].caseTags;
        for (let j = 0; j < allCaseTags.length; j++) {
          if(allCaseTags[j].id == tag.value){
            selectedMetaFieldsArray.push({'id':allMetaFields[i].id, 'name': allMetaFields[i].name, 'checkbox':false})
          }
        }
      }
    }

    // var allTags = this.state.data_collections_new[tag.key].metaFields;
    // var newTags = [];

    // for (let i = 0; i < allTags.length; i++) {
    //   if(allTags[i].isChecked){
    //     allTags[i].checkbox = false;allTags[i].checkbox = false;
    //     newTags.push(allTags[i]);
    //   }
    // }

    this.setState({
    //   selectedTags: newTags,
    //   setChecked: false,
    //   caseTagName: this.state.data_collections_new[tag.key].name
      selectedMetaFields: selectedMetaFieldsArray,
    });

    console.log(selectedMetaFieldsArray);
  };

  selectedCaseCheckbox = (e, v, i) => {
    this.setState({
      show : false,
    });

    var data_collections_list = this.state.data_collections;
    var fireSelectedArray = [];

    

    // if(data_collections_list && data_collections_list.length > 0){
    //   for (let i = 0; i < data_collections_list.length; i++) {
    //     if(data_collections_list[i].isSelect){
    //       var meta_fields_list = data_collections_list[i].metaFields;
    //       for (let j = 0; j < meta_fields_list.length; j++) {
    //         if(meta_fields_list[j].isChecked){
    //           if(meta_fields_list[j].id == v.id){
    //             fireSelectedArray.push(meta_fields_list[j])
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    
    if(e.target.checked){
      v.checkbox = true;
      this.setState({selectedCaseTagArray: this.state.selectedCaseTagArray.concat(v.name)})
    }
    else{
      var array = [...this.state.selectedCaseTagArray]; // make a separate copy of the array
      var index = array.indexOf(v.name);
      if (index !== -1) {
        v.checkbox = false;
        array.splice(index, 1);
        this.setState({selectedCaseTagArray: array});
      }
    }

    console.log(this.state.selectedCaseTagArray);
  }

  render() {
    const { modalOpen, toggleModal } = this.props;
    const { data_collections, show_case_modal } = this.state;
    return (
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
        {/* <div ref={ref}> */}
        <div id="divToPrint">
          <ModalHeader toggle={toggleModal}>{this.state.person_name}'s Combined Case</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs={12}>
                  <h4>{this.state.combined_case_name}</h4>
                  <br/>
                  <h4>{this.state.combined_case_description}</h4>
                  <br/>
                  {data_collections && data_collections.map((caseItem, i) => {
                    if(caseItem.isSelect) {
                      return (
                        <>
                        <h4 key={i}>{caseItem.name}</h4>
                            {caseItem.metaFields && caseItem.metaFields.map((metaItem, j) => {
                              if(metaItem.isChecked) {
                                return (
                                  <Table>
                                  <tbody>
                                  <tr key={metaItem.id} onClick={() => {
    
                                  }}>
                                    <td style={{width: '50%'}}>{metaItem.name}</td>
                                    
                                    <td style={{width: '50%'}}>{metaItem.type === 'int' ? metaItem.value 
                                        : metaItem.type === 'str' ? metaItem.value 
                                        : metaItem.type === 'bool' ? metaItem.value ? 'True' : 'False'
                                        : metaItem.type === 'box' ? metaItem.value ? metaItem.value['label']+' - '+metaItem.value['value'] : 'NaN'
                                        : metaItem.type === 'date' ? metaItem.value ? moment(metaItem.value).format('DD-MM-YYYY') : ''
                                        : metaItem.type === 'date_range' ? metaItem.value ? moment(metaItem.value[0]).format('DD-MM-YYYY') + ' ~ ' +  moment(metaItem.value[1]).format('DD-MM-YYYY'): ''
                                        : metaItem.type === 'int_range' ? metaItem.value ? metaItem.value[0] + ' ~ ' +  metaItem.value[1] : '' : ''}</td>
                                  </tr>
                                  </tbody> 
                                 </Table>
                                );
                              }
                            })}
                        </>
                      );
                    }
                  })}
              </Col>
            </Row>
          </ModalBody>
        </div>
        <ModalFooter>

          <Button color="secondary" onClick={() => this.toggleNested()}>Export Data</Button>

          <Modal isOpen={this.state.nestedModal} toggle={() => this.toggleNested()} size="lg">
            <ModalHeader>Export Data of {this.state.person_name}'s Combined Case</ModalHeader>
            <ModalBody>

            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select"
              classNamePrefix="react-select"
              name="form-field-type"
              onChange={(e) => this.handleSelectTag(e)}
              options={this.state.getCaseTags && this.state.getCaseTags.map((box, i) => ({
                label: box.name,
                value: box.id,
                key: i,
              }))}
            />

            <br/>

            {
              this.state.selectedMetaFields && this.state.selectedMetaFields.map((v, i) => (
                <CustomInput
                  type="checkbox"
                  id={`case_tag_${v.id}`}
                  label={v.name}
                  checked={v.checkbox}
                  onChange={(e) => this.selectedCaseCheckbox(e, v, i)}
                />
              ))
            }

            </ModalBody>
            <ModalFooter>
            {
              this.state.show && 
              <PDFDownloadLink
                document={<PdfDocument data={this.state.selectedCaseTagArray} personName={this.state.person_name} caseTagName={this.state.caseTagName} data_collections={data_collections}/>}
                fileName={this.state.person_name+"'s-Combined-Case.pdf"}
                className="btn btn-secondary"
              >
              {({ blob, url, loading, error }) =>
                loading ? "Generating PDF..." : 'Download PDF'
              }
              </PDFDownloadLink>
            }
            {
              !this.state.show &&
              <Button color="secondary" onClick={() => this.toggleNestedExport()}>Generate PDF</Button>
            }
              <Button color="secondary" outline onClick={() => this.toggleNested()}>
                <IntlMessages id= "pages.cancel" />
              </Button>
            </ModalFooter>
          </Modal>
          
          <Button color="secondary" outline onClick={this.handleCancel}>
            <IntlMessages id= "pages.cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(
  ({ people }) => ({
    cases: people.cases,
  }),
  {
    getPeopleCases: getPeopleCases,
    editCombinedCase: editCombinedCase,
  },
)(ShowCombinedCaseModal);
