import { Button, Modal } from "antd";
import { getDropdown } from "../Form/inputComponents";
const SelectTrack = ({ open, track, setTrack, handleConfirmTrack, handleReturnToHome, options }) => {
  return (
    <Modal
      title="Select Track"
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
      <br/>
      <div style={{ display: 'flex', justifyContent: 'space-evenly'}}>
          <Button
            className="button orange-bg"
            disabled={!track}
            onClick={() => handleConfirmTrack()}
          >
            Confirm Selection
          </Button>
      </div>
      <span>- OR -</span>
      <div style={{ display: 'flex', justifyContent: 'space-evenly'}}>
        <Button
              className="button orange-bg"
              onClick={() => handleReturnToHome()}
            >
              Back
            </Button>
      </div>
    </Modal>
  );
};
export default SelectTrack;
