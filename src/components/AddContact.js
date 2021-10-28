import React from "react";
import { Link } from "react-router-dom";
import validator from "validator";
import dayjs from "dayjs";
import "./style/addContact.css";

export default class ContactList extends React.Component {
  state = {
    contactInfo: [],
    indexID: "",
    curr: 0,
    errors: {
      nameError: "",
      emailError: "",
      contactError: "",
      locationError: "",
      regDateError: "",
    },
    currentPage: 1,
    contactPerPage: 5,
  };

  //save contact to localstorage
  componentDidUpdate(prevProps, prevState) {
    const json = JSON.stringify(this.state.contactInfo);
    localStorage.setItem("contactInfo", json);
  }
  //fetch contactinfo
  componentDidMount() {
    try {
      const json = localStorage.getItem("contactInfo");
      const contactInfo = JSON.parse(json);
      if (contactInfo) {
        this.setState(() => ({ contactInfo }));
      }
    } catch (e) {
      console.log("Component Did Mount Error");
    }
  }
  handleClickButton = (event) => {
    let set = event.target.id;
    this.setState({ currentPage: set });
  };

  //clears input when contact is validated
  validation = () => {
    let valid = true,
      name = "",
      email = "",
      contact = "",
      location = "",
      regDate = "";

    //Name
    if (this.refs.fullname.value.length >= 30) {
      name = "Full Name field accept up to 30 in size only";
      valid = false;
    } else if (typeof this.refs.fullname.value !== "undefined") {
      if (!this.refs.fullname.value.match(/^[,.a-zA-Z\s]*$/)) {
        name = "Full Name field accept characters values only";
        valid = false;
      }
    }
    if (!this.refs.fullname.value) {
      name = "Full Name field cannot be blank";
      valid = false;
    }

    //Email Address
    if (!this.refs.email.value) {
      email = "Email Address field cannot be blank";
      valid = false;
    } else if (!validator.isEmail(this.refs.email.value)) {
      email = "Email Address field should have email domain";
      valid = false;
    } else if (this.refs.email.value.length >= 45) {
      email = "Email Address field accept up to 45 in size only";
      valid = false;
    }

    //Contact Number
    if (this.refs.contact.value.length === 0) {
      contact = "Contact Number field cannot be blank";
      valid = false;
    } else if (this.refs.contact.value.length !== 11) {
      contact = "Contact Number field accept up to 11 in size only";
      valid = false;
    }
    if (typeof this.refs.contact.value !== "undefined") {
      if (!this.refs.contact.value.match(/^[0-9]*$/)) {
        contact = "Contact Number field accept numeric values only";
        valid = false;
      }
    }

    //Location
    if (!this.refs.location.value) {
      location = "Location field cannot be blank";
      valid = false;
    }

    //Date
    if (!this.refs.regdate.value) {
      regDate = "Registered Date field cannot be blank";
      valid = false;
    } else if (
      this.refs.regdate.value !== dayjs(new Date()).format("YYYY-MM-DD")
    ) {
      regDate = "Registered date field accept current date only.";
      valid = false;
    }
    if (!valid) {
      this.setState({
        errors: {
          nameError: name,
          emailError: email,
          contactError: contact,
          locationError: location,
          regDateError: regDate,
        },
      });
      return false;
    }

    return true;
  };

  //Button functions.
  handleAddContact = (e) => {
    let contactInfo = this.state.contactInfo;
    const fullname = this.refs.fullname.value;
    const email = this.refs.email.value;
    const contact = this.refs.contact.value;
    const location = this.refs.location.value;
    const regdate = dayjs(this.refs.regdate.value).format("MM/DD/YYYY");

    this.setState({
      errors: {
        nameError: "",
        emailError: "",
        contactError: "",
        locationError: "",
        regDateError: "",
      },
    });

    const isValid = this.validation(e);
    if (isValid) {
      if (this.state.curr === 0) {
        let completeContactInfo = {
          fullname,
          email,
          contact,
          location,
          regdate,
        };
        contactInfo.push(completeContactInfo);
      } else {
        let indexID = this.state.indexID;
        contactInfo[indexID].name = fullname;
        contactInfo[indexID].email = email;
        contactInfo[indexID].contact = contact;
        contactInfo[indexID].location = location;
        contactInfo[indexID].regdate = regdate;
      }

      this.setState({
        curr: 0,
        contactInfo: contactInfo,
      });
    }

    //user input
    this.refs.fullname.value = "";
    this.refs.email.value = "";
    this.refs.contact.value = "";
    this.refs.location.value = "";
    this.refs.regdate.value = "";
  };

  handlePagination = (event) => {
    let set = event.target.id;
    this.setState({ currentPage: set });
  };

