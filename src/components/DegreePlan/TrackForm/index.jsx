import { Button, Modal } from "antd";
import { getDropdown } from "../Form/inputComponents";
const SelectTrack = ({ open, track, setTrack, handleConfirmTrack, handleReturnToHome, options, studentName }) => {
  return (
    <Modal
      title={`Select Track for ${studentName}`}
      okText="Confirm Selection"
      style={{
        top: 20,
      }}
      className="select-track"
      open={open}
      footer={false}
      closable={false}
    >
      {getDropdown(track, setTrack, options)}
      <br />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button className="button orange-bg" disabled={!track} onClick={() => handleConfirmTrack()}>
            Confirm Selection
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <span style={{ color:'orange', cursor: 'pointer' ,fontWeight: '700' }} onClick={() => handleReturnToHome()}>{'< Back'}</span>
        </div>
      </div>
    </Modal>
  );
};
export default SelectTrack;
