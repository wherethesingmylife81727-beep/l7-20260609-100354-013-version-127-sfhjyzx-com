function setupPlayer(videoUrl) {
  const video = document.querySelector('.movie-video');
  const overlay = document.querySelector('.player-overlay');
  let attached = false;

  if (!video || !overlay || !videoUrl) {
    return;
  }

  function attachStream() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      window.activePlayer = hls;
      return;
    }

    video.src = videoUrl;
  }

  function startPlayback() {
    attachStream();
    overlay.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  overlay.addEventListener('click', startPlayback);

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });
}
