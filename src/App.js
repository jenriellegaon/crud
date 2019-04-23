import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Modal from 'react-awesome-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      visibleC: false,
      visibleE: false,
      id: '',
      name: '',
      salary: '',
      age: ''
    };
  }

  resetCreateForm() {
    this.setState({
      name: '',
      salary: '',
      age: ''
    });
  }

  openCreateModal() {
    this.setState({
      visibleC: true
    });
  }

  closeCreateModal() {
    this.setState({
      visibleC: false
    });
  }

  openEditModal() {
    this.setState({
      visibleE: true
    });
  }

  closeEditModal() {
    this.setState({
      visibleE: false
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  componentDidMount() {
    this.getAllEmployees();
  }

  getAllEmployees() {
    try {
      axios({
        method: 'get',
        url: 'http://dummy.restapiexample.com/api/v1/employees'
      }).then(response => {
        console.log('All employee data');
        console.log(response.data);

        this.setState({ data: response.data });
      });
    } catch (err) {
      console.log('Error on fetching all employee data');
      console.log(err);
    }
  }

  getEmployeeById(id) {
    try {
      axios({
        method: 'get',
        url: `http://dummy.restapiexample.com/api/v1/employee/${id}`
      }).then(response => {
        console.log('Selected employee data');
        console.log(response.data);
        this.setState({
          id: response.data.id,
          name: response.data.employee_name,
          salary: response.data.employee_salary,
          age: response.data.employee_age
        });
        this.openEditModal();
      });
    } catch (err) {
      console.log('Error on fetching selected employee data');
      console.log(err);
    }
  }

  updateEmployeeById(id, data) {
    try {
      axios({
        method: 'put',
        url: `http://dummy.restapiexample.com/api/v1/update/${id}`,
        data: data
      }).then(response => {
        console.log('Updated employee data');
        console.log(response.data);
        this.getAllEmployees();
        this.resetCreateForm();
        this.closeEditModal();
      });
    } catch (err) {
      console.log('Error on updating selected employee data');
      console.log(err);
    }
  }

  deleteEmployeeById(id) {
    try {
      axios({
        method: 'delete',
        url: `http://dummy.restapiexample.com/api/v1/delete/${id}`
      }).then(response => {
        console.log('Deleted employee data');
        console.log(response.data);
        this.getAllEmployees();
      });
    } catch (err) {
      console.log('Error on deleting selected employee data');
      console.log(err);
    }
  }

  saveEmployee(data) {
    if (
      this.state.name === '' ||
      this.state.salary === '' ||
      this.state.age === ''
    ) {
      //Auto focus on input box
    } else {
      try {
        axios({
          method: 'post',
          url: `http://dummy.restapiexample.com/api/v1/create`,
          data: data
        }).then(response => {
          console.log('Added employee data');
          console.log(response.data);
          this.getAllEmployees();
          this.closeCreateModal();
          this.resetCreateForm();
        });
      } catch (err) {
        console.log('Error on adding employee data');
        console.log(err);
      }
    }
  }

  render() {
    const columns = [
      {
        Header: 'Id',
        accessor: 'id'
      },
      {
        Header: 'Name',
        accessor: 'employee_name'
      },
      {
        Header: 'Salary',
        accessor: 'employee_salary'
      },
      {
        Header: 'Age',
        accessor: 'employee_age'
      },
      {
        Header: '',
        accessor: '',
        width: 150,
        Cell: ({ row }) => (
          <div>
            <button
              className='button-edit'
              onClick={() => {
                this.getEmployeeById(row.id);
              }}
            >
              Edit
            </button>
          </div>
        )
      },
      {
        Header: '',
        accessor: '',
        width: 150,
        Cell: ({ row }) => (
          <div>
            <button
              className='button-delete'
              onClick={() => this.deleteEmployeeById(row.id)}
            >
              Delete
            </button>
          </div>
        )
      }
    ];

    var data = {
      name: this.state.name,
      salary: this.state.salary,
      age: this.state.age
    };

    return (
      <div className='App'>
        <header className='App-header'>
          <h2>Simple CRUD App</h2>
          <button className='button-add' onClick={() => this.openCreateModal()}>
            Add
          </button>
          <ReactTable
            data={this.state.data}
            columns={columns}
            defaultPageSize={10}
            pageSizeOptions={[10]}
          />
          <Modal
            visible={this.state.visibleC}
            style={customStyles}
            effect='fadeInUp'
            onClickAway={() => this.closeCreateModal()}
          >
            <div className='div-form-parent'>
              <h3>Add New Employee</h3>
              <div className='div-form-add'>
                <input
                  className='input-text'
                  placeholder='Name'
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>
              <div className='div-form-add'>
                <input
                  className='input-text'
                  placeholder='Salary'
                  value={this.state.salary}
                  onChange={e => this.setState({ salary: e.target.value })}
                />
              </div>
              <div className='div-form-add'>
                <input
                  className='input-text'
                  placeholder='Age'
                  value={this.state.age}
                  onChange={e => this.setState({ age: e.target.value })}
                />
              </div>
              <div>
                <button
                  className='button-save'
                  onClick={() => this.saveEmployee(data)}
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            visible={this.state.visibleE}
            style={customStyles}
            effect='fadeInUp'
            onClickAway={() => this.closeEditModal()}
          >
            <div className='div-form-parent'>
              <h3>Update Employee Details</h3>
              <div className='div-form-add'>
                <input
                  className='input-text'
                  placeholder='Name'
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>
              <div className='div-form-add'>
                <input
                  className='input-text'
                  placeholder='Salary'
                  value={this.state.salary}
                  onChange={e => this.setState({ salary: e.target.value })}
                />
              </div>
              <div className='div-form-add'>
                <input
                  className='input-text'
                  placeholder='Age'
                  value={this.state.age}
                  onChange={e => this.setState({ age: e.target.value })}
                />
              </div>
              <div>
                <button
                  className='button-save'
                  onClick={() => {
                    this.updateEmployeeById(this.state.id, data);
                    console.log('Form DATA on edit');
                    console.log(data);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        </header>
      </div>
    );
  }
}

export default App;
