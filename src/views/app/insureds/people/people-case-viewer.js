import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Label } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import AddCaseModal from './add-case-modal';
import EditCaseModal from './edit-case-modal';

const CaseModal = ({ modalOpen, toggleModal, person, cases, caseError, caseLoading }) => {
  const [addCaseModal, toggleAddCaseModal] = useState(false);
  const [editCaseModal, toggleEditCaseModal] = useState(false);
  const [selectedCase, changeSelectedCase] = useState(null);
  const subCatNames = [];
  getSubCategoryName();
  function getSubCategoryName(subCatName){
    let subCat_Name = '';
    if(subCatNames.length > 0) {
      let filterCount = subCatNames.filter(subName => subName === subCatName).length;
      subCatNames.push(subCatName);
      subCat_Name = subCatName + "-" + (filterCount + 1);
    }else{
      subCatNames.push(subCatName);
      subCat_Name = subCatName + "-" + "1";
    }
    return subCat_Name;
  }
  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
      <ModalHeader toggle={toggleModal}>{person && person.firstName}'s DataCollection Info</ModalHeader>
      <ModalBody>
        {caseLoading &&
          <div className="loading" />
        }
        {cases && cases.map((caseItem) => {
          return (
            <div>
            <div style={{display: 'flex'}}>
              <Label>Category :  &nbsp;</Label>
              <Label>{caseItem.catName}</Label>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Data Collection Name</th>
                  <th>Subcategory</th>
                </tr>
              </thead>
              <tbody>
                {caseItem.dataList &&
                  caseItem.dataList.map((x, i) => {
                    return (
                      <tr key={x.id} onClick={() => {
                        changeSelectedCase(x);
                        toggleEditCaseModal(true);
                      }}>
                        <th scope="row">{i + 1}</th>
                        <td>{x.name}</td>
                        <td>{getSubCategoryName(x.subCatName)}</td>
                      </tr>
                    );
                  })}
                {/* {cases && cases.length === 0 && <span>NO DATACOLLECTIONS FOUND</span>}
                {caseError && <span>Something went wrong</span>} */}
              </tbody>
            </Table>
            </div>
          )})
        }
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => toggleAddCaseModal(!addCaseModal)}>
          <IntlMessages id="pages.add-new" />
        </Button>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
        {addCaseModal && (
          <AddCaseModal
            personId={person.id}
            modalOpen={addCaseModal}
            toggleModal={() => toggleAddCaseModal(!addCaseModal)}
          />
        )}
        {selectedCase && (
          <EditCaseModal
            modalOpen={editCaseModal}
            selectedCase={selectedCase}
            toggleModal={() => {
              toggleEditCaseModal(!editCaseModal);
              changeSelectedCase(null);
            }}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default CaseModal;
