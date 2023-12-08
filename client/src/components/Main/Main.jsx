import FileUpload from "../UploadFiles/UploadFile";
import FileList from "../FetchFiles/FetchFiles";
import styles from "./styles.module.css";
import { useState } from "react";

const Main = () => {
  const [fileView, setFileView] = useState("Upload");
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  const handleUpload = () => {
    setFileView("Upload");
  };

  const handleView = () => {
    setFileView("View");
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <div className={styles.leftdiv}>
          <h1>Files....</h1>
          <button className={styles.file_btn} onClick={handleUpload}>
            Upload Files
          </button>
          <button className={styles.file_btn} onClick={handleView}>
            My Files
          </button>
        </div>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className={styles.file_container}>
        {fileView && fileView === "Upload" ? <FileUpload /> : <FileList />}
      </div>
    </div>
  );
};

export default Main;
