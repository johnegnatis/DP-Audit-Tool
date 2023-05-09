import { Icon } from "@iconify/react";
import { iconNames } from "../../../../utils/constants";
import { Popover, Tooltip, Menu, Checkbox } from "antd";

export const getColumn = ({ onEdit, onMove, onCopy, onDelete, disabled, onLevelingChange }) => {
  const keyToFunctionMapping = {
    1: onEdit,
    2: onMove,
    3: onCopy,
    4: onDelete,
  };

  const getMenu = (record) => {
    return (
      <Menu
        onClick={(item) => {
          const { name, number, semester, transfer, grade, type, leveling } = record;
          const obj = { name, number, semester, transfer, grade, type, leveling };
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
          { label: "Copy", key: 3 },
          { label: "Delete", key: 4, className: "red-text" },
        ]}
      />
    );
  };

  const columns = [
    {
      title: " ",
      width: "5%",
      align: "center",
      render: (record) => {
        if (disabled) return <Icon icon={iconNames.threeDots} className="xxs icon grey pointer" />;
        return (
          <Popover content={getMenu(record)} placement="bottom" trigger="hover" destroyTooltipOnHide>
            <Icon icon={iconNames.threeDots} className="xxs icon grey pointer" />
          </Popover>
        );
      },
    },
    {
      title: "Course Title",
      key: "name",
      width: "45%",
      align: "left",
      render: (record) => {
        return (
          <div className="flex center y">
            <span>{record.name}</span>
            <Tooltip
              placement="right"
              title="Too many classes in this section. This class will not appear on the degree plan."
              className="tooltip-warning"
            >
              <Icon icon={iconNames.warning} className="icon orange xs" style={{ marginLeft: "5px" }} />
            </Tooltip>
          </div>
        );
      },
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

  if (onLevelingChange) {
    columns.push({
      title: "Leveling",
      key: "leveling",
      align: "center",
      render: (record) => {
        return (
          <Tooltip placement="right" title={record.leveling || "Click to make leveling course"}>
            <Checkbox
              checked={!!record.leveling}
              onChange={(e) =>
                onLevelingChange({
                  checked: e.target.checked,
                  table: record.type,
                  key: record.key,
                })
              }
            />
          </Tooltip>
        );
      },
    });
  }

  return columns;
};