  // Paging
  render() {
    const { currentPage } = this.state;
    const LastContact = currentPage * 5;
    const FirstContact = LastContact - 5;
    const currentContacts = this.state.contactInfo.slice(
      FirstContact,
      LastContact
    );
    const setID = (currentPage - 1) * 5;

    //Table UI
    const generateContactInfo = currentContacts.map((contactInfo, indexID) => {
      return (
        <tr key={indexID}>
          <th scope="row">{indexID + 1 + setID}</th>
          <td>{contactInfo.fullname}</td>
          <td>{contactInfo.email}</td>
          <td>{contactInfo.contact}</td>
          <td>{contactInfo.location}</td>
          <td>{contactInfo.regdate}</td>
          <td>
            <div className="d-grid gap-2 d-md-block">
              <Link
                className="btn view-btn-color"
                to={{ pathname: "view", state: { id: indexID + setID } }}
              >
                View
              </Link>
              <Link
                className="btn update-btn-color"
                to={{ pathname: "update", state: { id: indexID + setID } }}
              >
                Update
              </Link>
              <Link
                className="btn delete-btn-color"
                to={{ pathname: "delete", state: { id: indexID + setID } }}
              >
                Delete
              </Link>
            </div>
          </td>
        </tr>
      );
    });

    //Paging length generator
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.state.contactInfo.length / 5); i++) {
      pageNumbers.push(i);
    }
    pageNumbers.map((pageNum) => {
      return (
        <button
          className="btn btn-outline-dark"
          key={pageNum}
          id={pageNum}
          onClick={this.handlePagination}
        >
          {pageNum}
        </button>
      );
    });

    return (
      <div>
        <div className="row justify-content-md-center">
          <div className="col-sm-3 backGround">
            <br />
            <br />
            <form ref="myForm" className="myForm ">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className="font-italic form-control"
                  placeholder="Last Name, First Name Middle Initial"
                  type="text"
                  ref="fullname"
                  defaultValue=""
                />

                {this.state.errors["nameError"] ? (
                  <p style={{ color: "red" }}>
                    {this.state.errors["nameError"]}
                  </p>
                ) : null}
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  className="font-italic form-control"
                  placeholder="example@email.com"
                  type="text"
                  ref="email"
                />

                {this.state.errors["emailError"] ? (
                  <p style={{ color: "red" }}>
                    {this.state.errors["emailError"]}
                  </p>
                ) : null}
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  className="font-italic form-control"
                  placeholder="99999999999"
                  type="text"
                  ref="contact"
                  required
                />

                {this.state.errors["contactError"] ? (
                  <p style={{ color: "red" }}>
                    {this.state.errors["contactError"]}
                  </p>
                ) : null}
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <select
                  className="font-italic form-select"
                  type="text"
                  ref="location"
                >
                  <option value="">Select Location</option>
                  <option value="Manila">Manila</option>
                  <option value="Cebu">Cebu</option>
                </select>

                {this.state.errors["locationError"] ? (
                  <p style={{ color: "red" }}>
                    {this.state.errors["locationError"]}
                  </p>
                ) : null}
              </div>
              <div className="mb-3">
                <label className="form-label">Registered Date: </label>
                <br />
                <input
                  type="date"
                  ref="regdate"
                  className="font-italic form-control"
                />
                <br />
                {this.state.errors["regDateError"] ? (
                  <p style={{ color: "red" }}>
                    {this.state.errors["regDateError"]}
                  </p>
                ) : null}
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => this.handleAddContact(e)}
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
          <div className="col-auto view">
            <br></br>
            <br></br>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Contact Number</th>
                  <th>Location</th>
                  <th>Registered Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{generateContactInfo}</tbody>
            </table>
            <br />
            <div style={{ textAlign: "center" }}>
              <button
                className="btn btn-color btn-sm"
                key={
                  Number(this.state.currentPage) === 1
                    ? (this.state.currentPage = 1)
                    : this.state.currentPage - 1
                }
                id={
                  this.state.currentPage === 1
                    ? (this.state.currentPage = 1)
                    : this.state.currentPage - 1
                }
                onClick={this.handleClickButton}
              >
                &#60;
              </button>
              &nbsp; &nbsp; Showing {generateContactInfo.length} of{" "}
              {this.state.contactInfo.length}&nbsp; &nbsp;
              <button
                className="btn btn-color btn-sm"
                style={{ textAlign: "center" }}
                key={
                  Number(currentPage) === Number(pageNumbers.length)
                    ? Number(currentPage)
                    : Number(currentPage) + 1
                }
                id={
                  Number(currentPage) === Number(pageNumbers.length)
                    ? Number(currentPage)
                    : Number(currentPage) + 1
                }
                onClick={this.handleClickButton}
              >
                &#62;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
