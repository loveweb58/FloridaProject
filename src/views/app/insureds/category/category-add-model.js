import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';

const AddCategoryModal = ({ modalOpen, toggleModal, handleSubmit }) => {
  const [name, setName] = useState('');
  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.add-new-modal-title" />
      </ModalHeader>
      <ModalBody>
        <Label>Category Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        {/* <section>
          <br/>
          <label className="fileUploaderContainer">
            Click here to upload documents
            <input type="file" id="fileUploader" onChange={(e)=>handleUpload(e)} multiple />
          </label>
          <br/>
          <div>
            { uploads.map((value, index) => {
              return <img key={index} src={value} width="100px" />
            }) }
          </div>
          <br/>
          <Button color="primary" onClick={() => handleGenerate()}>
            <IntlMessages id="pages.generate" />
          </Button>
        </section>
        <br/>
        <section className="results">
          { documents.map((value, index) => {
            return (
              <div key={index} className="results__result">
                <div className="results__result__image">
                  <img src={uploads[index]} width="250px" />
                </div>
                <div className="results__result__info">
                  <div className="results__result__info__codes">
                    <small><strong>Confidence Score:</strong> {value.confidence}</small>
                  </div>
                  <div className="results__result__info__text">
                    <small><strong>Full Output:</strong> {value.text}</small>
                  </div>
                </div>
              </div>
            )
          }) }
        </section> */}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        <Button color="primary" onClick={() => handleSubmit({ name })}>
          <IntlMessages id="pages.submit" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default AddCategoryModal;
