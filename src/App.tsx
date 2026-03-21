import './App.css'
import Navbar from './components/navbar/Navbar'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/login/LoginPage'

function App() {

  return (
    <MainLayout>
      <Navbar />
      <LoginPage />
    </MainLayout>
  )
}

export default App
