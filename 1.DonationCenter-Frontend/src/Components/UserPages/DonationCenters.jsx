import "./DonationCenters.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Service/api";
import { useEffect, useState } from "react";

const DonationCenters = () => {
  const [centers, setCenters] = useState([]);

  
  const loadCenters = async () => {
    const res = await axios.get(
      `${API_BASE_URL}/api/admin/centers/`
    );

    
    const activeCenters = (res.data.centers || []).filter(
      (c) => c.status === "active"
    );

    setCenters(activeCenters);
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
          <NavLink to="/user">User</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>Available Donation Centers</h2>

        <table className="events-table">
          <thead>
            <tr>
              <th>Center Name</th>
               <th>Center Type</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Timings</th>
              <th>Accepted Medicines</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {centers.map((center, i) => (
              <tr key={i}>
                <td>{center.center_name}</td>
               <td>{center.donation_type}</td>
                <td>{center.location}</td>
                <td>{center.contact}</td>
                <td>{center.timings}</td>
                <td>{center.categories}</td>
                <td>{center.status}</td>
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

export default DonationCenters;
