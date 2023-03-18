import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { useState } from "react";
import fontkit from "@pdf-lib/fontkit";
import pinFileToIPFS from "./utils/pinFileToIPFS";
import { ABI, contractAddress } from "./utils/constants";

const generatePDF = async (name) => {
  // const existingPdfBytes = await fetch("Certificate.pdf").then((res) =>
  //   res.arrayBuffer()
  // );
  // // Load a PDFDocument from the existing PDF bytes
  // const pdfDoc = await PDFDocument.load(existingPdfBytes);
  // pdfDoc.registerFontkit(fontkit);
  // //get font
  // const fontBytes = await fetch("Sanchez-Regular.ttf").then((res) =>
  //   res.arrayBuffer()
  // );
  // // Embed our custom font in the document
  // const SanChezFont = await pdfDoc.embedFont(fontBytes);
  // // Get the first page of the document
  // const pages = pdfDoc.getPages();
  // const firstPage = pages[0];
  // // Draw a string of text diagonally across the first page
  // firstPage.drawText(name, {
  //   x: 300,
  //   y: 270,
  //   size: 58,
  //   font: SanChezFont,
  //   color: rgb(0.2, 0.84, 0.67),
  // });
  // console.log(pdfDoc);
  // //  console.log(ethers)
  // // Serialize the PDFDocument to bytes (a Uint8Array)
  // const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  // console.log(pdfDataUri);
  // return pdfDataUri;
  // // saveAs(pdfDataUri,"newcertificate.pdf")
};

function App() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState("");
  const [ipfsuri, setIpfsuri] = useState(
    "https://bafybeicq5qpqnssll5c5mc5bnbszvsx7homuhm5uu4ckcpyndznvnakiwu.ipfs.w3s.link/Certificate.pdf"
  );
  const [state, setState] = useState(0);
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "safeMint",
    args: [address, ipfsuri],
  });
  const { write } = useContractWrite(config);
  return (
    <div className="App">
      <header>
        <div className="heading_text">
          <h1>Labyrinth Certificate Minting</h1>
          <h2>Enter your name and mint your NFT certificate now.</h2>
        </div>
      </header>
      {isConnected ? (
        <div style={{ textAlign: "center" }}>
          <ConnectButton />

          <button
            type="submit"
            id="submitBtn"
            onClick={async () => {
              setState(1);
              // const pdfuri = await generatePDF(name);
              setState(2);
              const response = await pinFileToIPFS("Certificate.pdf");
              setState(3);
              // call smart contract
              write();
              setState(4);

              console.log("Successfully completed");
            }}
          >
            Mint certificate
          </button>
          {state == 1 ? (
            <p>Generating Certificate....</p>
          ) : state == 2 ? (
            <p>Uploading ceritificate in IPFS</p>
          ) : state == 3 ? (
            <div>
              <p>Successfully uploaded to IPFS.</p>
              <p>{ipfsuri}</p>
            </div>
          ) : (
            <p></p>
          )}
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}

export default App;
