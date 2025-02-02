import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './pages/Hero'
import Editor from './pages/Editor';
import './App.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
