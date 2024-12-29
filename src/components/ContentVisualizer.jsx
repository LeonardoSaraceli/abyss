import { useContext } from 'react'
import { StateContext } from './App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

export default function ContentVisualizer() {
  const {
    currentMusic,
    currentVisualizer,
    getCreatorNames,
    isPlaying,
    setCurrentMusic,
    setSelectedMusic,
    togglePlayPause,
    setMusicQueue,
    setCurrentQueueIndex,
    musicQueue,
    setCurrentAlbum,
    currentAlbum,
  } = useContext(StateContext)

  const playAlbum = (album) => {
    setCurrentAlbum(album)
    localStorage.setItem('current-album', JSON.stringify(album))

    const queue = album.musics.map((music) => ({
      ...music,
      albumId: album.id,
    }))

    setMusicQueue(queue)
    localStorage.setItem('music-queue', JSON.stringify(queue))

    setCurrentQueueIndex(0)
    localStorage.setItem('current-queue-index', 0)

    setCurrentMusic(queue[0])
    localStorage.setItem('current-music', JSON.stringify(queue[0]))

    setSelectedMusic(true)
  }

  return (
    <section
      id="content-visualizer"
      style={
        currentMusic && Object.entries(currentMusic).length > 0
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
            <FontAwesomeIcon
              icon={
                currentAlbum && musicQueue[0]?.albumId === currentVisualizer.id
                  ? isPlaying
                    ? faPause
                    : faPlay
                  : faPlay
              }
              id="play-music"
              onClick={() => {
                if (
                  currentAlbum &&
                  musicQueue.length > 0 &&
                  musicQueue[0]?.albumId === currentVisualizer.id
                ) {
                  togglePlayPause()
                } else {
                  playAlbum(currentVisualizer)
                }
              }}
            />

            {currentVisualizer.musics && (
              <ul>
                {currentVisualizer.musics.map((music, index) => (
                  <li
                    key={music.music_id}
                    onClick={() => {
                      const queue = currentVisualizer.musics.map((track) => ({
                        ...track,
                        albumId: currentVisualizer.id,
                      }))

                      const selectedIndex = queue.findIndex(
                        (track) => track.music_id === music.music_id
                      )

                      if (selectedIndex !== -1) {
                        setCurrentAlbum(currentVisualizer)
                        localStorage.setItem('current-album', JSON.stringify(currentVisualizer))

                        setMusicQueue(queue)
                        localStorage.setItem(
                          'music-queue',
                          JSON.stringify(queue)
                        )

                        setCurrentQueueIndex(selectedIndex)
                        localStorage.setItem(
                          'current-queue-index',
                          selectedIndex
                        )

                        setCurrentMusic(queue[selectedIndex])
                        localStorage.setItem(
                          'current-music',
                          JSON.stringify(queue[selectedIndex])
                        )

                        setSelectedMusic(true)
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
