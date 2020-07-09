import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';

const EditCategoryModal = ({ modalOpen, toggleModal, handleSubmit, selectedCategory }) => {
  const [name, setName] = useState(selectedCategory.name);

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.add-new-modal-title" />
      </ModalHeader>
      <ModalBody>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
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

export default EditCategoryModal;
