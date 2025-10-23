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
                    <button
                        onClick={() => handleExport('excel')}
                        className="active:scale-95 transition-transform rounded-lg"
                    >
                        Export as Excel
                    </button>
                ) : (
                    <button
                        onClick={() => handleExport('pdf')}
                        className="active:scale-95 transition-transform rounded-lg"
                    >
                        Export as PDF
                    </button>

                )
            }
            
        </div>
    );
};

export default ExportButton;
