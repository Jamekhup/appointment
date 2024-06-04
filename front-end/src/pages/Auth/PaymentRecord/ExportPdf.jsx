import {
    Document,
    Page,
    Image,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
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
        borderRadius: 4,
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
});

const convertDate = (date) => {
    let newDate = date.split("-");
    return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
};

const ExportPdf = ({ data }) => {
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
                        <Text style={styles.descriptionSecond}>Treatment</Text>
                        <Text style={styles.qtySecond}>{data.treatment}</Text>
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
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>Number</Text>
                        <Text style={styles.qtySecond}>
                            {data.number ? data.number : "-"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>Cost</Text>
                        <Text style={styles.qtySecond}>
                            {data.cost ? "€ " + Number(data.cost).toLocaleString("es-ES") : "-"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Additional Payment
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.additional_payment
                                ? "€ " + Number(data.additional_payment).toLocaleString("es-ES")
                                : "-"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>Home Visit</Text>
                        <Text style={styles.qtySecond}>
                            {data.home_visit == 1 ? "Yes" : "No"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>Number 2</Text>
                        <Text style={styles.qtySecond}>
                            {data.number2 ? data.number2 : "-"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>Cost 3</Text>
                        <Text style={styles.qtySecond}>
                            {data.cost3 ? "€ " + Number(data.cost3).toLocaleString("es-ES") : "-"}
                        </Text>
                    </View>
                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Additional Payment 4
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.additional_payment_4
                                ? "€ " + Number(data.additional_payment_4).toLocaleString("es-ES")
                                : "-"}
                        </Text>
                    </View>

                    <View style={styles.rowSecond}>
                        <Text style={styles.descriptionSecond}>
                            Total Payment
                        </Text>
                        <Text style={styles.qtySecond}>
                            {data.total_payment
                                ? "€ " + Number(data.total_payment).toLocaleString("es-ES")
                                : "-"}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ExportPdf;
