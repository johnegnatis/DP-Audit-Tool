import React, { useMemo, useState } from "react";
import { getColumn } from "./columns";
import { Table, Button } from "antd";
import { getNumberToString, iconNames } from "../../../../utils/constants";
import { Icon } from "@iconify/react";
import { Tooltip } from "antd";

const ClassTable = ({
  type,
  classes,
  openAddClassDrawer,
  setClassForEdit,
  setClassForMove,
  handleMoveClick,
  handleMoveToTopClick,
  setClassForCopy,
  handleCopyClick,
  handleCopyToTopClick,
  deleteClass,
  allDisabled,
  selectedRow: rowSelectedForEditOrMove,
  onLevelingChange,
  size,
  notes,
}) => {
  const [headerHover, setHeaderHover] = useState(false);
  const isTableOverflown = classes.length - size > 0;
  const classList =
    classes &&
    classes.map((classes, index) => {
      return { ...classes, key: index };
    });
  const TableCSS = useMemo(
    () =>
      `${rowSelectedForEditOrMove && rowSelectedForEditOrMove.table === type ? `row-${rowSelectedForEditOrMove.index}` : ""} ${
        headerHover ? "header-hovered" : ""
      }`,
    [rowSelectedForEditOrMove, headerHover]
  );
  const onTableClick = (record, rowIndex) => {
    if (allDisabled === "move") {
      handleMoveClick({
        class: record,
        index: rowIndex,
      });
    } else if (allDisabled === "copy") {
      handleCopyClick({
        class: record,
        index: rowIndex,
      });
    }
  };
  const onHeaderClick = (type) => {
    if (allDisabled === "move") {
      handleMoveToTopClick(type);
    } else if (allDisabled === "copy") {
      handleCopyToTopClick(type);
    }
  };
  const dotSeparator = "_DoT";
  const noteList = useMemo(
    () =>
      notes &&
      notes
        .map((item) => [item, dotSeparator])
        .flat()
        .slice(0, -1)
  );
  return (
    <>
      <div className="title-span">
        <div className="notes-and-add-class">
          <div className="notes">
            {noteList &&
              noteList.map((note, index) => {
                if (note === dotSeparator)
                  return (
                    <span style={{ paddingLeft: "3px", paddingRight: "3px" }} key={index}>
                      {"/"}
                    </span>
                  ); //<Icon key={index} icon={iconNames.dot} className="icon black xs" />;
                else return <span key={index}>{note}</span>;
              })}
          </div>
          <Button className="button orange-bg" disabled={allDisabled} onClick={() => openAddClassDrawer()}>
            Add Course
          </Button>
        </div>
      </div>
      <Table
        className={TableCSS}
        rowClassName={(_, index) => (index >= size ? "warning-table-full" : "")}
        dataSource={classList}
        columns={getColumn({
          onEdit: setClassForEdit,
          onDelete: deleteClass,
          onMove: setClassForMove,
          onCopy: setClassForCopy,
          disabled: allDisabled,
          onLevelingChange,
        })}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => onTableClick(record, rowIndex),
          };
        }}
        onHeaderRow={(column, index) => {
          return {
            onClick: () => onHeaderClick(type),
            onMouseEnter: () => setHeaderHover(true),
            onMouseLeave: () => setHeaderHover(false),
          };
        }}
      />
    </>
  );
};

export default ClassTable;
