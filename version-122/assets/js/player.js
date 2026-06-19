var playerInstances = new WeakMap();

function setError(shell, message) {
  var error = shell.querySelector(".player-error");

  if (error) {
    error.textContent = message;
    error.classList.add("is-visible");
  }
}

function preparePlayer(shell) {
  if (playerInstances.has(shell)) {
    return Promise.resolve(playerInstances.get(shell));
  }

  var video = shell.querySelector("video");
  var source = shell.getAttribute("data-video");

  if (!video || !source) {
    setError(shell, "播放暂时不可用，请稍后再试。");
    return Promise.resolve(null);
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
    playerInstances.set(shell, video);
    return Promise.resolve(video);
  }

  var Hls = window.Hls;

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    playerInstances.set(shell, video);
    return Promise.resolve(video);
  }

  setError(shell, "播放暂时不可用，请稍后再试。");
  return Promise.resolve(null);
}

function startPlayback(shell) {
  var cover = shell.querySelector(".player-cover");

  preparePlayer(shell).then(function (video) {
    if (!video) {
      return;
    }

    if (cover) {
      cover.classList.add("is-hidden");
    }

    var playTask = video.play();

    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(function () {
        if (cover) {
          cover.classList.remove("is-hidden");
        }
      });
    }
  });
}

document.querySelectorAll(".player-shell").forEach(function (shell) {
  var cover = shell.querySelector(".player-cover");
  var video = shell.querySelector("video");

  if (cover) {
    cover.addEventListener("click", function () {
      startPlayback(shell);
    });
  }

  if (video) {
    video.addEventListener("click", function () {
      if (!playerInstances.has(shell)) {
        startPlayback(shell);
      }
    });

    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
  }
});
