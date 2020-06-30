import React from "react";
import {Card, CustomInput, Badge, CardBody} from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../components/common/CustomBootstrap";

const ListItemSkills = ({ product, isSelect, collect, onCheckItem }) => {
  return (
      <Colxx xxs="12" key={product._id} >
        <ContextMenuTrigger id="menu_id" data={product._id} collect={collect} >
          <Card className="card d-flex mb-3">
            <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody
              onClick={event => onCheckItem(event, product._id)}
              className={classnames("align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center", {
                active: isSelect
              })}
          >



                <NavLink to={`?p=${product._id}`} className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1">
                  <i
                      className=
                          "simple-icon-check heading-icon"

                  />
                  <span className="align-middle d-inline-block">{product.title}</span>
                </NavLink>
                <p className="mb-1 text-muted text-small w-15 w-xs-100">
                  {product.specialities}
                </p>
                <p className="mb-1 text-muted text-small w-15 w-xs-100">
                  {product.createDate}
                </p>
                <div className="w-15 w-xs-100">
                  <Badge color={product.statusColor} pill>
                    {product.type}
                  </Badge>
                </div>
          </CardBody>
              <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                <CustomInput
                    className="item-check mb-0"
                    type="checkbox"
                    id={`check_${product._id}`}
                    checked={isSelect}
                    onChange={()=>{}}
                    label=""
                />
              </div>
            </div>
            <div className="card-body pt-1">
              <p className="mb-0">{product.description}</p>
            </div>
          </Card>
        </ContextMenuTrigger>
      </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ListItemSkills);
