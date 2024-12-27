import { useContext } from 'react'
import { StateContext } from './App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

export default function ContentVisualizer() {
  const {
    currentMusic,
    currentVisualizer,
    getCreatorNames,
    setCurrentMusic,
    setSelectedMusic,
    togglePlayPause,
  } = useContext(StateContext)

  return (
    <section
      id="content-visualizer"
      style={
        Object.entries(currentMusic).length > 0
          ? { maxHeight: 'calc(100vh - 145px)' }
          : null
      }
    >
      {currentVisualizer.cover ? (
        <>
          <div className="first-div-visualizer">
            <img src={currentVisualizer.cover} alt={currentVisualizer.title} />

            <div>
              <h1>{currentVisualizer.title}</h1>

              <a>{getCreatorNames(currentVisualizer.id)}</a>
            </div>
          </div>

          <div className="second-div-visualizer">
            <FontAwesomeIcon icon={faPlay} id="play-music" />

            {currentVisualizer.musics && (
              <ul>
                {currentVisualizer.musics.map((music, index) => (
                  <li
                    key={music.music_id}
                    onClick={() => {
                      if (
                        currentMusic.id ||
                        currentMusic.music_id !== music.music_id
                      ) {
                        localStorage.setItem(
                          'current-music',
                          JSON.stringify(music)
                        )
                        setCurrentMusic(music)
                        setSelectedMusic(true)
                      } else {
                        togglePlayPause()
                      }
                    }}
                  >
                    <span>{index + 1}</span>

                    <div>
                      <span>{music.music_title}</span>

                      <a>{getCreatorNames(music.music_id)}</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div id="profile-visualizer">
          <div>
            {currentVisualizer.picture ? (
              <img
                src={currentVisualizer.picture}
                alt={currentVisualizer.title}
              />
            ) : (
              <h2>{currentVisualizer.name[0].toUpperCase()}</h2>
            )}

            <h1>{currentVisualizer.name}</h1>
          </div>
        </div>
      )}
    </section>
  )
}
