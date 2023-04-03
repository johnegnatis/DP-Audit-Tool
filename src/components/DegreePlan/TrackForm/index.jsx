import { Button, Modal } from "antd";
import { getDropdown } from "../Form/inputComponents";
const SelectTrack = ({ open, track, setTrack, handleConfirmTrack, options }) => {
  return (
    <Modal
      title="Select Track"
      okText="Confirm Track"
      style={{
        top: 20,
      }}
      open={open}
      footer={false}
      closable={false}
    >
      {getDropdown(track, setTrack, options)}
      <br/>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
          <Button
            className="button orange-bg"
            disabled={!track}
            onClick={() => handleConfirmTrack()}
          >
            Confirm Selection
          </Button>
      </div>
    </Modal>
  );
};
export default SelectTrack;
