import { GenerateFiles } from '../common/endpoints';
import API from '../common/api';
import toast from 'react-hot-toast';

export const exportFile = async (date, docType) => {
    if (!date || !docType) return;

    const obj = {
        url: GenerateFiles.ExportExcel(date, docType),
        method: 'GET', // or 'POST' depending on your backend route
        isResponseJSON: false,
    };

    try {
        const response = await API(obj);
        const blob = await response.blob();

        // 🔽 Extract filename from headers (if backend sets it)
        const disposition = response.headers.get('Content-Disposition');
        let filename = `expenses-${date}.${docType === 'excel' ? 'xlsx' : 'pdf'}`;

        if (disposition && disposition.includes('filename=')) {
            filename = disposition.split('filename=')[1].replace(/['"]/g, '');
        }

        // 🪄 Create a temporary link to trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // 🧹 Cleanup
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        toast.error(error?.message || 'Failed to download file')
    }
};