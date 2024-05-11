import MetaTitle from "../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Modal from "../../components/Modal";
import TextInput from "../../components/TextInput";
import PrimaryButton from "../../components/PrimaryButton";
import axios from "../../axios";
import useAuthContext from "../../context/AuthContext";

const Dashboard = () => {
    return (
        <>
            <MetaTitle title="Dashboard"/>
        </>
    );
};

export default Dashboard;
