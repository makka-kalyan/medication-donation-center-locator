import "./Register.css"
import axios from "axios"
import { API_BASE_URL } from "./Service/api"
import { useState } from "react"

const Register=()=>{
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

      const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    mobile: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      `${API_BASE_URL}/api/register/`,
      form
    );
     if(res.data.error){
  setMsgType("error");
  setMessage(res.data.error);
    }else{
      setMsgType("success");
      setMessage(res.data.success);
    }

    
  };

    return(<>
      <main>
        <h2>Register</h2>
      {message && (
        <p className={`msg ${msgType}`}>
          {message}
        </p>
      )}

     <form onSubmit={handleSubmit}>
         <div>
            <label>Name:</label>
            <input type="text" name="username" onChange={handleChange} placeholder="Enter User Name" required autoFocus/>
        </div>

        <div>
            <label>Email:</label>
            <input type="email" name="email" onChange={handleChange} placeholder="Enter Email" required/>
        </div>

        <div>
            <label>Password:</label>
            <input type="password" name="password" onChange={handleChange} placeholder="Enter Password" required/>
        </div>

        <div>
            <label>Confirm Password:</label>
            <input type="password" name="confirm_password" onChange={handleChange} placeholder="Re-enter password" required/>
        </div>

        <div>
            <label>Mobile Number:</label>
            <input 
                type="tel"
                name="mobile"
                inputMode="numeric" 
                  maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
                placeholder="Enter mobile number"
                onChange={handleChange}
                required
              />
        </div>

        <div>
            <label>Address:</label>
            <textarea name="address" onChange={handleChange} rows="2" cols="30" placeholder="Enter full address" required></textarea>
        </div>

        <button type="submit" id="btn-sub">Submit</button>

    </form>
      </main>
      
       <footer>
             <h4>&copy; 2025 All Rights Reserved SAK Informatics</h4>
        </footer>
    </>)
}
export default Register
