import { PDFViewer } from '@react-pdf/renderer';
import ExportPdf from './ExportPdf';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import Header from "../../../components/MetaTitle";

const PaymentExportPdf = () => {
    const { id } = useParams();
    const { user } = useAuthContext();

    const [data, setData] = useState(null);
    const navigate =  useNavigate();

    const fetchData = () => {
       
        try {
            axios.get(`/payment-record/edit/${id}`,{
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }).then((res) => {
                if(res.data.status == 'success'){
                    setData(res.data.payment);
                }
    
                if(res.data.status == 'fail'){
                    navigate('/app/payments');
                }
            })
        } catch (error) {
            if(error.response.status == 422){
                navigate('/not-found');
            }
        }
    
        
    }
    
    useEffect(() => {
        fetchData();
    },[]);

   if(data){
    return (
        <div>
            <Header title="Export Payment Record"/>
          <PDFViewer style={{ width: '100%', height: '850px' }}>
            <ExportPdf data={data}/>
          </PDFViewer>
        </div>
      )
   }else{
    return <Loading/>;
   }
}

export default PaymentExportPdf