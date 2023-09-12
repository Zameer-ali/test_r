import { Box, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import { Logo } from "../assets";
import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect } from 'react';
import { saveAs } from "file-saver";


function QrViewer() {
  const search = useLocation().search;
  var querystring = window.location.href;
  var querystrings = querystring.split("?", 2);
  var qrCodeUrl = querystrings[1];
  console.log("🚀 ~ file: qr-viewer.js:7 ~ QrViewer ~ parts", querystrings);

  const handleClick = () => {
    let url = "https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
    saveAs(url, qrCodeUrl + ".png");
  }

  useEffect(() => {
    document.title = 'GAMA - QR-CODE - ' + qrCodeUrl;
  }, []);

  return (
    <Stack
    >
      <div style={{ margin: "12px 24px" }}>
        <img src={Logo} alt="logo" width="150px" />
        <div><h1>Download QR-Code</h1></div>
      </div>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Box
          maxWidth="450px"
        >
         
          {/* <button onClick={handleClick}> */}
          {/* Todo: Download image by click */}
            <QRCodeCanvas
              size={512}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrCodeUrl}
              level={"H"}
              fgColor="#010000"
              includeMargin={true}

              imageSettings={{
                src: Logo,
                x: undefined,
                y: undefined,
                height: 48,
                width: 110,
                excavate: true
              }} />
          {/* </button> */}
          <p
            style={{
              color: "#B0B0B0",
              textAlign: "center",
              marginTop: "1  0px",
            }}
          >
            {qrCodeUrl}
          </p>
        </Box>
      </Box>
    </Stack>
  );
}

export default QrViewer;