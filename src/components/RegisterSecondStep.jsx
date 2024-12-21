/* eslint-disable react/prop-types */
import logo from '../assets/images/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export default function RegisterSecondStep({
  setStage,
  formData,
  handleOnChange,
  stepperBar,
  setStepperBar,
  setGoBack,
}) {
  const navigate = useNavigate()
  const handleOnSubmit = (e) => {
    e.preventDefault()

    fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: formData.name,
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
          navigate('/')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <>
      <img src={logo} alt="Abyss" />

      <div className="stepper-bar">
        <div
          id="first-100"
          className={stepperBar.second ? 'advanced' : null}
        ></div>
      </div>

      <div className={'register-stepper'}>
        <FontAwesomeIcon
          icon={faAngleLeft}
          onClick={() => [
            setStepperBar({
              ...stepperBar,
              second: false,
            }),
            setGoBack(true),
            setStage(2),
          ]}
        />

        <div>
          <div>
            <span className="stepper">Etapa 2 de 2</span>

            <span>Fale de você</span>
          </div>

          <form onSubmit={handleOnSubmit}>
            <div>
              <label htmlFor="name">Nome</label>

              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleOnChange}
                required
              ></input>
            </div>

            <button type="submit">Inscrever-se</button>
          </form>
        </div>
      </div>
    </>
  )
}
