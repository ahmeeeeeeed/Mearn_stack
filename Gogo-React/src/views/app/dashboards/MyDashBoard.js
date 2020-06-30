import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {Card, CardBody, CardSubtitle, CardTitle, Row ,Alert,Button, Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,Input,
  Label} from "reactstrap";

import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import BestSellers from "../../../containers/dashboards/BestSellers";
import GradientWithRadialProgressCard from "../../../components/cards/GradientWithRadialProgressCard";
import WebsiteVisitsChartCard from "../../../containers/dashboards/WebsiteVisitsChartCard";
import NewComments from "../../../containers/dashboards/NewComments";
import ProductCategoriesDoughnut from "../../../containers/dashboards/ProductCategoriesDoughnut";
import TeachersDashBoard from "../../../containers/dashboards/TeachersDashBoard";
import IntlMessages from "../../../helpers/IntlMessages";
import {BarChart} from "../../../components/charts";
import {barChartData} from "../../../data/charts";
import axios from "axios";
import RadialProgressCard from "../../../components/cards/RadialProgressCard";
import Sortable from "react-sortablejs";
import RadialProgressTrainingCard from "../../../components/cards/RadialProgressTrainingCard";
import SkillsDashBoard from "../../../containers/dashboards/SkillsDashBoard";

import { NotificationManager } from "../../../components/common/react-notifications";

const apiUrlTeachers="/teachers";
const apiUrlTraining="/training";
class ContentDashboard extends Component {
    constructor(props) {
        super();
        this.state={
            events:[],
            teachers:[],
            modal: false,
            pass : "",
            pass2 : ""
        }
    }
    componentDidMount() {
        this.dataListRenderTeachers();
        this.dataListRenderTrainings();

  
    }

    dataListRenderTeachers(){
        axios
            .get(
                `${apiUrlTeachers}?pageSize=${""}&currentPage=${""}&orderBy=${
                   ""
                }&search=${""}`
            )
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .then(data => {
                this.setState({
                    teachers:data.data
                });
            });
    }
    dataListRenderTrainings(){
        axios
            .get(
                `${apiUrlTraining}`
            )
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .then(data => {
                this.setState({
                    events:data.data
                });
            });
    }

    changepw = ()=>{
      let user = JSON.parse( localStorage.getItem('connectedUser'))
     
        axios.put(`/managers/changePasswd/${user.id}/${this.state.pass}`)
        .then(res=>{
          console.log(res.data)
          this.toggle()
          
          NotificationManager.success(
            "Password changed successfuly",
            "Success",
            3000,
            null,
            null,
            "filled"
          );
        })
        .catch(err => console.log("err at /managers/changePasswd/ : " + err)) 
     
      
       
    }
    toggle = () => {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    } 

  render() {
    const { messages } = this.props.intl;
    const {teachers,events}=this.state;
    return (
      <Fragment>


        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            {/* <IntlMessages id="modal.modal-title" /> */} Change your password
                    </ModalHeader>
          <ModalBody>

            <Label className="mt-4">
              {/* <IntlMessages id="survey.title" /> */} Type password :
          </Label>

            <input type="password" name="pwd" id="input-pwd" className="form-control validate" required
              defaultValue={this.state.pass}
              onChange={event => {
                this.setState({ pass: event.target.value });
              }}
            />

            <Label className="mt-4">
              {/* <IntlMessages id="survey.title" /> */} Retype password :
          </Label>

            <input type="password" name="pwd" id="input-pwd" className="form-control validate" required
              defaultValue={this.state.pass2}
              onChange={event => {
                this.setState({ pass2: event.target.value });
              }}
            />
                      
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.changepw} disabled={this.state.pass != this.state.pass2 ||
                                                                              this.state.pass==""|| this.state.pass2=="" } >
                       change
                      </Button>{" "}
                      <Button color="secondary" onClick={this.toggle}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
              
        <Row>
          <Colxx xxs="10">
      

            <Row>
              <Colxx xxs="6">
                <Alert color="danger" className="rounded">
                 <center> {/* <IntlMessages id="alert.secondary-text" /> */}You can change your random password here :</center>
                </Alert>

              </Colxx>
              <Colxx xxs="6">
                <Button color="primary" className="mb-2" onClick={this.toggle} ><i className="simple-icon-key"></i>
                  {/* <IntlMessages id="button.primary" /> */} change password
                </Button>
              </Colxx>
            </Row>
            
    
          
            <Breadcrumb heading="menu.MyDashBoard" match={this.props.match} />
           
            <Separator className="mb-5" />
          </Colxx>
      
        </Row>
        <Row>
          <Colxx lg="4" md="6" className="mb-4">
            <GradientWithRadialProgressCard
                icon="simple-icon-people"
                title={` ${messages["dashboards.teachers"]}`}
                detail={messages["dashboards.pending-for-training"]}
                percent={(100)}
                progressText={teachers.length}
            />
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4">
            <GradientWithRadialProgressCard
                icon="iconsminds-male"
                title={` ${messages["dashboards.students"]}`}
                detail={messages["dashboards.on-approval-process"]}
                percent={(100)}
                progressText="8200"
            />
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4">
            <GradientWithRadialProgressCard
                icon="iconsminds-time-backup"
                title={` ${messages["dashboards.training"]}`}
                detail={messages["dashboards.waiting-for-notice"]}
                percent={(100)}
                progressText={events.length}
            />
          </Colxx>
        </Row>
        <Row>

          <Colxx sm="12" md="6" className="mb-4">
              <Sortable options={{handle: ".handle"}} className="row">
                  <Colxx xl="6" lg="6" className="mb-4">
                      <RadialProgressTrainingCard
                          title={messages["dashboards.training-progress"]}
                          percent={0}
                          isSortable={true}

                      />
                  </Colxx>
                  <Colxx xl="6" lg="6" className="mb-4">
                      <RadialProgressCard
                          title={messages["dashboards.work-progress"]}
                          percent={75}
                          isSortable={true}

                      />
                  </Colxx>

              </Sortable>
            <WebsiteVisitsChartCard />
          </Colxx>
          <Colxx lg="12" xl="6" className="mb-4">
            <BestSellers title="dashboards.recent-skills" />
          </Colxx>
        </Row>

        <Row>
          <Colxx sm="8" md="6" className="mb-4">
            <NewComments/>
          </Colxx>

            <Colxx sm="8" md="6" className="mb-4">
              <Card>
                <CardBody>





                      <CardSubtitle>
                        <IntlMessages id="charts.training.specialties" />
                      </CardSubtitle>
                      <div className="chart-container">
                        <BarChart data={barChartData} />
                      </div>


                </CardBody>
              </Card>
            </Colxx>



        </Row>

        <Row>
          <Colxx lg="4" md="12" className="mb-4">
            <ProductCategoriesDoughnut chartClass="dashboard-donut-chart" />
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4">
            <SkillsDashBoard />
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4">
            <TeachersDashBoard />
          </Colxx>
        </Row>


      </Fragment>
    );
  }
}
export default injectIntl(ContentDashboard);
