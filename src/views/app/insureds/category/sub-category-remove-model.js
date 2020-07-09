import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { removeSubCategory } from '../../../../redux/category/actions';

import IntlMessages from '../../../../helpers/IntlMessages';
import { connect } from 'react-redux';

const RemoveSubCategoryModal = ({ modalOpen, toggleModal, selectedSubCat, removeSubCategory }) => {
  const [name, setName] = useState(selectedSubCat && selectedSubCat.name);
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
            removeSubCategory(selectedSubCat.id, selectedSubCat.categoryId);
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
    removeSubCategory: removeSubCategory,
  },
)(RemoveSubCategoryModal);
