import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import './table.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      name: '',
      email: '',
      showForm: false,


    }
    this.nameChange = this.nameChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.toggleFormView = this.toggleFormView.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.editUsers = this.editUsers.bind(this);

  }

  componentDidMount() {
    this.getData()
  }

  nameChange(event) {
    this.setState({ name: event.target.value });
  }

  emailChange(event) {
    this.setState({ email: event.target.value });
  }

  toggleFormView() {
    this.setState({ showForm: true });
  }

  editUsers(user) {
    this.setState({
      name: user.name,
      email: user.email,
      showForm: true,
      id: user._id
    });
  }

  saveData() {
    if (this.state.id) {
      this.updateData(this.state);
    } else {
      let self = this;
      axios.post('http://localhost:8100/createUser', { name: this.state.name, email: this.state.email })
        .then(function (response) {
          console.log(response);
          self.getData();

        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }


  getData() {
    let self = this;
    axios.get('http://localhost:8100/getUsers')
      .then(function (response) {
        console.log(response.data);
        self.setState({ users: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteData(user) {
    axios.delete(`http://localhost:8100/deleteUsers/${user._id}`)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateData(user) {
    axios.put(`http://localhost:8100/updateUsers/${user.id}`, { name: this.state.name, email: this.state.email })
      .then((response) => {
        console.log(response);
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderTable() {
    let self = this;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
              <th>Actn</th>
            </tr>
            {this.state.users.map(function (user) {
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><button type="button" onClick={() => self.deleteData(user)}>Delete</button></td>
                  <td><button type="button" onClick={() => self.editUsers(user)}>Edit</button></td>

                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    );
  }

  rendForm() {
    return (
      <div>
        <label>Login Form</label>
        <form>
          <label>
            Name
          <input type="text" value={this.state.name} onChange={this.nameChange} />
          </label><br />
          <label>
            Email
            <input type="text" value={this.state.email} onChange={this.emailChange} />
          </label><br />
          <button type="button" onClick={() => this.saveData()}>Send</button>

        </form>
      </div>
    );
  }

  render() {
    return (
      <div>
        <button type="button" onClick={() => this.toggleFormView()}>ADD USER</button>
        {this.renderTable()}
        {this.state.showForm ? this.rendForm() : ""}
      </div>
    );
  }
}
export default App;
