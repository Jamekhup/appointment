import { PDFViewer } from '@react-pdf/renderer';
import ExportPdf from './ExportPdf';

const PaymentExportPdf = ({data}) => {
  return (
    <div>
      <PDFViewer style={{ width: '100%', height: '850px' }}>
        <ExportPdf data={data}/>
      </PDFViewer>
    </div>
  )
}

export default PaymentExportPdf