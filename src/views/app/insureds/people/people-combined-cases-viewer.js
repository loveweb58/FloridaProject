import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Label } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import AddCombinedCaseModal from './add-combined-case-modal';
import EditCombinedCaseModal from './edit-combined-case-modal';
import RemoveCombinedCaseModal from './remove-combined-case-modal';
import ShowCombinedCaseModal from './show-combined-case-modal';

const CombinedCasesModal = ({ modalOpen, toggleModal, person, combinedCases, caseError, caseLoading }) => {
  const [addCombinedCaseModal, toggleAddCombinedCaseModal] = useState(false);
  const [editCombinedCaseModal, toggleEditCombinedCaseModal] = useState(false);
  const [showCombinedCaseModal, toggleShowCombinedCaseModal] = useState(false);
  const [selectedCombinedCase, changeSelectedCombinedCase] = useState(null);
  const [removeCombinedCaseModal, toggleRemoveCombinedCaseModal] = useState(false);

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
      <ModalHeader toggle={toggleModal}>{person && person.firstName.trim()}'s Combined Cass</ModalHeader>
      <ModalBody>
        {caseLoading &&
          <div className="loading" />
        }
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {combinedCases && combinedCases.map((caseItem, i) => {
              return (
                <tr key={caseItem.id} onClick={() => {
                  // changeSelectedCombinedCase(caseItem);
                  // toggleEditCombinedCaseModal(true);
                }}> 
                  <th scope="row">{i + 1}</th>
                  <td>{caseItem.name}</td>
                  <td
                    onClick={() => {
                      changeSelectedCombinedCase(caseItem);
                      toggleEditCombinedCaseModal(!editCombinedCaseModal)
                    }}
                  >
                    <div className={'glyph-icon simple-icon-pencil'} />
                  </td>
                  <td
                    onClick={() => {
                      changeSelectedCombinedCase(caseItem);
                      toggleShowCombinedCaseModal(!showCombinedCaseModal)
                    }}
                  >
                    <div className={'glyph-icon simple-icon-eye'} />
                  </td>
                  <td
                    onClick={() => {
                      changeSelectedCombinedCase(caseItem);
                      toggleRemoveCombinedCaseModal(true);
                    }}
                  >
                    <div className={'glyph-icon simple-icon-trash'} />
                  </td>
                </tr>
              );
            })}
            {combinedCases && combinedCases.length === 0 && <span>NO COMBINED CASES FOUND</span>}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => toggleAddCombinedCaseModal(!addCombinedCaseModal)}>
          <IntlMessages id="pages.add-new" />
        </Button>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        {addCombinedCaseModal && (
          <AddCombinedCaseModal
            personId={person.id}
            modalOpen={addCombinedCaseModal}
            toggleModal={() => toggleAddCombinedCaseModal(!addCombinedCaseModal)}
          />
        )}
        {selectedCombinedCase && editCombinedCaseModal && (
          <EditCombinedCaseModal
            modalOpen={editCombinedCaseModal}
            selectedCombinedCase={selectedCombinedCase}
            toggleModal={() => {
              toggleEditCombinedCaseModal(!editCombinedCaseModal);
              changeSelectedCombinedCase(null);
            }}
          />
        )}
        {selectedCombinedCase && showCombinedCaseModal && (
          <ShowCombinedCaseModal
            modalOpen={showCombinedCaseModal}
            selectedCombinedCase={selectedCombinedCase}
            personName={person && person.firstName.trim()}
            toggleModal={() => {
              toggleShowCombinedCaseModal(!showCombinedCaseModal);
              changeSelectedCombinedCase(null);
            }}
          />
        )}
        {selectedCombinedCase && removeCombinedCaseModal && (
          <RemoveCombinedCaseModal
            modalOpen={removeCombinedCaseModal}
            selectedCombinedCase={selectedCombinedCase}
            toggleModal={() => {
              toggleRemoveCombinedCaseModal(!removeCombinedCaseModal);
              changeSelectedCombinedCase(null);
            }}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default CombinedCasesModal;
