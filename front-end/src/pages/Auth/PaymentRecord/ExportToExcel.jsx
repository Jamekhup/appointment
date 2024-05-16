import { faFileExcel} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = ({ apiData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button className="inline-flex items-center gap-2 justify-center px-4 py-2 bg-blue-300 border border-transparent rounded-md
    font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 focus:bg-blue-400
    focus:outline-none focus:ring-0 focus:ring-blue-400 focus:ring-offset-2 transition ease-in-out
    duration-150"
    onClick={(e) => exportToCSV(apiData, fileName)}>
        <FontAwesomeIcon icon={faFileExcel} />
        <span>Export</span>
    </button>
  );
};


