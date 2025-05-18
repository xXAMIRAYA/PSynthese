// import HomePage from './HomePage';
//  import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ChatFeature from '@/components/chat/ChatFeature';

// const Index = () => {
//   const navigate = useNavigate();
  
//    useEffect(() => {
//     navigate('/', { replace: true });
//   }, [navigate]);
  
//   return (
//     <>
//       {/* <HomePage />  */}
//       <ChatFeature />
//     </>
//   );
// };

import HomePage from './HomePage';
import ChatFeature from '@/components/chat/ChatFeature';
import { AuthProvider } from '@/contexts/AuthContext'; // Si vous utilisez un provider

const Index = () => {
  return (
    <>
      <HomePage />
      <ChatFeature />
    </>
  );
};

export default Index;