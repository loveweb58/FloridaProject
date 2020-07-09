import React from 'react';
import { Card, CustomInput, Badge, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../../../components/common/CustomBootstrap';

const CaseTagList = ({ product, isSelect, collect, onClick, onEdit, onDelete, onCheckItem }) => {
  return (
    <Colxx xxs="12" className="mb-3">
      <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
        <Card
          onClick={(event) => onClick(event, product)}
          className={classnames('d-flex flex-row', {
            active: isSelect,
          })}
        >
          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
            <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
              <NavLink to={`?p=${product.id}`} className="w-40 w-sm-100">
                <p className="list-item-heading mb-1 truncate">{product.name}</p>
              </NavLink>
              <div className="w-15 w-sm-100">
                <Badge color={product.statusColor} pill>
                  {product.status}
                </Badge>
              </div>
            </div>
            <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
              <Button
                color="light"
                className="mb-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <div className={'glyph-icon simple-icon-pencil'} />
              </Button>
              {/* <Button
                color="light"
                className="mb-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <div className={'glyph-icon simple-icon-trash'} />
              </Button> */}
            </div>
            <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
              <CustomInput
                // className="item-check mb-0"
                type="checkbox"
                id={`check_${product.id}`}
                checked={isSelect}
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckItem(e);}}
                label=""
              />
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(CaseTagList);
