import React, { useMemo, useState } from "react";
import { getColumn } from "./columns";
import { Table, Button } from "antd";
import { tableTypes } from "../../../../utils/constants";

const ClassTable = ({
  type,
  title,
  subtitle,
  classes,
  openAddClassDrawer,
  notes,
  setClassForEdit,
  setClassForMove,
  handleMoveClick,
  handleMoveToTopClick,
  deleteClass,
  allDisabled,
  selectedRow: rowSelectedForEditOrMove,
}) => {
  const [headerHover, setHeaderHover] = useState(false);
  const classList =
    classes &&
    classes.map((classes, index) => {
      return { ...classes, key: index };
    });
  const TableCSS = useMemo(
    () =>
      `${
        rowSelectedForEditOrMove && rowSelectedForEditOrMove.table === type
          ? `row-${rowSelectedForEditOrMove.index}`
          : ""
      } ${headerHover ? "header-hovered" : ""}`,
    [rowSelectedForEditOrMove, headerHover]
  );
  const onMoveClick = (record, rowIndex) => {
    if (!allDisabled) return; // if all disabled, we are moving
    handleMoveClick({
      class: record,
      index: rowIndex,
    });
  };
  const onMoveTopClick = (type) => {
    if (!allDisabled) return;
    handleMoveToTopClick(type);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      // TODO: make a callback to make the prereqs save the given state here that goes back the the main
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <>
      <div className="title-span">
        <div>
          <h2 className="subtitle">{title}</h2>
          {subtitle && <h3 className="course-info">{subtitle}</h3>}
        </div>
        <div className="add-class-button">
          <Button
            className="button orange-bg"
            disabled={allDisabled}
            onClick={() => openAddClassDrawer()}
          >
            Add Course
          </Button>
        </div>
      </div>
      {notes && notes.map((note) => <span>{note}</span>)}
      <Table
        rowSelection={
          type === tableTypes.prerequisites && {
            type: "checkbox",
            columnTitle: "given",
            fixed: false,
            ...rowSelection,
          }
        }
        className={TableCSS}
        dataSource={classList}
        columns={getColumn({
          onEdit: setClassForEdit,
          onDelete: deleteClass,
          onMove: setClassForMove,
          disabled: allDisabled,
        })}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => onMoveClick(record, rowIndex),
          };
        }}
        onHeaderRow={(column, index) => {
          return {
            onClick: () => onMoveTopClick(type),
            onMouseEnter: () => setHeaderHover(true),
            onMouseLeave: () => setHeaderHover(false),
          };
        }}
      />
    </>
  );
};

export default ClassTable;
