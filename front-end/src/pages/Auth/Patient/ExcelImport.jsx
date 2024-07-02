import { useState } from "react";
import Modal from "../../../components/Modal";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Swal from "sweetalert2";

const ExcelImport = ({show ,close, maxWidth,handleCreate}) => {
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { user } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!file) {
            Swal.fire({
                icon: "error",
                title: "Please select a file",
                text: "You haven't uploaded any file yet.",
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post("/patient/create/excel-upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                }
            })

            
            handleCreate();
            close();
            setLoading(false);
            
            
        } catch (error) {

            handleCreate();
            close();

            if(error.response.status == 422){
                
                Swal.fire({
                    icon: "error",
                    text: "Unsupported file type or something went wrong, please try again",
                });
            }

            setLoading(false);
        }

    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <Modal show={show} onClose={close} maxWidth={maxWidth}>
            <div className="flex justify-between items-center bg-gray-300 p-2 px-4 rounded-t-md">
                <div>Import Patient List Using Excel File</div>
                <div
                    className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                    onClick={close}
                >
                    &times;
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="p-4 text-sm"
            >

                <div className="">
                    <div className="flex flex-col">
                        <label htmlFor="file">Select Excel File (.xlsx, .xls) <span className="text-red-600">*</span></label>
                        <TextInput
                            id="file"
                            type="file"
                            required
                            className="!py-1.5 w-full"
                            onChange={handleFileChange} 
                            accept=".xlsx,.xls"
                        />
                        {errors && errors.file && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.file[0]}
                            </div>
                        )}
                    </div>

                </div>
                
                


                
                <PrimaryButton
                    type={loading ? "button" : "submit"}
                    className="px-4 mt-4"
                >
                    {loading ? "Submitting..." : "Submit"}
                </PrimaryButton>
            </form>
        </Modal>
    );
}

export default ExcelImport