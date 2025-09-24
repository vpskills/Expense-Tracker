import { HashLoader } from 'react-spinners';

const CustomLoader = ({ size = 30, color = 'white', childern }) => {
  return (
    <div className="flex justify-center items-center w-full min-h-screen h-full">
      <HashLoader size={size} color={color} />
    </div>
  );
};

export default CustomLoader;
