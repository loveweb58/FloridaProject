import React, {useState} from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import {
  FormikDatePicker,
  FormikCheckbox,
} from '../../containers/form-validations/FormikFields';

import IntlMessages from "../../helpers/IntlMessages";
import {API} from "../../util/api";

const AddNewModal = ({modalOpen, toggleModal, handleSubmit}) => {

  const [fName, setfName] = useState('');
  const [lName, setLName] = useState('');
  const [bDay, setBDay] = useState(null);
  const [smoking, setSmoking] = useState(false);

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="pages.add-new-modal-title"/>
      </ModalHeader>
      <ModalBody>
        <Label>
          {/*<IntlMessages id="pages.product-name" />*/}
          First Name
        </Label>
        <Input value={fName} onChange={e => setfName(e.target.value)}/>
        <Label>
          {/*<IntlMessages id="pages.product-name" />*/}
          Last Name
        </Label>
        <Input value={lName} onChange={e => setLName(e.target.value)}/>

        <Label className="mt-4">
          {/*<IntlMessages id="pages.category" />*/}
          Birth Day
        </Label>
        <FormikDatePicker
          name="dateOfBirth"
          value={bDay}
          onChange={(x, data) => setBDay(data)}
          onBlur={() => {
          }}
        />

        <FormikCheckbox name="smoking" value={smoking} onChange={(n, x) => setSmoking(x)} label="Smoking"
                        onBlur={() => {
                        }}/>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel"/>
        </Button>
        <Button color="primary"
                onClick={() => createNewPerson({fName, lName, bday: bDay.toString(), smoking}, handleSubmit)}>
          <IntlMessages id="pages.submit"/>
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
};

async function createNewPerson(data, cb) {
  const [err, newPerson] = await API.post('People', {
    firstName: data.fName,
    lastName: data.lName,
    dateOfBirth: data.bday,
    smoking: data.smoking,
  });
  console.log(newPerson);
  cb(newPerson);
};

export default AddNewModal;
