import React from "react";
import { columns } from "./columns";
import { Table, Button } from "antd";

const ClassTable = ({ title, subtitle, classes, openDrawer, notes }) => {
  const classList =
    classes &&
    classes.map((classes, index) => {
      return { ...classes, key: index };
    });
  return (
    <>
      <h2 className="subtitle">{title}</h2>
      {subtitle && <h3 className="course-info">{subtitle}</h3>}
      {notes && notes.map((note) => <span>{note}</span>)}
      <Table dataSource={classList} columns={columns} pagination={false} />
      <div className="add-class-button">
        {/* TODO: put options here */}
        <Button onClick={() => openDrawer()}>Add Class</Button>
      </div>
    </>
  );
};

export default ClassTable;
