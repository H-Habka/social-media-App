import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Login, Home } from './comonents'
import { NotificationSection } from './comonents/index'


function App() {



  return (
    <>
      <NotificationSection />
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='/*' element={<Home />} />
      </Routes>
    </>

  );
}

export default App;
