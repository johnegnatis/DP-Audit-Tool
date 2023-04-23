import { Modal } from "antd";
const ConfirmCloseStudent = ({ open, message, handleConfirmBoxResponse }) => {
  return (
    <Modal
      title={message}
      okText="Close"
      okType="danger"
      cancelText="Cancel"
      style={{
        top: 20,
      }}
      open={open}
      onOk={() => {
        handleConfirmBoxResponse("Delete");
      }}
      onCancel={() => {
        handleConfirmBoxResponse("Cancel");
      }}
    />
    // </Modal>
  );
};
export default ConfirmCloseStudent;
