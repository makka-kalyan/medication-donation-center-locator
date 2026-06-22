import "./AddDonationCenters.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Service/api";

const AddDonationCenter = () => {
  const [selectedType, setSelectedType] = useState("");
  const [centerName, setCenterName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [timings, setTimings] = useState("");
  const [categories, setCategories] = useState("");

  const addCenter = async () => {
  if (!centerName || !location || !contact || !timings || !categories) {
    alert("Please fill all fields");
    return;
  }

  
  let donationTypeValue = "";
  if (selectedType === "Medicine Donation") donationTypeValue = "Medicine";
  if (selectedType === "Blood Donation") donationTypeValue = "Blood";
  if (selectedType === "Organ Donation") donationTypeValue = "Organ";

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/admin/add-center/`,
      {
        center_name: centerName,
        location,
        contact,
        timings,
        categories,
        donation_type: donationTypeValue, 
      }
    );

    alert(res.data.success); 

    setCenterName("");
    setLocation("");
    setContact("");
    setTimings("");
    setCategories("");
    setSelectedType("");

  } catch (err) {
    alert(err.response?.data?.error || "Something went wrong");
  }
};


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
        <h2>Add Donation Center</h2>

        
        {selectedType === "" && (
          <div className="event-form1">
            <button id="eve-btn" onClick={() => setSelectedType("Medicine Donation")}>
              Add Medicine Donation Center
            </button>

            <button id="eve-btn" onClick={() => setSelectedType("Blood Donation")}>
              Add Blood Donation Center
            </button>

            <button id="eve-btn" onClick={() => setSelectedType("Organ Donation")}>
              Add Organ Donation Center
            </button>
          </div>
        )}

        
        {selectedType !== "" && (
          <div className="event-form1">
            <h3 style={{ textAlign: "center" }}>{selectedType}</h3>

            <input
              type="text"
              placeholder="Center Name"
              autoFocus
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Location / Address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              type="text"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <input
              type="text"
              placeholder="Center Timings (e.g. 9AM - 6PM)"
              value={timings}
              onChange={(e) => setTimings(e.target.value)}
            />

            <input
              type="text"
              placeholder="Accepted Categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />

            <button id="eve-btn" onClick={addCenter}>
              Add Center
            </button>

            <button
              id="eve-btn"
              style={{ backgroundColor: "#999" }}
              onClick={() => setSelectedType("")}
            >
              Back
            </button>
          </div>
        )}
      </main>

      <footer>
        <h4>&copy; 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default AddDonationCenter;
