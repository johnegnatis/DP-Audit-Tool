import React from "react";
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
  deleteClass,
  allDisabled,
}) => {
  const classList =
    classes &&
    classes.map((classes, index) => {
      return { ...classes, key: index };
    });
  const onMoveClick = (record, rowIndex) => {
    if (!allDisabled) return; // if all disabled, we are moving
    handleMoveClick({
      class: record,
      index: rowIndex,
    });
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
        rowSelection={type === tableTypes.prerequisites && {
          type: "checkbox",
          columnTitle: "given",
          fixed: false,
          ...rowSelection,
        }}
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
      />
    </>
  );
};

export default ClassTable;
