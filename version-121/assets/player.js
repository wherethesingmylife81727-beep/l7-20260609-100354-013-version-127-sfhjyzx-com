import { H as Hls } from "./hls.js";

export function initMoviePlayer(options) {
  var video = document.querySelector(options.selector);
  var shell = document.querySelector(options.shellSelector);
  var overlay = document.querySelector(options.overlaySelector);
  var control = document.querySelector(options.controlSelector);
  var status = document.querySelector(options.statusSelector);
  var source = options.source;
  var attached = false;
  var hls = null;

  function setStatus(message) {
    if (status) {
      status.textContent = message || "";
    }
  }

  function attachSource() {
    if (!video || attached) {
      return attached;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          setStatus("视频加载失败，请稍后重试");
        }
      });
      attached = true;
      return true;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      attached = true;
      return true;
    }

    setStatus("视频加载失败，请稍后重试");
    return false;
  }

  function start() {
    if (!video || !attachSource()) {
      return;
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(function () {
          if (shell) {
            shell.classList.add("playing");
          }
          setStatus("");
        })
        .catch(function () {
          setStatus("点击播放器即可开始播放");
        });
    }
  }

  function toggleByVideo() {
    if (!video) {
      return;
    }

    if (video.paused) {
      start();
    } else {
      video.pause();
    }
  }

  if (overlay) {
    overlay.addEventListener("click", start);
  }

  if (control) {
    control.addEventListener("click", start);
  }

  if (video) {
    video.addEventListener("click", toggleByVideo);
    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("playing");
      }
    });
    video.addEventListener("pause", function () {
      if (shell) {
        shell.classList.remove("playing");
      }
    });
  }

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
