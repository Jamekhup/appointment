import { useState } from "react";
import Modal from "../../../components/Modal";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";

const CreateService = ({ show, close, maxWidth, handleCreate }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post(
                "/service/create",
                {
                    name,
                    price,
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                handleCreate(response.data.data);
                setLoading(false);
                setName("");
                setPrice("");
                setDescription("");
                close();
            })
            .catch((error) => {
                setErrors(error.response.data.message);
                setLoading(false);
            });
    };

    return (
        <Modal show={show} onClose={close} maxWidth={maxWidth}>
            <div className="flex justify-between items-center bg-gray-300 p-2 px-4 rounded-t-md">
                <div>Create New Service</div>
                <div
                    className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                    onClick={close}
                >
                    &times;
                </div>
            </div>
            <form onSubmit={handleSubmit} className="p-3 text-sm">
                <div className="grid md:grid-cols-2 gid-cols-1 gap-2.5 items-start">
                    <div className="flex flex-col">
                        <label htmlFor="name">Service Name</label>
                        <TextInput
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Service Name"
                        />
                        {errors && errors.name && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.name[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="price">Price (optional)</label>
                        <TextInput
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price"
                            step="any"
                        />
                        {errors && errors.price && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.price[0]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3">
                    <label htmlFor="description">Description (optional)</label>
                    <textarea
                        value={description}
                        id="description"
                        rows={7}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 
                    focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm w-full"
                    ></textarea>
                </div>

                <PrimaryButton
                    type={loading ? "button" : "submit"}
                    className=" px-4 mt-2"
                >
                    {loading ? "Creating..." : "Create"}
                </PrimaryButton>
            </form>
        </Modal>
    );
};

export default CreateService;
