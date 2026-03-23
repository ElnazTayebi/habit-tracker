import { Router } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/login/LoginPage'

function App() {

  return (
    <Router>
      
    <MainLayout>
      <Navbar />
      <LoginPage />
    </MainLayout>
    </Router>
  )
}

export default App
