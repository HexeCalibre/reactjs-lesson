import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, setToken, setIsAuthenticated } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/employees`;

    const controller = new AbortController();

    const requestOptions = {
      signal: controller.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    setLoading(true);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        setEmployees(json);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();

    const url = `${import.meta.env.VITE_API_URL}/logout`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchResponse = await fetch(url, requestOptions);

    if (fetchResponse.status === 200) {
      setIsAuthenticated(false);
      setToken("");
      alert("Log out successfully!");
      navigate("/login");
    }
  };

  return (
    <>
      <h2>Employee List</h2>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <p>
            <Link to="/employees/create">Add New Employee</Link>
          </p>
          <p>
            {token.length > 0 && <Link onClick={handleSignOut}>Log Out</Link>}
          </p>

          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <Link to={`/employees/${employee.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default EmployeeList;
