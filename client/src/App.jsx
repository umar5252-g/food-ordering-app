function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center font-sans">
      <div className="text-center space-y-8 px-4">
        {/* Logo / Brand */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-brand-500/20 blur-3xl rounded-full"></div>
          <h1 className="relative text-6xl md:text-8xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              Flavor
            </span>
            <span className="text-white"> Point</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
          Your favorite meals, delivered fast. 
          <span className="text-brand-400 font-medium"> Taste the difference.</span>
        </p>

        {/* Status Badge */}
        <div className="flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-green-400 text-sm font-medium tracking-wide uppercase">
            System Online — MERN Stack Ready
          </span>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {['React', 'Vite', 'Tailwind CSS', 'Express', 'MongoDB', 'Node.js'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-300 border border-white/10 backdrop-blur-sm hover:bg-brand-500/10 hover:border-brand-500/30 hover:text-brand-400 transition-all duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
