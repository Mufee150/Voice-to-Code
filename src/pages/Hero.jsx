import { useNavigate } from 'react-router-dom';
import '../index.css';
import heroImg from '../assets/hero-img.png';

export default function Hero() {
  const navigate = useNavigate(); // Hook for navigation

  const handleButtonClick = () => {
    navigate('/editor'); // Navigate to /editor page when button is clicked
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center text-blue px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }}></div>

      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)] pointer-events-none"></div>

      <div className="max-w-4xl text-center z-10 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg my-10">
          Code with Your Voice
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-900 drop-shadow-md animate-slide-up my-8">
          Empowering developers with disabilities to write code effortlessly using voice commands.
        </p>
        <div className="mt-6 ">
          <button
            onClick={handleButtonClick}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 opacity-30 blur-2xl rounded-full animate-float"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500 opacity-30 blur-2xl rounded-full animate-float delay-500"></div>
    </section>
  );
}
