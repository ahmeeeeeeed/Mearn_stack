import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import todoApp from "./todo";
import SkillsMatrix from "./SkillsMatrix";
import TrainingCalendar from "./TrainingCalendar";
import surveyApp from "./survey";
import surveyDetailApp from "./survey-detail";
import chatApp from "./chat";

const Applications = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/todo`} />
      <Route path={`${match.url}/todo`} component={todoApp} />
        <Route path={`${match.url}/TrainingCalendar`} component={TrainingCalendar} />
      <Route path={`${match.url}/SkillsMatrix`} component={SkillsMatrix} />
      <Route
        path={`${match.url}/survey/:surveyid`}
        component={surveyDetailApp}
        isExact
      />
      <Route path={`${match.url}/survey`} component={surveyApp} isExact/>
      <Route path={`${match.url}/chat`} component={chatApp} />
      <Redirect to="/error" />
    </Switch>
  </div>
);
export default Applications;
