import React from "react";
import { Card, CardBody, Badge, CustomInput } from "reactstrap";
import { NavLink ,Link } from "react-router-dom";

import { Colxx } from "../common/CustomBootstrap";

const SurveyListItem = ({ item, handleCheckChange, isSelected }) => {
  //item = JSON.parse(localStorage.getItem("dept"));

  
  return !item?<div className="loading" />:( 

    
    <Colxx xxs="12">
     
   
    
      <Card className="card d-flex flex-row mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <NavLink
              to={{ pathname: `/app/applications/survey/${item._id}` , /*dept:item */ }}

              className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
            
            >
              <i
                className={`${
                  item.status === "COMPLETED"
                    ? "simple-icon-refresh heading-icon"
                    : "simple-icon-check heading-icon"
                }`}
              />
              <span className="align-middle d-inline-block">{item.name}</span>
            </NavLink>
            <p className="mb-1 text-muted text-small w-15 w-xs-100" style={{marginLeft: "-230px" }} >
             code : {item.code}
            </p>
            {/* <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.code}
            </p> */}
            {item.managers[0] &&
            <div className="w-15 w-xs-100"  >
              <Badge color={item.labelColor} pill>
               TM : {item.managers[0].firstname+" "+item.managers[0].lastname}
              {/*  {console.log("item.managers[0] + "+item.managers[0].length)} */}
              </Badge>
            </div>
          }
          </CardBody>
          <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
            <CustomInput
              className="itemCheck mb-0"
              type="checkbox"
              id={`check_${item._id}`}
              checked={isSelected}
              onChange={event => handleCheckChange(event, item)}
              label=""
            />
          </div>
        </div>
      </Card>
    </Colxx>
  )
};

export default React.memo(SurveyListItem);
