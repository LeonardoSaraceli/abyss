import { Route, Routes } from 'react-router-dom'
import RegisterWrapper from './RegisterWrapper'
import Login from './Login'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterWrapper />}></Route>

        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </>
  )
}
