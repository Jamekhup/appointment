import { useState } from 'react';
import Modal from '../../../components/Modal';
import TextInput from '../../../components/TextInput';
import PrimaryButton from '../../../components/PrimaryButton';
import Swal from "sweetalert2";
import useAuthContext from "../../../context/AuthContext";
import axios from '../../../axios';



const CreateCharges = ({
    show,
    close,
    maxWidth,
    handleCreate,
}) => {

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!amount){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter amount',
            });
        }else{

            setLoading(true);

            try {
                axios.post('/setting/create-service-charges',{
                    amount: amount,
                },{
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }).then((res) => {

                    if(res.data.status == 'success'){

                        handleCreate();
                        close();
                        setLoading(false);

                    }else{
                        setLoading(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong. Please try again',
                        });
                    }
                })
            } catch (error) {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again',
                });
                
            }

        }
    }

  return (
    <Modal show={show} onClose={close} maxWidth={maxWidth}>
        <div>
            <div className="flex justify-between items-center bg-gray-300 p-2 px-2 rounded-t-md">
                <div>Add New Service Charges</div>
                <div
                    className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                    onClick={close}
                >
                    &times;
                </div>
            </div>

            <div className=" px-2 my-2 text-sm">
                <form onSubmit={handleSubmit} className='flex flex-col ga-y-3'>
                    <label>
                        Service Charges Amount{" "}
                        <span className="text-red-600">
                            *
                        </span>
                    </label>
                    <TextInput
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        placeholder="Example - 10"
                        autoFocus
                    />
                    {
                        !loading ? (
                            <PrimaryButton className='mt-3 w-fit' type="submit">
                                Submit
                            </PrimaryButton>
                        ):(
                            <PrimaryButton className='mt-3 w-fit animate-pulse' type="button" disabled>
                                Submitting...
                            </PrimaryButton>
                        )
                    }
                </form>
            </div>

            
        </div>
    </Modal>
  )
}

export default CreateCharges