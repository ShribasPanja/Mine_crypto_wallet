import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const notify = (message, isDarkMode) => {
    toast.success(message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "dark:bg-gray-700 dark:text-gray-100"
    });
};
