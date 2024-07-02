import {
    Document,
    Page,
    Image,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";
import { useState } from "react";

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gapWidth: "3px",
        fontSize: "10px",
        marginBottom: 2,
    },

    patient: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gapWidth: "3px",
        fontSize: "10px",
    },

    patientInfo: {
        marginTop: 8,
        fontSize: 10,
        padding: 5,
        textAlign: "center",
        backgroundColor:'#A5f3fC'
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        height: 24,
        fontSize: 10,
    },
    description: {
        width: "60%",
        textAlign: "left",
        borderColor: "#bfb5b5",
        borderWidth: 1,
        padding: 4,
        
    },
    qty: {
        width: "40%",
        borderColor: "#bfb5b5",
        borderWidth: 1,
        padding: 4,
    },

    rowSecond: {
        flexDirection: "row",
        alignItems: "center",
        height: 24,
        fontSize: 10,
        marginTop: "-4px",
    },

    descriptionSecond: {
        width: "60%",
        textAlign: "left",
        borderBottomColor: "#bfb5b5",
        borderLeftColor: "#bfb5b5",
        borderRightColor: "#bfb5b5",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        padding: 4,
    },
    qtySecond: {
        width: "40%",
        borderBottomColor: "#bfb5b5",
        borderLeftColor: "#bfb5b5",
        borderRightColor: "#bfb5b5",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        padding: 4,
    },

    service: {
        flexDirection: "row",
        alignItems: "center",
        height: 24,
        fontSize: 10,
        marginBottom: '-4px',
    },

    total: {
        flexDirection: "row",
        alignItems: "center",
        height: 24,
        fontSize: 10,
        marginBottom: '-4px',
        marginTop: '-4px',
    },

    totalTxt: {
        width: "79%",
        borderBottomColor: "#bfb5b5",
        borderLeftColor: "#bfb5b5",
        borderRightColor: "#bfb5b5",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingTop: 8,
        paddingBottom: 4,
        textAlign:'center'
    },
    totalPrice: {
        width: "22.5%",
        borderBottomColor: "#bfb5b5",
        borderLeftColor: "#bfb5b5",
        borderRightColor: "#bfb5b5",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingTop: 8,
        paddingBottom: 4,
        paddingLeft: 3,
    }
});

const convertDate = (date) => {
    let newDate = date.split("-");
    return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
};


const ExportPdf = ({ data }) => {
    
    const calculateTotal = () => {
        let getTotal =  JSON.parse(data.treatment).reduce((acc, item) =>  item.total_patient_price ? acc  + Number(item.total_patient_price) : acc + (1 * Number(item.price)), 0);
        let toReturn = Number(getTotal) + Number(data.charges);
        return toReturn;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: "14px",
                            marginBottom: "40px",
                        }}
                    >
                        Payment Record
                    </Text>

                    <View style={styles.header}>
                        <View style={styles.patient}>
                            <Text>Patient Name: </Text>
                            <Text>
                                {data.patient.title} {data.patient.first_name}{" "}
                                {data.patient.last_name}
                            </Text>
                        </View>

                        <View style={styles.patient}>
                            <Text>Issue Date: </Text>
                            <Text>{convertDate(data.issue_date)}</Text>
                        </View>
                    </View>

                    <View style={styles.header}>
                        <View style={styles.patient}>
                            <Text>Received By: </Text>
                            <Text>{data.received_by}</Text>
                        </View>

                        <View style={styles.patient}>
                            <Text>Received At: </Text>
                            <Text>{convertDate(data.received_date)}</Text>
                        </View>
                    </View>

                    <Text style={styles.patientInfo}>Patient Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.description}>
                            Patient Full Name
                        </Text>
                        <Text style={styles.qty}>
                            {data.patient.title} {data.patient.first_name}{" "}
                            {data.patient.last_name}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Date Of Birth
                        </Text>
                        <Text style={styles.qtySecond}>{convertDate(data.patient.dob)}</Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Email Address
                        </Text>
                        <Text style={styles.qtySecond}>{data.patient.email}</Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Phone Number
                        </Text>
                        <Text style={styles.qtySecond}>{data.patient.phone}</Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>Address</Text>
                        <Text style={styles.qtySecond}>
                            {data.patient.street}
                            {", "}
                            {data.patient.house_number}
                            {", "}
                            {data.patient.city}
                            {", "}
                            {data.patient.postal_code}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            House Doctor
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.patient.house_doctor
                                ? data.patient.house_doctor
                                : "-"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Recommended Doctor
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.patient.recommended_doctor
                                ? data.patient.recommended_doctor
                                : "-"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Insurance Company
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.patient.health_insurance_company ? data.patient.health_insurance_company : '-'}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Treatment in Six Months
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.patient.treatment_in_6_month == 1
                                ? "Yes"
                                : "No"}
                        </Text>
                    </View>

                    {/* record info */}

                    <Text style={styles.patientInfo}>Payment Record</Text>
                    <View style={styles.row}>
                        <Text style={styles.description}>Issue Date</Text>
                        <Text style={styles.qty}>{convertDate(data.issue_date)}</Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>Therapist</Text>
                        <Text style={styles.qtySecond}>{data.user.name}</Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Doctor Name
                        </Text>
                        <Text style={styles.qtySecond}>{data.doctor_name ? data.doctor_name : '-'}</Text>
                    </View>

                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Full Covered By Insurance Company
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.full_covered_by_insurance_company == 1
                                ? "Yes"
                                : "No"}
                        </Text>
                    </View>

                    {/* treatment service info */}
                    <Text style={styles.patientInfo}>Treatment Service Information</Text>

                    <View style={styles.service}>
                        <Text style={styles.description}>Treatment Service Name</Text>
                        <Text style={styles.qty}>Price</Text>
                        <Text style={styles.qty}>Number</Text>
                        <Text style={styles.qty}>Total Pirce</Text>
                    </View>
                    {
                        JSON.parse(data.treatment).map((t,i) => (

                            <View style={styles.service} key={i}>
                                <Text style={styles.description}>{t.name}</Text>
                                <Text style={styles.qty}>{"€ " + Number(t.price).toLocaleString("es-ES")}</Text>
                                <Text style={styles.qty}>{t.number ? t.number : 1}</Text>
                                <Text style={styles.qty}>{t.total_patient_price ? "€ " + Number(t.total_patient_price).toLocaleString("es-ES") : "€ " + Number(t.price).toLocaleString("es-ES")}</Text>
                            </View>
                        ))
                    }

                    <View style={styles.total}>
                        <Text style={styles.totalTxt}>Total + Service Charges ({"€ " + data.charges})</Text>
                        <Text style={styles.totalPrice}>{data.full_covered_by_insurance_company == 1 ? "€ " + 0 : "€ " + calculateTotal()}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ExportPdf;
