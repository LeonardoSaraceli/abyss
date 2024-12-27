import Aside from './Aside'
import Footer from './Footer'
import Header from './Header'
import '../assets/styles/mainwrapper.css'
import MainContent from './MainContent'
import { StateContext } from './App'
import { useContext } from 'react'
import ContentVisualizer from './ContentVisualizer'

export default function MainWrapper() {
  const { currentVisualizer } = useContext(StateContext)

  return (
    <>
      <main id="mainwrapper">
        <Header />

        <section>
          <Aside />

          {Object.entries(currentVisualizer).length > 0 ? (
            <ContentVisualizer />
          ) : (
            <MainContent />
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
