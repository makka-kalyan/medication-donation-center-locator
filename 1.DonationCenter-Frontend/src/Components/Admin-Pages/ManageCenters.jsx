import "./ManageCenters.css";
import axios from "axios";
import { API_BASE_URL } from "../Service/api";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ManageCenters = () => {
  const [centers, setCenters] = useState([]);

  
  const loadCenters = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/centers/`
      );
      setCenters(res.data.centers || []);
    } catch (err) {
      console.error("Error loading centers:", err);
      setCenters([]);
    }
  };

  
  const toggleStatus = async (id, status) => {
    const res = await axios.post(
      `${API_BASE_URL}/api/admin/toggle-center/`,
      { id, status }
    );
    alert(res.data.success);
    loadCenters();
  };

  useEffect(() => {
    loadCenters();
  }, []);

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Medication Donation Center Locator</h1>
        </div>
        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>Manage Donation Centers</h2>

        <table className="events-table">
          <thead>
          <tr>
          <th>ID</th>
          <th>Center Name</th>
          <th>Center Type</th> 
          <th>Location</th>
          <th>Contact</th>
          <th>Timings</th>
          <th>Status</th>
          <th>Action</th>
        </tr>

          </thead>

          <tbody>
            {centers.map((c, i) => (
              <tr key={i}>
                <td>{c.id}</td>
                <td>{c.center_name}</td>
                  <td>{c.donation_type}</td>
                <td>{c.location}</td>
                <td>{c.categories}</td>
                <td>{c.timings}</td>
                <td>{c.status}</td>
                <td>
                  <button
                    onClick={() =>
                      toggleStatus(
                        c.id,
                        c.status === "active" ? "inactive" : "active"
                      )
                    }
                  >
                    {c.status === "active" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer>
        <h4>&copy; 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default ManageCenters;
