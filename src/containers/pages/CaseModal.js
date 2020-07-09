import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";

const CaseModal = ({modalOpen, toggleModal, initObject}) => {
  console.log(initObject);

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        {/*<IntlMessages id="pages.add-new-modal-title" />*/}
        {initObject && initObject.person.firstName}'s Cases
      </ModalHeader>
      <ModalBody>
        <Table>
          <thead>
          <tr>
            <th>#</th>
            <th>Case File</th>
            <th>Case </th>
          </tr>
          </thead>
          <tbody>
          {initObject && initObject.cases.map((x, i) => {
            return <tr key={x.id}>
              <th scope="row">{i + 1}</th>
              <td>{x.caseFileId}</td>
              <td>{x.name}</td>
            </tr>
          })}
          {initObject && initObject.cases.length === 0 && <span>NO CASES FOUND</span>}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel"/>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CaseModal;
