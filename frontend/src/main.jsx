import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CheckAuth from './components/CheckAuth.jsx'
import Navbar from "./components/Navbar.jsx"
import About from './pages/About.jsx'
import Tickets from './pages/Tickets.jsx'
import TicketDetailsPage from "./pages/Ticket.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Admin from "./pages/Admin.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Navbar/>
    <Routes>
        <Route path="/about" element={<About/>}/>
        <Route path='/' element={<CheckAuth protectedRoute={true}><Tickets/></CheckAuth>}/>
        <Route path="/tickets/:id" element={<CheckAuth protectedRoute={true}><TicketDetailsPage/></CheckAuth>}/>
        <Route path="/login" element={<CheckAuth protectedRoute={false}><Login/></CheckAuth>}/>
        <Route path="/signup" element={<CheckAuth protectedRoute={false}><Signup/></CheckAuth>}/>
        <Route path="/admin" element={<CheckAuth protectedRoute={true}><Admin/></CheckAuth>}/>

    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
