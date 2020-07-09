import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { removeCombinedCase } from '../../../../redux/people/actions';

import IntlMessages from '../../../../helpers/IntlMessages';
import { connect } from 'react-redux';

const RemoveCombinedCaseModal = ({ modalOpen, toggleModal, selectedCombinedCase, removeCombinedCase }) => {
  const [name, setName] = useState(selectedCombinedCase && selectedCombinedCase.name);
  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} size="sm" backdrop="static">
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.delete-modal-title" />
      </ModalHeader>
      <ModalBody>
        <Label>{name}</Label>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.no" />
        </Button>
        <Button
          color="primary"
          onClick={() => {
            removeCombinedCase(selectedCombinedCase.id)
            toggleModal();
          }}
        >
          <IntlMessages id="pages.yes" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default connect(
  () => ({}),
  {
    removeCombinedCase: removeCombinedCase,
  },
)(RemoveCombinedCaseModal);
