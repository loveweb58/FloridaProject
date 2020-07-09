import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';

import IntlMessages from '../../../../helpers/IntlMessages';
import AddSubCategoryModal from './sub-category-add-model';
import EditSubCategoryModal from './sub-category-edit-model';
import RemoveSubCategoryModal from './sub-category-remove-model';

const SubCategoryViewer = ({ modalOpen, toggleModal, category, subCategory, subError, subCategoryLoading }) => {
  const [subModal, toggleSubModal] = useState(false);
  const [subModalEdit, toggleSubModalEdit] = useState(false);
  const [selectedSubCat, changeSelectedSubCat] = useState(null);
  const [subModalRemove, toggleSubModalRemove] = useState(false);

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} wrapClassName="modal-right" backdrop="static">
      <ModalHeader toggle={toggleModal}>{category && category.name}'s Sub Category</ModalHeader>
      <ModalBody>
        {subCategoryLoading ? (
          <div className="loading" />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {subCategory &&
                subCategory.map((x, i) => {
                  return (
                    <tr key={x.id}>
                      <th scope="row">{i + 1}</th>
                      <td>{x.name}</td>
                      <td
                        onClick={() => {
                          changeSelectedSubCat(x);
                          toggleSubModalEdit(true);
                        }}
                      >
                        <div className={'glyph-icon simple-icon-pencil'} />
                      </td>
                      <td
                        onClick={() => {
                          changeSelectedSubCat(x);
                          toggleSubModalRemove(true);
                        }}
                      >
                        <div className={'glyph-icon simple-icon-trash'} />
                      </td>
                    </tr>
                  );
                })}
              {subCategory && subCategory.length === 0 && <span>NO SUB CATEGORIES FOUND</span>}
              {subError && <span>Something went wrong</span>}
            </tbody>
          </Table>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => toggleSubModal(!subModal)}>
          <IntlMessages id="pages.add-new" />
        </Button>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="pages.cancel" />
        </Button>
      </ModalFooter>

      <AddSubCategoryModal
        modalOpen={subModal}
        selectedCategory={category}
        toggleModal={() => toggleSubModal(!subModal)}
      />

      {selectedSubCat && subModalEdit && (
        <EditSubCategoryModal
          modalOpen={subModalEdit}
          selectedSubCat={selectedSubCat}
          toggleModal={() => {
            toggleSubModalEdit(!subModalEdit);
            changeSelectedSubCat(null);
          }}
        />
      )}
      {selectedSubCat && subModalRemove && (
        <RemoveSubCategoryModal
          modalOpen={subModalRemove}
          selectedSubCat={selectedSubCat}
          toggleModal={() => {
            toggleSubModalRemove(!subModalRemove);
            changeSelectedSubCat(null);
          }}
        />
      )}
    </Modal>
  );
};

export default SubCategoryViewer;
