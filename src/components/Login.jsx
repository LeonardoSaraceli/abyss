import { useContext, useState } from 'react'
import '../assets/styles/login.css'
import logo from '../assets/images/logo.svg'
import { useNavigate } from 'react-router-dom'
import { StateContext } from './App'

export default function Login() {
  const { fetchUserInfo } = useContext(StateContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          localStorage.setItem('jwt', data.token)
          fetchUserInfo()
          navigate('/')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <main id="login">
      <section>
        <div>
          <img loading="lazy" src={logo} alt="Abyss" />

          <h1>Entrar no Abyss</h1>

          <div id="div-breaker"></div>

          <form onSubmit={handleOnSubmit}>
            <div>
              <label htmlFor="email">E-mail</label>

              <input
                type="email"
                name="email"
                id="email"
                autoComplete="current email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleOnChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Senha</label>

              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleOnChange}
                required
              />
            </div>

            <button type="submit">Entrar</button>
          </form>

          <span>
            Não tem uma conta? <a href="/register">Inscrever-se no Abyss</a>.
          </span>
        </div>
      </section>
    </main>
  )
}
