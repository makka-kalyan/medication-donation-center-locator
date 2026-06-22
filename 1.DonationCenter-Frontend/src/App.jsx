import './App.css'
import Header from './Components/Header'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import {Routes,Route,Navigate} from "react-router-dom"
import Admin from './Components/Admin'
import User from './Components/User'
import { useLocation } from 'react-router-dom'
import AddDonationCenter from './Components/Admin-Pages/AddDonationCenters'
import CenterTimings from './Components/Admin-Pages/CenterTimings'
import ManageCenters from './Components/Admin-Pages/ManageCenters'
import DonationCenters from './Components/UserPages/DonationCenters'

function App() {
  const location = useLocation();
  
 

  
  const hideHeaderRoutes = ["/admin", "/user"];

  return (<>
  
  
      {!hideHeaderRoutes.includes(location.pathname) && <Header/>}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={ <Admin/>}/>
      <Route path="/user" element={ <User/>}/>
      <Route path="/addcenters" element={<AddDonationCenter/>}/>
      <Route path="/centertimings" element={<CenterTimings/>}/>
      <Route path="/managecenters" element={<ManageCenters/>}/>
      <Route path="/donation-centers" element={<DonationCenters/>}/>
    </Routes> 
    </>
  )
}

export default App
