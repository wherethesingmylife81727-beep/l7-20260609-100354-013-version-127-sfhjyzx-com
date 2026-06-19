(function () {
  var mounted = false;

  window.MoviePlayer = {
    mount: function (url) {
      if (mounted) return;
      mounted = true;
      var video = document.querySelector("[data-player-video]");
      var button = document.querySelector("[data-player-button]");
      if (!video || !url) return;
      var attached = false;
      var hls = null;

      function attach() {
        if (attached) return;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          video.src = url;
        }
        attached = true;
      }

      function start() {
        attach();
        var p = video.play();
        if (p && typeof p.then === "function") {
          p.then(function () {
            if (button) button.classList.add("is-hidden");
          }).catch(function () {
            if (button) button.classList.add("is-hidden");
          });
        } else if (button) {
          button.classList.add("is-hidden");
        }
      }

      function toggle() {
        if (!attached || video.paused) {
          start();
        } else {
          video.pause();
        }
      }

      if (button) button.addEventListener("click", start);
      video.addEventListener("click", toggle);
      video.addEventListener("play", function () {
        if (button) button.classList.add("is-hidden");
      });
      video.addEventListener("pause", function () {
        if (button && video.currentTime === 0) button.classList.remove("is-hidden");
      });
      window.addEventListener("beforeunload", function () {
        if (hls) hls.destroy();
      });
    }
  };
})();
