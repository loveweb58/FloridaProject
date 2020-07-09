import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';

const AddCaseTagModal = ({ modalOpen, toggleModal, handleSubmit }) => {
  const [name, setName] = useState('');
  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.case-tag-add-model" />
      </ModalHeader>
      <ModalBody>
        <Label>Case Tag Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        <Button color="primary" onClick={() => handleSubmit({ name })} >
          <IntlMessages id="pages.submit" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default AddCaseTagModal;
