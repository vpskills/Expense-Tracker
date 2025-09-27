import { HashLoader } from 'react-spinners';

const CustomLoader = ({ size = 30, color = 'white', className }) => {
  return (
    <div className={`flex justify-center items-center w-full ${className}`}>
      <HashLoader size={size} color={color} />
    </div>
  );
};

export default CustomLoader;
