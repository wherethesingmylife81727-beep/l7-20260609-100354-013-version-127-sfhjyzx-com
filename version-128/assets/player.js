(function () {
  function initPlayer(video) {
    var source = video.querySelector('source');
    var streamUrl = source ? source.getAttribute('src') : '';
    var wrap = video.closest('.player-wrap');
    var startButton = wrap ? wrap.querySelector('.player-start') : null;
    var attached = false;

    function launch() {
      if (startButton) {
        startButton.classList.add('is-hidden');
      }
      if (!attached && streamUrl && window.Hls && window.Hls.isSupported() && !video.canPlayType('application/vnd.apple.mpegurl')) {
        var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
        attached = true;
        return;
      }
      if (streamUrl && !video.currentSrc && video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      }
      attached = true;
      video.play().catch(function () {});
    }

    if (startButton) {
      startButton.addEventListener('click', launch);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        launch();
      }
    });
  }

  document.querySelectorAll('.js-hls-player').forEach(initPlayer);
})();
