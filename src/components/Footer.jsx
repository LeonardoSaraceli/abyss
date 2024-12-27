import { useContext } from 'react'
import { StateContext } from './App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  const {
    currentMusic,
    getCreatorNames,
    isPlaying,
    audioRef,
    togglePlayPause,
    volume,
    handleVolumeChange,
  } = useContext(StateContext)

  return (
    <>
      {Object.entries(currentMusic).length > 0 && (
        <footer>
          <div id="music-title">
            <img
              src={currentMusic.cover || currentMusic.music_cover}
              alt={currentMusic.title || currentMusic.music_title}
            />

            <div>
              <h6>{currentMusic.title || currentMusic.music_title}</h6>

              <a>
                {getCreatorNames(currentMusic.id || currentMusic.music_id)}
              </a>
            </div>
          </div>

          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            onClick={togglePlayPause}
            id="footer-play-music"
          />

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            title="Volume"
            id="volume-control"
          />

          <audio ref={audioRef} style={{ display: 'none' }} />
        </footer>
      )}
    </>
  )
}
