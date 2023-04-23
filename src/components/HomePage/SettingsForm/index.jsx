import { Button, Modal } from "antd";
import { getSpan } from "../../DegreePlan/Form/gridLayout";
import { useSettings } from "../../Hooks/settingHooks";
import { Input } from "antd";
import { iconNames, settingsKeys } from "../../../utils/constants";
import { Icon } from "@iconify/react";
import { Tooltip } from "antd";

const SettingsForm = ({ open, onClose }) => {
  const { getDirectory, resetState, saveToSetting, defaultPathForAudit, defaultPathForTranscripts, defaultPathForDegreePlan } =
    useSettings();
  return (
    <Modal
      className="setting-root"
      title="Settings"
      style={{
        top: 20,
      }}
      width={700}
      open={open}
      footer={false}
      closable={false}
    >
      <div className="setting-root">
        {getDirectoryForm(
          defaultPathForTranscripts,
          getSpan("Default Path for Uploading Transcripts", false, true),
          () => getDirectory(settingsKeys.defaultPathForTranscript),
          () => resetState(settingsKeys.defaultPathForTranscript)
        )}
        {getDirectoryForm(
          defaultPathForDegreePlan,
          getSpan("Default Path for Saving Degree Plans", false, true),
          () => getDirectory(settingsKeys.defaultPathForDegreePlan),
          () => resetState(settingsKeys.defaultPathForDegreePlan)
        )}
        {getDirectoryForm(
          defaultPathForAudit,
          getSpan("Default Path for Saving Audit Reports", false, true),
          () => getDirectory(settingsKeys.defaultPathForAudit),
          () => resetState(settingsKeys.defaultPathForAudit)
        )}
        <div className="buttons">
          <Button className="button red-bg" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            className="button orange-bg"
            onClick={() => {
              saveToSetting(onClose);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default SettingsForm;

function getDirectoryForm(value, span, onClickFunction, onDelete) {
  return (
    <div className="row">
      <div className="row-upper">
        {span}
      </div>
      <div className="row-lower">
        <Input value={value} disabled />
        <div className="button-div">
          <Tooltip placement="top" title="Clear">
            <Icon onClick={() => onDelete()} icon={iconNames.close} className="icon grey xs pointer" />
          </Tooltip>
          <Tooltip placement="top" title="Select Directory Path">
            <Icon onClick={() => onClickFunction()} icon={iconNames.openDir} className="icon grey xs pointer" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
