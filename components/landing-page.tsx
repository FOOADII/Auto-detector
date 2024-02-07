import { Link } from 'lucide-react';
import React from 'react';
//import { Link } from 'react-router-dom'; // Make sure to import Link from react-router-dom

const LandingPage: React.FC = () => {
  // Add any additional state or functionality as needed
  const handleButtonClick = () => {
    // You can add more functionality here
    console.log('Button clicked! Redirecting to the main app.');
    // You can use a router link or other navigation method here
  };
  return (
    <div className="landing-page">
      <h1>Welcome to Auto Detector and Auto-recorder Website</h1>
      <p>This web is made from Tensorflow Model of Object Detector </p>
      {/* Example button with additional functionality
      <button onClick={handleButtonClick}>Click me</button>
 */}
      {/* Example link to navigate to the main app 
      <Link to="/home">Go to Main App</Link>*/}
    </div>
  );
};

export default LandingPage;
