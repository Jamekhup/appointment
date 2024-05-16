import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
const ExportPdf = () => {

    const {id} = useParams();
    
    return (
    <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            <Text>Hello, {id}</Text>
            <Text>{`const greet = "Hello, World!";`}</Text>
        </View>
        </Page>
    </Document>
    );
}

export default ExportPdf