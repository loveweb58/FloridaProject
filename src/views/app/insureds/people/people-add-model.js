import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import { FormikDatePicker, FormikCheckbox } from '../../../../containers/form-validations/FormikFields';

import IntlMessages from '../../../../helpers/IntlMessages';

const AddNewModal = ({ modalOpen, toggleModal, handleSubmit }) => {
  const [fName, setfName] = useState('');
  const [lName, setLName] = useState('');
  const [bDay, setBDay] = useState(null);
  const [smoking, setSmoking] = useState(false);

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.add-new-modal-title" />
      </ModalHeader>
      <ModalBody>
        <Label>
          First Name
        </Label>
        <Input value={fName} onChange={(e) => setfName(e.target.value)} />
        <Label>
          Last Name
        </Label>
        <Input value={lName} onChange={(e) => setLName(e.target.value)} />
        <Label className="mt-4">
          Birth Day
        </Label>
        <FormikDatePicker name="dateOfBirth" value={bDay} onChange={(x, data) => setBDay(data)} onBlur={() => {}} />

        <FormikCheckbox
          name="smoking"
          className="item-check mb-0"
          value={smoking}
          onChange={(e) => setSmoking(!smoking)}
          label="Smoking"
          onBlur={() => {}}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        <Button
          color="primary"
          onClick={() => handleSubmit({ firstName: fName, lastName: lName, dateOfbday: bDay.toString(), smoking })}
        >
          <IntlMessages id="pages.submit" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

export default AddNewModal;
