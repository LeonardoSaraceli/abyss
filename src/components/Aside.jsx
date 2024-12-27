import { faBookOpen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/styles/aside.css'
import { StateContext } from './App'
import { useContext } from 'react'

export default function Aside() {
  const { currentMusic } = useContext(StateContext)

  return (
    <aside
      id="aside"
      style={
        Object.entries(currentMusic).length > 0
          ? { maxHeight: 'calc(100vh - 145px)' }
          : null
      }
    >
      <div>
        <div>
          <FontAwesomeIcon icon={faBookOpen} />

          <span>Sua Biblioteca</span>
        </div>

        <FontAwesomeIcon icon={faPlus} />
      </div>
    </aside>
  )
}
