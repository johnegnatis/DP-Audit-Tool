import React, { useMemo, useState } from "react";
import { getColumn } from "./columns";
import { Table, Button } from "antd";
import { getNumberToString, iconNames } from "../../../../utils/constants";
import { Icon } from "@iconify/react";
import { Tooltip } from "antd";

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
  onLevelingChange,
  size,
}) => {
  const [headerHover, setHeaderHover] = useState(false);
  const numberOfExtraClasses = classes.length - size;
  const isTableOverflown = numberOfExtraClasses > 0;
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
  return (
    <>
      <div className="title-span">
        <div>
          <div>
            <h2 className="subtitle">
              {title}
              {isTableOverflown && (
                <Tooltip
                  placement="right"
                  title={`There are ${getNumberToString(
                    numberOfExtraClasses,
                    true
                  )} too many classes, the Degree Plan will not reflect the extra classes.`}
                >
                  <Icon icon={iconNames.warning} className="icon yellow xs pointer" />
                </Tooltip>
              )}
            </h2>
            {subtitle && <h3 className="course-info">{subtitle}</h3>}
          </div>
        </div>
        <div className="add-class-button">
          <Button className="button orange-bg" disabled={allDisabled} onClick={() => openAddClassDrawer()}>
            Add Course
          </Button>
        </div>
      </div>
      {notes && notes.map((note) => <span>{note}</span>)}
      <Table
        className={TableCSS}
        rowClassName={(_, index) => (index >= size ? "warning-table-full" : "")}
        dataSource={classList}
        columns={getColumn({
          onEdit: setClassForEdit,
          onDelete: deleteClass,
          onMove: setClassForMove,
          disabled: allDisabled,
          onLevelingChange,
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
