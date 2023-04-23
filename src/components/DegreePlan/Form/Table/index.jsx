import React, { useMemo, useState } from "react";
import { getColumn } from "./columns";
import { Table, Button } from "antd";
import { getNumberToString, iconNames } from "../../../../utils/constants";
import { Icon } from "@iconify/react";
import { Tooltip } from "antd";

const ClassTable = ({
  type,
  subtitle,
  classes,
  openAddClassDrawer,
  notes,
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
    } else if (allDisabled === 'copy') {
      handleCopyClick({
        class: record,
        index: rowIndex,
      });
    }
  };
  const onHeaderClick = (type) => {
    if (allDisabled === "move") {
      handleMoveToTopClick(type);
    } else if (allDisabled === 'copy') {
      handleCopyToTopClick(type);
    }
  };
  return (
    <>
      <div className="title-span">
        <div>{subtitle && <h3 className="course-info">{subtitle}</h3>}</div>
        <div className="add-class-button">
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
