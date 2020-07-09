import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';

const EditCaseTagModal = ({ modalOpen, toggleModal, handleSubmit, selectedCaseTag }) => {

  const [name, setName] = useState(selectedCaseTag.name);

  const [unmountOnClose, setUnmountOnClose] = useState(true);
  
  const changeBackdrop = e => {
    let value = e.target.value;
    setName(value);
  }

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" unmountOnClose={false}>
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.case-tag-edit-model" />
      </ModalHeader>
      <ModalBody>
        <Label>Case Tag Name</Label>
        <Input value={name} onChange={changeBackdrop} />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        <Button color="primary" onClick={() => handleSubmit({ name })} >
          <IntlMessages id="pages.submit" />
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditCaseTagModal;
