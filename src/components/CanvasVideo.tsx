import { useEffect, useRef } from "react";

interface CanvasVideoProps {
  src: string;
  fallbackMp4?: string;
  className?: string;
  style?: React.CSSProperties;
  isPlaying?: boolean;
}

// Target 24fps fallback when requestVideoFrameCallback is unavailable
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Exact same black-keying + feather formula as the original 2D pixel loop (THRESHOLD = 55),
// executed on the GPU to eliminate main-thread getImageData/putImageData stalls.
const FRAG_SRC = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
void main() {
  vec4 c = texture2D(u_tex, v_uv);
  float maxRGB = max(c.r, max(c.g, c.b));
  float threshold = 55.0 / 255.0;
  float alpha = maxRGB < threshold ? (maxRGB / threshold) : 1.0;
  gl_FragColor = vec4(c.rgb * alpha, alpha);
}
`;

interface WebGLRenderer {
  gl: WebGLRenderingContext;
  tex: WebGLTexture;
  program: WebGLProgram;
  buf: WebGLBuffer;
  render: (video: HTMLVideoElement, w: number, h: number) => void;
  dispose: () => void;
}

function createWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer | null {
  try {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });
    if (!gl) return null;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }

    const buf = gl.createBuffer();
    if (!buf) {
      gl.deleteProgram(program);
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    if (!tex) {
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      return null;
    }
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);

    return {
      gl,
      tex,
      program,
      buf,
      render(video: HTMLVideoElement, w: number, h: number) {
        if (gl.isContextLost()) return;
        try {
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
          }
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        } catch {
          // Cross-origin or transient video frame error — skip this frame
        }
      },
      dispose() {
        if (!gl.isContextLost()) {
          gl.deleteTexture(tex);
          gl.deleteBuffer(buf);
          gl.deleteProgram(program);
        }
      },
    };
  } catch {
    return null;
  }
}

export function CanvasVideo({
  src,
  fallbackMp4,
  className,
  style,
  isPlaying = true,
}: CanvasVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container) return;

    // Force autoplay attributes on DOM element (required for iOS Safari)
    video.muted = true;
    (video as HTMLVideoElement & { defaultMuted?: boolean }).defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    // Prefer GPU WebGL shader; fall back to capped 2D canvas if WebGL is unavailable
    let webgl = createWebGLRenderer(canvas);
    const ctx2d = webgl
      ? null
      : canvas.getContext("2d", { alpha: true, willReadFrequently: true });

    let rafId = 0;
    let vfcId = 0;
    let isRunning = false;
    let isInView = true;
    let isTabVisible = document.visibilityState !== "hidden";
    let lastFrameTime = 0;

    const getTargetSize = () => {
      const vw = video.videoWidth || 480;
      const vh = video.videoHeight || 480;
      const maxWidth = webgl
        ? window.innerWidth < 768
          ? 540
          : 900
        : window.innerWidth < 768
          ? 360
          : 560;
      if (vw <= maxWidth) return { w: vw, h: vh };
      const scale = maxWidth / vw;
      return { w: Math.round(vw * scale), h: Math.round(vh * scale) };
    };

    const drawFrame = () => {
      if (video.readyState < 2) return;
      const { w, h } = getTargetSize();

      if (webgl) {
        webgl.render(video, w, h);
        return;
      }

      if (!ctx2d) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx2d.clearRect(0, 0, w, h);
      ctx2d.drawImage(video, 0, 0, w, h);

      try {
        const imgData = ctx2d.getImageData(0, 0, w, h);
        const d = imgData.data;
        const len = d.length;
        const THRESHOLD = 55;

        for (let i = 0; i < len; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const maxRGB = r > g ? (r > b ? r : b) : g > b ? g : b;
          if (maxRGB < THRESHOLD) {
            d[i + 3] = Math.round((maxRGB / THRESHOLD) * 255);
          }
        }
        ctx2d.putImageData(imgData, 0, 0);
      } catch {
        // Cross-origin or security error — silently continue without keying
      }
    };

    const hasVfc = typeof (video as HTMLVideoElement & { requestVideoFrameCallback?: unknown }).requestVideoFrameCallback === "function";

    const scheduleNext = () => {
      if (!isRunning) return;
      if (hasVfc) {
        vfcId = (video as HTMLVideoElement & {
          requestVideoFrameCallback: (cb: (now: number) => void) => number;
        }).requestVideoFrameCallback((now) => {
          if (!isRunning) return;
          // On WebGL, draw every native video frame (cheap GPU pass); throttle 2D CPU fallback to 24fps
          if (webgl || now - lastFrameTime >= FRAME_INTERVAL) {
            lastFrameTime = now;
            drawFrame();
          }
          scheduleNext();
        });
      } else {
        rafId = requestAnimationFrame((timestamp) => {
          if (!isRunning) return;
          const elapsed = timestamp - lastFrameTime;
          const interval = webgl ? 32 : FRAME_INTERVAL;
          if (elapsed >= interval) {
            lastFrameTime = timestamp - (elapsed % interval);
            drawFrame();
          }
          scheduleNext();
        });
      }
    };

    const stopLoop = () => {
      isRunning = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (vfcId && typeof (video as HTMLVideoElement & { cancelVideoFrameCallback?: (id: number) => void }).cancelVideoFrameCallback === "function") {
        (video as HTMLVideoElement & { cancelVideoFrameCallback: (id: number) => void }).cancelVideoFrameCallback(vfcId);
        vfcId = 0;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        lastFrameTime = 0;
        drawFrame();
        scheduleNext();
      }
    };

    let interactionListenerAttached = false;
    const retryOnInteraction = () => {
      interactionListenerAttached = false;
      window.removeEventListener("touchstart", retryOnInteraction);
      window.removeEventListener("click", retryOnInteraction);
      window.removeEventListener("scroll", retryOnInteraction);
      syncPlayback();
    };

    const syncPlayback = () => {
      const shouldRun = isPlaying && isInView && isTabVisible;
      if (!shouldRun) {
        stopLoop();
        if (!video.paused) video.pause();
        return;
      }

      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            if (isPlaying && isInView && isTabVisible) startLoop();
          })
          .catch(() => {
            if (!interactionListenerAttached) {
              interactionListenerAttached = true;
              window.addEventListener("touchstart", retryOnInteraction, { once: true, passive: true });
              window.addEventListener("click", retryOnInteraction, { once: true, passive: true });
              window.addEventListener("scroll", retryOnInteraction, { once: true, passive: true });
            }
          });
      } else {
        startLoop();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isInView = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "150px" }
    );
    observer.observe(container);

    const onVisibilityChange = () => {
      isTabVisible = document.visibilityState !== "hidden";
      syncPlayback();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stopLoop();
    };
    const onContextRestored = () => {
      webgl = createWebGLRenderer(canvas);
      syncPlayback();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    video.addEventListener("loadedmetadata", syncPlayback);
    video.addEventListener("canplay", syncPlayback);
    syncPlayback();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      video.removeEventListener("loadedmetadata", syncPlayback);
      video.removeEventListener("canplay", syncPlayback);
      window.removeEventListener("touchstart", retryOnInteraction);
      window.removeEventListener("click", retryOnInteraction);
      window.removeEventListener("scroll", retryOnInteraction);
      video.pause();
      webgl?.dispose();
    };
  }, [src, fallbackMp4, isPlaying]);

  const isWebm = src.endsWith(".webm") || src.includes("webm");

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        background: "transparent",
        // NO isolation — blend mode must reach parent background
        isolation: "auto",
        ...style,
      }}
    >
      {/* Hidden video element — draws into canvas, never shown directly */}
      <video
        ref={videoRef}
        autoPlay={isPlaying}
        muted
        loop
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        controls={false}
        preload="auto"
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
      >
        {isWebm && <source src={src} type="video/webm" />}
        {fallbackMp4 && <source src={fallbackMp4} type="video/mp4" />}
        {!isWebm && !fallbackMp4 && <source src={src} type="video/mp4" />}
      </video>

      {/* Canvas renders keyed transparent frames — black pixels removed */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: "transparent",
          // NO willChange or transform — these break blend mode compositing
        }}
      />
    </div>
  );
}
