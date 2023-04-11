import { Button, Checkbox, Modal } from "antd";
import { getForm } from "../../DegreePlan/Form/inputComponents";
import { getSpan } from "../../DegreePlan/Form/gridLayout";
import { useRef } from "react";
const AskSignature = ({ open, signature, setSignature, savePDF, onClose }) => {
  const checkboxRef = useRef();
  return (
    <Modal
      title="Save PDF Options"
      style={{
        top: 20,
      }}
      className="select-track"
      open={open}
      footer={false}
      closable={false}
      destroyOnClose
    >
      {getSpan("Enter Signature", false, true)}
      {getForm(signature, setSignature)}
      <br />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Checkbox ref={checkboxRef}>Remove Forms From PDF</Checkbox>
        <Button
          className="button orange-bg"
          disabled={!signature}
          onClick={() => savePDF(true, checkboxRef.current && checkboxRef.current.state.checked)}
        >
          Sign Degree Plan And Save
        </Button>
        <Button
          className="button orange-bg"
          disabled={signature}
          onClick={() => savePDF(false, checkboxRef.current && checkboxRef.current.state.checked)}
        >
          Save Without Signing
        </Button>
        <Button className="button red-bg" onClick={() => onClose()}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
export default AskSignature;
