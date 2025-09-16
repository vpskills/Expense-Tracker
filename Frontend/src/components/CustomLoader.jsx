import { HashLoader } from 'react-spinners';

const CustomLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <HashLoader size={30} color={'white'}/>
    </div>
  );
};

export default CustomLoader;
