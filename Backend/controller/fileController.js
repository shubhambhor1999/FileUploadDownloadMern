const File = require("../models/fileModels");
const fs = require("fs");
const path = require("path");

// File Upload Controller
const fileUploadController = async (req, res) => {
  try {
    const { filename } = req.file;
    const user = req.body.userid;
    const newFile = new File({
      user,
      filename,
      code: filename.split("_")[0],
    });

    await newFile.save();
    res.json({ message: "File uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Fetch File Controller

const fileFetchController = async (req, res) => {
  try {
    const files = await File.find({ user: req.params.userid });
    return res.json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// File download Controller
const fileDownloadController = async (req, res) => {
  try {
    const code = req.params.code;
    const file = await File.findOne({ code });
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }
    if (file.filename.split("_")[0] != code) {
      return res.status(404).json({ error: "Incorrect code entered." });
    }
    const filePath = path.join(__dirname, "..", "uploads", file.filename);
    //console.log(filePath);
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ error: "File not found at the specified path." });
    }
    res.download(filePath, file.filename);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
//File Detetion Controller
const fileDeleteController = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = `uploads/${file.filename}`;
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      try {
        await File.findByIdAndDelete(fileId);
        return res.json({ message: "File deleted successfully" });
      } catch (dbError) {
        console.error("Error deleting file from the database:", dbError);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  fileUploadController,
  fileDownloadController,
  fileFetchController,
  fileDeleteController,
};
