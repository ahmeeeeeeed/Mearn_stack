import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import axios from "axios";

import GoogleLogin from 'react-google-login';

/* "react-popper": "^2.2.3", */
// use 1.3.3

import { loginUser } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "demo@gogo.com",
      password: "gogo123",

      gmail: "",
      firstname: "",
      lastname: "",
      imageUrl: "",
      gmailPassword: ""


    };
  }


  onUserLogin() {
    if (this.state.email !== "" && this.state.password !== "") {
      this.props.loginUser(this.state, this.props.history);
    }
  }

  buildPassword = () => {
    let a = "",
      b = "abcdefghijklmnopqrstuvwxyz1234567890",
      c = 8
    for (let ma = 0; ma < c; ma++) {
      a += b[Math.floor(Math.random() * b.length)];
    }
    this.setState({
      gmailPassword: a
    });
  }

  responseGoogle(response) {

    axios.get('/managers/getteacher/5ee7ca8807aaae3758bf2525')
    .then(res=>{
       this.setState({teacher : res.data})
       localStorage.setItem("teacher",JSON.stringify(res.data))
    })
    .catch(err => console.log("err at /managers/getteacher/ : " + err))
    console.log(response);


    this.buildPassword();

    this.setState({
      gmail: response.profileObj.email,
      firstname: response.profileObj.givenName,
      lastname: response.profileObj.familyName,
      imageUrl: response.profileObj.imageUrl,


    }, () => {
      axios.post('/managers/addmanager', this.state)
        .then(res => {
          const str = res.data
          if (str == "he is a teacher !!"){
            console.log(str)
          }
            
          else {

            console.log(str)
            this.props.loginUser(this.state, this.props.history);
            let item = {


              gmail: this.state.gmail,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              imageUrl: this.state.imageUrl,
              id: str.substring(15)


            };
            localStorage.setItem('connectedUser', JSON.stringify(item))


          }
        })
        .catch(err => console.log("err : " + err))
    })



  }

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
              <p className="white mb-0">
                Please use your credentials to login.
                <br />
                If you are not a member, please{" "}
                <NavLink to={`/register`} className="white">
                  register
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.login-title" />
              </CardTitle>
              <Form>
                <Label className="form-group has-float-label mb-4">
                  <Input type="email" defaultValue={this.state.email} />
                  <IntlMessages id="user.email" />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input type="password" />
                  <IntlMessages
                    id="user.password"
                    defaultValue={this.state.password}
                  />
                </Label>
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to={`/forgot-password`}>
                    <IntlMessages id="user.forgot-password" />
                  </NavLink>

                  <Button
                    color="primary"
                    className="btn-shadow"
                    size="lg"
                    onClick={() => this.onUserLogin()}
                  >
                    <IntlMessages id="user.login-button" />
                  </Button>



                </div>

                <div className="d-flex justify-content-center " style={{ marginTop: "20px" }} >


                  <GoogleLogin
                    clientId="21224864813-mgujbp92ji9aqkot1ifuujan8d6qf7o4.apps.googleusercontent.com"

                    buttonText="Login with Gmail"
                    className="btn-shadow"

                    onSuccess={(response) => this.responseGoogle(response)}
                    onFailure={(response) => this.responseGoogle(response)}
                    cookiePolicy={'single_host_origin'}
                  />,




                </div>

              </Form>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(
  mapStateToProps,
  {
    loginUser
  }
)(Login);
