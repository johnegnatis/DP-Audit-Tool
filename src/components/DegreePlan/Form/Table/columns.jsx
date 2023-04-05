import { Icon } from "@iconify/react";
import { iconNames } from "../../../../utils/constants";
import { Popover, Menu } from "antd";
import { useState } from "react";

export const getColumn = ({ onEdit, onMove, onDelete, disabled }) => {
  const keyToFunctionMapping = {
    1: onEdit,
    2: onMove,
    3: onDelete,
  };

  const getMenu = (record) => {
    return (
      <Menu
        onClick={(item) => {
          console.log(item);
          const { name, number, semester, transfer, grade, type } = record;
          const obj = { name, number, semester, transfer, grade, type };
          const keyFunction = keyToFunctionMapping[item.key];
          keyFunction({
            class: obj,
            index: record.key,
          });
        }}
        style={{ width: 120, borderInlineEnd: "none" }}
        mode="vertical"
        items={[
          { label: "Edit", key: 1 },
          { label: "Move", key: 2 },
          { label: "Delete", key: 3, className: "red-text" }, // TODO: delete is RED
        ]}
      />
    );
  };

  return [
    {
      title: " ",
      width: "5%",
      align: "center",
      render: (record) => {
        if (disabled)
          return (
            <Icon
              icon={iconNames.threeDots}
              className="xxs icon grey pointer"
            />
          );
        return (
          <Popover
            content={getMenu(record)}
            placement="bottom"
            trigger="hover"
            destroyTooltipOnHide
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
      align: "left",
    },
    {
      title: "Course Num",
      dataIndex: "number",
      key: "number",
      align: "center",
    },
    {
      title: "UTD Sem",
      dataIndex: "semester",
      key: "semester",
      align: "center",
    },
    {
      title: "Transfer",
      dataIndex: "transfer",
      key: "transfer",
      align: "center",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
  ];
};
