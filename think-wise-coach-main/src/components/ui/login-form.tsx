"use client";
import { useEffect, useRef, useState } from "react";
import { User, Lock, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface SmokeyBackgroundProps {
  backdropBlurAmount?: string;
  color?: string;
  className?: string;
}

const blurClassMap: Record<BlurSize, string> = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

export function SmokeyBackground({
  backdropBlurAmount = "sm",
  color = "#1E40AF",
  className = "",
}: SmokeyBackgroundProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");

    const startTime = Date.now();
    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);

    let animationId: number;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : width / 2, isHovering ? height - mousePosition.y : height / 2);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isHovering, mousePosition, color]);

  const finalBlurClass = blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap["sm"];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className={`absolute inset-0 ${finalBlurClass}`} />
      
      {/* Animated floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float ${isDark ? 'bg-white/20' : 'bg-blue-500/30'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 animate-gradient-shift ${
        isDark 
          ? 'bg-gradient-to-br from-transparent via-primary/5 to-accent/10' 
          : 'bg-gradient-to-br from-transparent via-blue-500/5 to-cyan-500/10'
      }`} />

      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-96 h-96 rounded-full animate-pulse-slow ${isDark ? 'border-white/10' : 'border-blue-500/20'}`} />
        <div className={`absolute w-80 h-80 rounded-full animate-pulse-slow animation-delay-1000 ${isDark ? 'border-white/5' : 'border-blue-500/15'}`} />
        <div className={`absolute w-64 h-64 rounded-full animate-pulse-slow animation-delay-2000 ${isDark ? 'border-white/5' : 'border-blue-500/10'}`} />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-16 h-16 rotate-45 animate-float-reverse opacity-30 ${isDark ? 'border-white/10' : 'border-blue-500/20'}`} 
             style={{ animationDelay: '2s', animationDuration: '12s' }} />
        <div className={`absolute top-3/4 right-1/4 w-12 h-12 rounded-full animate-float opacity-20 ${isDark ? 'bg-white/5' : 'bg-blue-500/10'}`} 
             style={{ animationDelay: '4s', animationDuration: '10s' }} />
        <div className={`absolute top-1/2 left-3/4 w-8 h-8 rotate-12 animate-float-reverse opacity-25 ${isDark ? 'border-white/10' : 'border-blue-500/15'}`} 
             style={{ animationDelay: '6s', animationDuration: '14s' }} />
      </div>
    </div>
  );
}

interface LoginFormProps {
  onLogin: (userData: { email: string; name?: string }) => void;
  onSignUp: () => void;
}

export function LoginForm({ onLogin, onSignUp }: LoginFormProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Login failed");
      return;
    }

    const data = await res.json();

    onLogin({
      email: data.user.email,
      name: data.user.name,
    });
  } catch (error) {
    alert("Backend not reachable");
    console.error(error);
  }
};


  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-6">
      <motion.div 
        className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl ${
          isDark 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-white/90 border border-gray-200'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <h1 className={`text-3xl font-bold mb-2 font-heading ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
          <p className={isDark ? 'text-white/70' : 'text-gray-600'}>Sign in to continue to HealthMate</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          {/* Email Input */}
          <motion.div 
            className="relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className={`w-full rounded-xl px-12 py-4 placeholder-transparent focus:outline-none transition-all peer ${
                isDark 
                  ? 'bg-white/10 border border-white/20 text-white focus:border-white/40' 
                  : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
              placeholder="Email Address"
              required
            />
            <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
            <label
              className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                emailFocused || email
                  ? "top-1 text-xs"
                  : "top-1/2 -translate-y-1/2"
              } ${isDark ? 'text-white/70' : 'text-gray-500'}`}
            >
              Email Address
            </label>
          </motion.div>

          {/* Password Input */}
          <motion.div 
            className="relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.0 }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`w-full rounded-xl px-12 py-4 placeholder-transparent focus:outline-none transition-all peer ${
                isDark 
                  ? 'bg-white/10 border border-white/20 text-white focus:border-white/40' 
                  : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
              placeholder="Password"
              required
            />
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
            <label
              className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                passwordFocused || password
                  ? "top-1 text-xs"
                  : "top-1/2 -translate-y-1/2"
              } ${isDark ? 'text-white/70' : 'text-gray-500'}`}
            >
              Password
            </label>
          </motion.div>

          <motion.div 
            className="text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.2 }}
          >
            <button type="button" className={`text-sm transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Forgot Password?
            </button>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity group"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Divider */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.6 }}
          >
            <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
            <span className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>OR CONTINUE WITH</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
          </motion.div>

          {/* Google Login */}
          <motion.button
            type="button"
            className={`w-full font-medium py-4 rounded-xl flex items-center justify-center gap-3 transition-colors ${
              isDark 
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' 
                : 'bg-gray-50 border border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </motion.button>
        </motion.form>

        <motion.p 
          className={`text-center mt-6 ${isDark ? 'text-white/70' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.0 }}
        >
          Don't have an account?{" "}
          <button onClick={onSignUp} className={`font-semibold hover:underline ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sign Up
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
