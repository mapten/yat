import toast from 'react-hot-toast';

export const genericServerErrorConnectionToast = () => {
  toast.error('There was a problem connecting to the server. Please try again later.');
};