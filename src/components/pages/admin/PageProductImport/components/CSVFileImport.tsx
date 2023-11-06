import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

enum ErrorCode {
  Forbidden = 403,
  Unauthorized = 401,
}

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    if (!file) return;

    try {
      const authToken = localStorage.getItem("authorization_token");
     
      const headers = {
        ...(authToken && {
          Authorization: `Basic ${authToken}`,
        }),
      };

      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers,
      });

      console.log("File to upload: ", file?.name);
      console.log("Uploading to: ", response.data);

      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });

      console.log("Result: ", result);
      setFile(null);
    } catch (e) {
   
      if (axios.isAxiosError(e)) {
        switch (e?.response?.status) {
          case ErrorCode.Unauthorized:
            alert("User is not authorized");
            break;
          case ErrorCode.Forbidden:
            alert("Authorization is not passed");
            break;
          default:
            throw e;
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}