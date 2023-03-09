import { Modal } from "antd";
const ConfirmPageSwitch = ({ open, setOpen, handleConfirmBoxResponse }) => {
  return (
    <Modal
      title="Are you sure?"
      okText="Yes"
      okType="danger"
      style={{
        top: 20,
      }}
      open={open}
      onOk={() => {
        setOpen(false);
        handleConfirmBoxResponse("ok");
      }}
      onCancel={() => {
        setOpen(false);
        handleConfirmBoxResponse("cancel");
      }}
    >
      <span>You will lose any progress on this page.</span>
    </Modal>
  );
};
export default ConfirmPageSwitch;
