import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [code, setCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const handleClick = (code) => {
    setCode(code);
    console.log(showComponent);
    setShowComponent(!showComponent);
  };
  useEffect(() => {
    const userid = localStorage.getItem("userid");
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/file/fetchfiles/${userid}`
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error.response.data.error);
      }
    };

    fetchFiles();
  }, []);

  //Download File component
  const FileDownload = (props) => {
    const [code, setCode] = useState(props.code);
    const [showModal, setShowModal] = useState(true);
    const [error, setError] = useState("");
    const handleDownload = async () => {
      try {
        if (code !== props.code) {
          setError("Code Mismatch");
        } else {
          const res = await axios.get(
            `http://localhost:8080/api/v1/file/download/${code}`,
            { responseType: "blob" }
          );
          const blob = new Blob([res.data], { type: res.data.type });
          console.log(res);
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href);
          console.log(res.message);
          setShowComponent(!showComponent);
          setShowModal(false);
        }
      } catch (error) {
        console.error("Error during file download:", error.response.data.error);
      }
    };

    const closeModal = () => {
      setShowModal(false);
    };
    return (
      <div>
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <span className={styles.close} onClick={closeModal}>
                &times;
              </span>
              <h2>File Download</h2>
              <h5>{props.code}</h5>
              <input
                type="text"
                placeholder="Enter Above code"
                onChange={(e) => setCode(e.target.value)}
              />
              {error && <div className={styles.error_msg}>{error}</div>}
              <button onClick={handleDownload}>Download</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  //Delete File Component
  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/file/deletefile/${fileToDelete._id}`
      );
      console.log(response.data.message);

      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.code !== fileToDelete.code)
      );

      setShowConfirmation(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error.response.data.error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setFileToDelete(null);
  };
  return (
    <div>
      {files.length === 0 ? (
        <h1>No files uploaded yet.</h1>
      ) : (
        <div>
          <h2>File List</h2>
          <table className={styles.fileTable}>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td>
                    {file.filename.substring(file.filename.indexOf("_") + 1)}
                  </td>
                  <td>
                    <button
                      className={styles.downloadButton}
                      onClick={() => handleClick(file.code)}
                    >
                      Download
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(file)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      ;{showComponent ? <FileDownload code={code} /> : null}
      {showConfirmation && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the file "{fileToDelete.filename}
              "?
            </p>
            <div className={styles.confirmation_buttons}>
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
