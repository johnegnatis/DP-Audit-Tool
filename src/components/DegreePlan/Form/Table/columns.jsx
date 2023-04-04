import { Icon } from "@iconify/react";
import { iconNames } from "../../../../utils/constants";
import { Popover, Menu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

// TODO: make antd popover on three dots
/* <Popover content={content} title="Title" trigger="click">
  <Button>Click me</Button>
</Popover> */

// key,
// icon,
// children,
// label,
// type,
export const getColumn = ({ onEdit, onMove, onDelete }) => {
  const getMenu = (text, record, index) => {
    return (
      <Menu
        onClick={(item, key, keyPath, domEvent) => {
          console.log(item, key, keyPath, domEvent);
          console.log(text, record, index);
        }}
        style={{ width: 120, borderInlineEnd: "none" }}
        mode="vertical"
        items={[
          { label: "Edit", key: 1 },
          { label: "Move", key: 2 },
          { label: "Delete", key: 3 }, // TODO: delete is RED
        ]}
      />
    );
  };

  return [
    {
      title: "",
      width: "2%",
      align: "center",
      render: (text, record, index) => {
        return (
          <Popover
            content={getMenu(text, record, index)}
            placement="bottom"
            trigger="click"
          >
            <Icon
              icon={iconNames.threeDots}
              className="xxs icon grey pointer"
            />
          </Popover>
        );
      },
    },
    {
      title: "Course Title",
      dataIndex: "name",
      key: "name",
      width: "45%",
    },
    {
      title: "Course Num",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "UTD Sem",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Transfer",
      dataIndex: "transfer",
      key: "transfer",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
  ];
};
