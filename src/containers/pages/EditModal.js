import React, {useEffect, useState} from "react";
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label, FormGroup
} from "reactstrap";
import {
  FormikDatePicker,
  FormikCheckbox,
} from '../../containers/form-validations/FormikFields';

import IntlMessages from "../../helpers/IntlMessages";
import {API} from "../../util/api";
import moment from "moment";

const EditModal = ({modalOpen, toggleModal, categories, handleSubmit, initObject}) => {
  console.log(initObject);
  const [fName, setfName] = useState(initObject.firstName);
  const [lName, setLName] = useState(initObject.lastName);
  const [bDay, setBDay] = useState(moment(initObject.dateOfBirth));
  const [smoking, setSmoking] = useState(initObject.smoking);

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        {/*<IntlMessages id="pages.add-new-modal-title" />*/}
        Edit Person
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
                onClick={() => editPerson({fName, lName, bday: bDay.toString(), smoking}, initObject, handleSubmit)}>
          <IntlMessages id="pages.submit"/>
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
};

async function editPerson(data, init, cb) {
  const [err, newPerson] = await API.patch('People/' + init.id, {
    firstName: data.fName,
    lastName: data.lName,
    dateOfBirth: data.bday,
    smoking: data.smoking,
  });
  cb(newPerson);
};

export default EditModal;
