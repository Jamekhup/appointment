import Modal from "../../../components/Modal";
import TextInput from "../../../components/TextInput";

const CreateAppointment = ({ show, close, maxWidth }) => {
    return (
        <Modal show={show} onClose={close} maxWidth={maxWidth}>
            <form className="p-4">
                <div className="flex justify-between items-center">
                    <div>Create New Appointment</div>
                    <div
                        className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                        onClick={close}
                    >
                        &times;
                    </div>
                </div>
                <div>
                    <TextInput type="text" placeholder="Enter" />
                </div>
            </form>
        </Modal>
    );
};

export default CreateAppointment;
