import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [task, setTask] = useState("")
  const [date, setDate] = useState(new Date());

  const [data, setData] = useState("")
  const [filteredData, setFilteredData] = useState("")

  const addData = (() => {
    console.log(data)
    axios.post('http://localhost:5000/addtask', {
      task: task,
      date: date
    }).then(() => {
      getTasks();
    });
  })

  useEffect(() => {
    getTasks()
  }, [])

  function getTasks() {
    axios.get("http://localhost:5000/get")
      .then((res) => {
        console.log(res.data)
        setData(res.data)
        setFilteredData(res.data)
      })
  }

  const completeTask = (id) => {
    axios.put(`http://localhost:5000/complete/${id}`)
    console.log(id)
    console.log("complete task called")
    let c = document.getElementById(id)
    c.style.textDecoration = 'line-through'
    c.style.color = 'red'
  }

  const deleteRow = (id) => {
    axios.delete(`http://localhost:5000/delete/${id}`).then(() => {
      getTasks();
    });
  }

  const filterData = ((choice) => {
    if (choice === 'all') {
      setFilteredData(data)
      console.log("all", filteredData)
      return;
    } else if (choice === 'completed') {
      const filterData = Object.entries(data).filter(([key, value]) => value.status === 'completed');
      setFilteredData(filterData)
      console.log("completed", filteredData)
      return;
    } else if (choice === 'pending') {
      const filterData = Object.entries(data).filter(([key, value]) => value.status === null);
      setFilteredData(filterData)
      console.log("pending", filteredData)
      return;
    }
  });

  return (
    <div>
      <div>
        <h3>TODO Input</h3>
        <input type="text" placeholder="New TODO" onChange={event => setTask(event.target.value)} />
        <td />
        <input type="date" placeholder="enter Date" onChange={event => setDate(event.target.value)} />
        <td />
        <button onClick={addData}>Add New Task</button>
      </div>
      <div className='container'>
        <div>
          <div><h3>TODO List</h3></div>
          <div>
            <button onClick={() => filterData('all')}>All Tasks</button>
            <button onClick={() => filterData('completed')}>Completed</button>
            <button onClick={() => filterData('pending')}>Pending</button>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  {/* <th>Date</th> */}
                  <th>Completed</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(filteredData).map((key) => (
                  <tr key={key} >
                    <td id={filteredData[key].id} className={`${new Date() > new Date(filteredData[key].date) ? 'overdue' : ''} ${filteredData[key].status ? 'completed' : ''}`}>{filteredData[key].task}</td>
                    <td><button onClick={() => completeTask(filteredData[key].id)}>Completed</button></td>
                    <td><button onClick={() => deleteRow(filteredData[key].id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
