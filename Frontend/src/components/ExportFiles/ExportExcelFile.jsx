import { exportFile } from "../../store/actions/exportFiles.actions";
import { useGlobalContext } from '../GlobalContext';

const ExportButton = ({type='excel'}) => {
    const { selectedDate } = useGlobalContext();
    const handleExport = (type) => {
        exportFile(selectedDate, type);
    };

    return (
        <div className="flex flex-col">
            {
                (type==='excel') ? (
                    <button onClick={() => handleExport('excel')}>Download Excel</button>
                ) : (
                    <button onClick={() => handleExport('pdf')}>Download PDF</button>

                )
            }
            
        </div>
    );
};

export default ExportButton;
