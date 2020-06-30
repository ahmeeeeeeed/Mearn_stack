import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import dataListPages from './data-list';
import thumbListPages from './thumb-list';
import imageListPages from './image-list';
import detailsPages from './details';
import searchPages from './search';
import mailingPages from './mailing';
import invoicePages from './invoice';
import skills from './Skills';
import Departements from './survey';
import teachers from './Teachers';
const Pages = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Route path={`${match.url}/Skills`} component={skills} />
            <Route path={`${match.url}/Teachers`} component={teachers} /> 
            <Route path={`${match.url}/Departements`} component={Departements} />
            <Redirect exact from={`${match.url}/`} to={`${match.url}/data-list`} />
            <Route path={`${match.url}/data-list`} component={dataListPages} />
            <Route path={`${match.url}/thumb-list`} component={thumbListPages} />
            <Route path={`${match.url}/image-list`} component={imageListPages} />
            <Route path={`${match.url}/details`} component={detailsPages} />
            <Route path={`${match.url}/search`} component={searchPages} />
            <Route path={`${match.url}/mailing`} component={mailingPages} />
            <Route path={`${match.url}/invoice`} component={invoicePages} />
            <Redirect to="/error" />

        </Switch>
    </div>
);
export default Pages;
