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
      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignContent: "start" }}>
        {getSpan("Enter Signature", false, true)}
        {getForm(signature, setSignature)}
        <Checkbox ref={checkboxRef}>Save an uneditable version</Checkbox>
        <br />
        <div style={{ paddingTop: '20px', display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button className="button red-bg" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            className="button orange-bg"
            onClick={() => savePDF(true, checkboxRef.current && checkboxRef.current.state.checked)}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default AskSignature;
