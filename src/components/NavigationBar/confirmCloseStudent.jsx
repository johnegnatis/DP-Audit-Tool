import { Modal } from "antd";
const ConfirmCloseStudent = ({ open, message, handleConfirmBoxResponse }) => {
  return (
    <Modal
      title={message}
      okText="Delete"
      okType="danger"
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
