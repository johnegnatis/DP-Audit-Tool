import React from "react";
import { columns } from "./columns";
import { Table, Button } from "antd";

const ClassTable = ({ title, subtitle, classes, openAddDrawer, notes, setClassForEdit }) => {
  const classList =
    classes &&
    classes.map((classes, index) => {
      return { ...classes, key: index };
    });
  const handleRowClick = (record, rowIndex) => {
    setClassForEdit({
      class: record,
      index: rowIndex,
    })
  };
  return (
    <>
      <div className="title-span">
        <div>
          <h2 className="subtitle">{title}</h2>
          {subtitle && <h3 className="course-info">{subtitle}</h3>}
        </div>
        <div className="add-class-button">
          <Button className="button orange-bg" onClick={() => openAddDrawer()}>
            Add Class
          </Button>
        </div>
      </div>
      {notes && notes.map((note) => <span>{note}</span>)}
      <Table
        dataSource={classList}
        columns={columns}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => handleRowClick(record, rowIndex),
          };
        }}
      />
    </>
  );
};

export default ClassTable;
