
import HomePage from './HomePage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page
    navigate('/', { replace: true });
  }, [navigate]);
  
  return <HomePage />;
};

export default Index;
