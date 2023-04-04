import React from "react";
import { Button } from "antd";
const SwappingNotification = ({ open, onCancel }) => {
  if (open)
    return (
      <div className="swapping-notification-root">
        <div className="swapping-notification">
          <span>Click Another Class To Preform a Swap</span>
          <Button
            onClick={() => onCancel()}
            className="button grey-bg grey-border pointer"
          >
            Close
          </Button>
        </div>
      </div>
    );
  return <div></div>;
};
export default SwappingNotification;
