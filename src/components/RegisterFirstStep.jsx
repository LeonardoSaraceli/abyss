/* eslint-disable react/prop-types */
import logo from '../assets/images/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

export default function RegisterFirstStep({
  setStage,
  formData,
  handleOnChange,
  stepperBar,
  setStepperBar,
  goBack,
  setGoBack,
}) {
  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (formData.password) {
      setStepperBar({
        ...stepperBar,
        second: true,
      })

      setStage(3)
    }
  }

  return (
    <>
      <img src={logo} alt="Abyss" />

      <div className="stepper-bar">
        <div
          id={goBack ? 'full-bar' : 'first-50'}
          className={!goBack && stepperBar.first ? 'advanced' : null}
        ></div>
      </div>

      <div className={'register-stepper'}>
        <FontAwesomeIcon
          icon={faAngleLeft}
          onClick={() => [
            setStepperBar({
              ...stepperBar,
              first: false,
            }),
            setGoBack(false),
            setStage(1),
          ]}
        />

        <div>
          <div>
            <span className="stepper">Etapa 1 de 2</span>

            <span>Crie uma senha</span>
          </div>

          <form onSubmit={handleOnSubmit}>
            <div>
              <label htmlFor="password">Senha</label>

              <input
                type="password"
                id="password"
                name="password"
                autoComplete="off"
                value={formData.password}
                onChange={handleOnChange}
                required
              ></input>
            </div>

            <button type="submit">Avançar</button>
          </form>
        </div>
      </div>
    </>
  )
}
