import React from "react";
import { Button } from "antd";
const MovingNotification = ({ open, onCancel }) => {
  if (open)
    return (
      <div className="moving-notification-root">
        <div className="moving-notification">
          <span>Click To Move This Class</span>
          <Button
            onClick={() => onCancel()}
            className="button grey-bg grey-border pointer"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  return <div></div>;
};
export default MovingNotification;
