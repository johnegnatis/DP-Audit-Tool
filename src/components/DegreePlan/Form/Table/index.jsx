import React from "react";
import { getColumn } from "./columns";
import { Table, Button } from "antd";

const ClassTable = ({
  title,
  subtitle,
  classes,
  openAddDrawer,
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
      })
    }
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
            onClick={() => openAddDrawer()}
          >
            Add Course
          </Button>
        </div>
      </div>
      {notes && notes.map((note) => <span>{note}</span>)}
      <Table
        dataSource={classList}
        columns={getColumn({ onEdit: setClassForEdit, onDelete: deleteClass, onMove: setClassForMove, disabled: allDisabled})}
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
