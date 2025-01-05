import { useState } from 'react'
import '../assets/styles/register.css'
import logo from '../assets/images/logo.svg'
import RegisterFirstStep from './RegisterFirstStep'
import RegisterSecondStep from './RegisterSecondStep'

export default function RegisterWrapper() {
  const [stage, setStage] = useState(1)
  const [goBack, setGoBack] = useState(false)
  const [stepperBar, setStepperBar] = useState({
    first: false,
    second: false,
  })
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
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

    if (formData.email) {
      setStepperBar({
        ...stepperBar,
        first: true,
      })

      setStage(2)
    }
  }

  return (
    <main id="register-wrapper">
      {stage === 1 && (
        <>
          <div id="register-title">
            <img loading='lazy' src={logo} alt="Abyss" />

            <h1>
              Se inscreva e<br />
              comece a curtir
            </h1>
          </div>

          <form onSubmit={handleOnSubmit} id="default-form">
            <div>
              <label htmlFor="email">Endereço de e-mail</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="nome@dominio.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleOnChange}
                required
              ></input>
            </div>

            <button type="submit">Avançar</button>
          </form>

          <span>
            Já tem uma conta? <a href="/login">Faça login aqui</a>.
          </span>
        </>
      )}

      {stage === 2 && (
        <RegisterFirstStep
          setStage={setStage}
          formData={formData}
          handleOnChange={handleOnChange}
          stepperBar={stepperBar}
          setStepperBar={setStepperBar}
          goBack={goBack}
          setGoBack={setGoBack}
        />
      )}

      {stage === 3 && (
        <RegisterSecondStep
          setStage={setStage}
          formData={formData}
          handleOnChange={handleOnChange}
          stepperBar={stepperBar}
          setStepperBar={setStepperBar}
          setGoBack={setGoBack}
        />
      )}
    </main>
  )
}
