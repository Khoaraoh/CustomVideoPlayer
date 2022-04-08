import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { GoPlay } from "react-icons/go";
import {
  MdPlayArrow,
  MdPause,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen
} from "react-icons/md";
import styles from "./VideoPlayer.module.css";

function VideoPlayer() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isPlay, setIsPlay] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const [isMinimize, setIsMinimize] = useState(true);

  const [volumeLevel, setvolumeLevel] = useState(50);

  const [oldvolumeLevel, setOldVolumeLevel] = useState(0);

  const [currentPlayTime, setCurrentPlayTime] = useState(0);

  const [isControlPanelShow, setIsControlPanelShow] = useState(true);

  //Ref div chứa React Player
  let videoPlayer = useRef();

  //Ref của React Player
  const player = useRef();

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);
  });

  //Set and update time after every 1 second
  useEffect(() => {
    const timeCounter = setInterval(() => {
      setCurrentPlayTime(player.current.getCurrentTime());
    }, 1000);
  }, []);

  //Show control panel when mousemove, hide it after 3s if mouse is not move
  useEffect(() => {
    const hideControlPanel = () => {
      setIsControlPanelShow(false);
    };
    let mouseNotMove = setTimeout(hideControlPanel, 3000);

    window.addEventListener("mousemove", () => {
      setIsControlPanelShow(true);
      window.clearTimeout(mouseNotMove);
      mouseNotMove = setTimeout(hideControlPanel, 3000);
    });

    window.addEventListener('keydown', () => {
      setIsControlPanelShow(true);
      window.clearTimeout(mouseNotMove);
      mouseNotMove = setTimeout(hideControlPanel, 3000);
    })
  }, []);

  function exitHandler() {
    if (!document.fullscreenElement) {
      if (isFullScreen === true) {
        handleExitFullscreen();
      }
    }
  }

  //handle when click Play button in thumnail
  function handlePlay() {
    if (videoPlayer.current.requestFullscreen) {
      videoPlayer.current.requestFullscreen();
    } else if (videoPlayer.current.webkitRequestFullscreen) {
      /* Safari */
      videoPlayer.current.webkitRequestFullscreen();
    } else if (videoPlayer.current.msRequestFullscreen) {
      /* IE11 */
      videoPlayer.current.msRequestFullscreen();
    }
    setIsFullScreen(true);
    setIsMinimize(false);
    setIsPlay(true);
  }

  //handle click play/pasue button
  function handlePlayPause() {
    if (isPlay === true) {
      setIsPlay(false);
    } 
    else {
      setIsPlay(true);
    }
  }

  function handleMuted() {
    if (isMuted === true) {
      setIsMuted(false);
      setvolumeLevel(oldvolumeLevel);
    } else {
      setIsMuted(true);
      setOldVolumeLevel(volumeLevel);
      setvolumeLevel(0);
    }
  }

  function handleExitFullscreen() {
    if (isFullScreen === true) {
      document.exitFullscreen();
      setIsFullScreen(false);
      setIsMinimize(true);
      setIsPlay(false);
    }
  }

  function handleOnChangeVolume(e) {
    if (e.target.value == 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    setvolumeLevel(e.target.value);
  }

  function handleOnChangeCurrentPlayTime(e) {
    setCurrentPlayTime((e.target.value / 1000) * player.current.getDuration());
    player.current.seekTo(
      (e.target.value / 1000) * player.current.getDuration(),
      "seconds"
    );
  }

  function handleOnChangeCurrentPlayTime(e) {
    setCurrentPlayTime((e.target.value / 1000) * player.current.getDuration());
    player.current.seekTo(
      (e.target.value / 1000) * player.current.getDuration(),
      "seconds"
    );
  }

  function handleCurrentPlayTimeRightButton() {
    setCurrentPlayTime(currentPlayTime + 5);
    player.current.seekTo(currentPlayTime + 5, "seconds");
  }
  function handleCurrentPlayTimeLeftButton() {
    setCurrentPlayTime(currentPlayTime - 5);
    player.current.seekTo(currentPlayTime - 5, "seconds");
  }
  function handleCurrentPlayTimeUpButton() {
    setIsMuted(false);
    if (volumeLevel + 5 > 100) {
      setvolumeLevel(100);
    } else setvolumeLevel(volumeLevel + 5);
  }
  function handleCurrentPlayTimeDownButton() {
    if (volumeLevel - 5 < 0) {
      setvolumeLevel(0);
      setIsMuted(true);
    } else setvolumeLevel(volumeLevel - 5);
  }

  function handleKeyDown(e) {
    e.preventDefault();
    if (e.key === ' ') {
      handlePlayPause(e);
    }
    if (e.key === "ArrowRight") {
      handleCurrentPlayTimeRightButton();
    }
    if (e.key === "ArrowLeft") {
      handleCurrentPlayTimeLeftButton();
    }
    if (e.key === "ArrowUp") {
      handleCurrentPlayTimeUpButton();
    }
    if (e.key === "ArrowDown") {
      handleCurrentPlayTimeDownButton();
    }
  }

  return (
    <div
      className={styles.videoWrapper}
      ref={videoPlayer}
      onDoubleClick={handleExitFullscreen}
      onKeyDown={handleKeyDown}
    >
      <ReactPlayer
        url={"/videos/video.mp4"} // Can use other url such as youtube
        width="100%"
        height="100%"
        pip={true}
        controls={true}
        className={styles.videoWrapper}
        playing={isPlay}
        muted={isMuted}
        volume={volumeLevel / 100}
        ref={player}
      />
      {isMinimize ? (
        <div className={styles.videoPlayButton} onDoubleClick={handlePlay}>
          <GoPlay className={styles.videoPlayButtonIcon} size="48px"></GoPlay>
        </div>
      ) : (
        <div className={styles.videoFullscreen} onDoubleClick={handleExitFullscreen}>
          {isFullScreen && isControlPanelShow && (
          <div className={styles.controlWrapper}>
            <div className={styles.controlPanel}>
              <div className={styles.timeSlider}>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={(currentPlayTime * 1000) / player.current.getDuration()}
                  onChange={handleOnChangeCurrentPlayTime}
                />
              </div>

              <div className={styles.controller}>
                <div className={styles.leftController}>
                  <button onClick={handlePlayPause}>
                    {isPlay ? (
                      <MdPause className="icon" size="32px" />
                    ) : (
                      <MdPlayArrow className="icon" size="32px" />
                    )}
                  </button>

                  <button onClick={handleMuted}>
                    {isMuted ? (
                      <MdVolumeOff size="32px" />
                    ) : (
                      <MdVolumeUp size="32px" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volumeLevel}
                    onChange={handleOnChangeVolume}
                  />

                  {Math.round(currentPlayTime) % 60 < 10 ? (
                    <span>
                      {Math.floor(currentPlayTime / 60)}:0
                      {Math.round(currentPlayTime) % 60}
                    </span>
                  ) : (
                    <span>
                      {Math.floor(currentPlayTime / 60)}:
                      {Math.round(currentPlayTime) % 60}
                    </span>
                  )}

                  <span>/</span>

                  {Math.round(player.current.getDuration()) % 60 < 10 ? (
                    <span>
                      {Math.floor(player.current.getDuration() / 60)}:0
                      {Math.round(player.current.getDuration()) % 60}
                    </span>
                  ) : (
                    <span>
                      {Math.floor(player.current.getDuration() / 60)}:
                      {Math.round(player.current.getDuration()) % 60}
                    </span>
                  )}
                </div>

                <div className={styles.rightController}>
                  <button onClick={handleExitFullscreen}>
                    <MdFullscreen size="32px" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      
    </div>

    // <ReactPlayer
    //   url={props.item.url} // Can use other url such as youtube
    //   width="100%"
    //   height="100%"
    //   pip={true}
    //   controls={true}
    // />
  );
};

export default VideoPlayer;