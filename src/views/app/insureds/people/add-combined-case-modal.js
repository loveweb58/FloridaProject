import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Input,
  Table,
  Label,
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
import { getPeopleCases, addCombinedCase } from '../../../../redux/people/actions';
import Tesseract  from 'tesseract.js';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
var validator = require('validator');

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

class AddCombinedCaseModal extends React.Component {
  state = {
    error: null,
    combined_case_name: '',
    combined_case_description: '',
    data_collections: [],
    show_case_modal: true,
  };

  componentWillMount() {
  }
  componentDidMount() {
    const { cases } = this.props;
    if(cases.length > 0) {
      var data_collections = [];
      cases.map((caseItem) => {
        caseItem.metaFields.map((metaItem, index) => {
          var meta_item = {...metaItem, isChecked: false};
          caseItem.metaFields[index] = meta_item;
        })
         var collection_item = {...caseItem, isSelect: false};
         data_collections.push(collection_item);
      })
      this.setState({data_collections});
    }
  }

  handleSubmit = () => {
    if(this.props.personId && this.state.combined_case_name && this.state.combined_case_description){
      if(this.state.show_case_modal) {
        this.setState({show_case_modal: false});
      }else{
        this.setState({ error: null });
        this.props.addCombinedCase({
          personId:  this.props.personId,
          name: this.state.combined_case_name,
          description: this.state.combined_case_description,
          data_collections: this.state.data_collections
        });
        this.props.toggleModal();
      }
    }
  };

  handleCancel = () => {
    if(this.state.show_case_modal) {
      this.props.toggleModal();
    }else{
      this.setState({show_case_modal: true});
    }
  }

  componentDidUpdate(prevProps) {
  }


  render() {
    const { modalOpen, toggleModal } = this.props;
    const { data_collections, show_case_modal } = this.state;
    return (
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" backdrop="static">
        <ModalHeader toggle={toggleModal}>Add New CombinedCase</ModalHeader>
        {show_case_modal ?
            <ModalBody>
              <Row>
                <Col xs={6}>
                  <h4>Combined Case Name</h4>
                  <br />
                  <Input value={this.state.combined_case_name} onChange={(e) => (
                      this.setState({
                        combined_case_name: e.target.value,
                      })
                    )} />
                  <br />
                  <h4>Combined Case Description</h4>
                  <br />
                    <Input value={this.state.combined_case_description} onChange={(e) => (
                        this.setState({
                          combined_case_description: e.target.value,
                        })
                      )} />
                </Col>
                <Col xs={6}>
                    <>
                    <h4>Data Collection List</h4>
                    {
                    <Table>
                        <tbody>
                          {data_collections && data_collections.map((caseItem, i) => {
                            return (
                              <tr key={caseItem.id} onClick={() => {
    
                              }}>
                                <td style={{width: '20px'}}>
                                  <CustomInput
                                    type="checkbox"
                                    id={`check_${caseItem.id}`}
                                    checked={caseItem.isSelect}
                                    onClick={(e) => {
                                      caseItem.isSelect = !caseItem.isSelect;
                                      data_collections[i] = caseItem;
                                      this.setState({data_collections});
                                    }}
                                    label=""
                                  />
                                </td>
                                <td>{caseItem.name}</td>
                              </tr>  
                            );
                          })}
                        </tbody>
                      </Table>
                    }
                    </>
                </Col>
              </Row>
            </ModalBody>
          :
            <ModalBody>
              <Row>
                <Col xs={12}>
                    {data_collections && data_collections.map((caseItem, i) => {
                      if(caseItem.isSelect) {
                        return (
                          <>
                          <h4>{caseItem.name}</h4>
                          <Table>
                            <tbody>
                              {caseItem.metaFields && caseItem.metaFields.map((metaItem, j) => {
                                return (
                                  <tr key={metaItem.id} onClick={() => {
    
                                  }}>
                                    <td style={{width: '20px'}}>
                                      <CustomInput
                                        type="checkbox"
                                        id={`check_${metaItem.id}`}
                                        checked={metaItem.isChecked}
                                        onClick={(e) => {
                                          metaItem.isChecked = !metaItem.isChecked;
                                          caseItem.metaFields[j] = metaItem;
                                          data_collections[i] = caseItem;
                                          this.setState({data_collections});
                                        }}
                                        label=""
                                      />
                                    </td>
                                    <td>{metaItem.name}</td>
                                  </tr>  
                                );
                              })}
                            </tbody>
                          </Table>
                          </>
                        );
                      }
                    })}
                </Col>
              </Row>
            </ModalBody>
        }
        <ModalFooter>
          <Button color="secondary" outline onClick={this.handleCancel}>
            {show_case_modal ?
              <IntlMessages id= "pages.cancel" />
              :
              <IntlMessages id= "pages.back" />
            }
          </Button>
          <Button color="secondary" onClick={this.handleSubmit}>
            {show_case_modal ?
              <IntlMessages id= "pages.next" />
              :
              <IntlMessages id= "pages.submit" />
            }
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
    addCombinedCase: addCombinedCase,
  },
)(AddCombinedCaseModal);
