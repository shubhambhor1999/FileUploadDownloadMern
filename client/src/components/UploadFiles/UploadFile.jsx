import React, { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const userid = localStorage.getItem("userid");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userid", userid);
      console.log(formData);
      const { data: res } = await axios.post(
        "http://localhost:8080/api/v1/file/upload",
        formData
      );
      alert(res.message);
      console.log("File uploaded successfully.");
      setFile("");
    } catch (error) {
      console.error("Error during file upload:", error.response.data.error);
    }
  };

  return (
    <div className={styles.file_upload_container}>
      <h2>File Upload</h2>
      <label htmlFor="file-input" className={styles.file_input_label}>
        <input
          id="file-input"
          type="file"
          className={styles.file_input}
          onChange={handleFileChange}
        />
      </label>
      <h5>
        <u>{file ? file.name : "No file choosen.."}</u>
      </h5>
      <button className={styles.upload_button} onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
