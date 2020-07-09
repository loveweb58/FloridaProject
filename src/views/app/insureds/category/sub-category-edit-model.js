import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { editSubCategory } from '../../../../redux/category/actions';

import IntlMessages from '../../../../helpers/IntlMessages';
import { connect } from 'react-redux';

const EditSubCategoryModal = ({ modalOpen, toggleModal, selectedSubCat, editSubCategory }) => {
  const [name, setName] = useState(selectedSubCat && selectedSubCat.name);

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} size="sm" backdrop="static">
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.add-new-modal-title" />
      </ModalHeader>
      <ModalBody>
        <Label>Category Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        <Button
          color="primary"
          onClick={() => {
            editSubCategory(selectedSubCat.id, { ...selectedSubCat, name });
            toggleModal();
            setName('');
          }}
        >
          <IntlMessages id="pages.submit" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default connect(
  () => ({}),
  {
    editSubCategory: editSubCategory,
  },
)(EditSubCategoryModal);
