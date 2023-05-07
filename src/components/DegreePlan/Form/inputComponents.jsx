import { Input, DatePicker, Radio, Dropdown, Button } from "antd";
import TextArea from "antd/es/input/TextArea";

const getForm = (value, setValue, disabled = false, onEnter = () => {}) => {
  const handleFormInput = (e) => {
    setValue(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !disabled) {
      onEnter();
    }
  };

  return <Input value={value} onChange={(e) => handleFormInput(e)} onKeyDown={(e) => handleKeyPress(e)} disabled={disabled} />;
};

const getTextArea = (value, setValue, disabled = false, onEnter = () => {}) => {
  const handleFormInput = (e) => {
    setValue(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !disabled) {
      onEnter();
    }
  };

  return <TextArea value={value} onChange={(e) => handleFormInput(e)} onKeyDown={(e) => handleKeyPress(e)} disabled={disabled} />;
};

const getNumberForm = (value, setValue, disabled = false, semester = false, onEnter = () => {}) => {
  const handleFormInput = (e) => {
    const input = e.target.value;
    let regex = /^[0-9\b]+$/; // only allow digits and backspace
    if (semester) regex = /^[0-9\bFSfs]+$/;
    if (regex.test(input) || input === "") {
      setValue(input);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !disabled) {
      onEnter();
    }
  };

  return <Input value={value} onChange={(e) => handleFormInput(e)} onKeyDown={(e) => handleKeyPress(e)} disabled={disabled} />;
};

const getDatePicker = (value, setValue, disabled = false) => {
  const handleDateChange = (e) => {
    if (!e) setValue(null);
    else setValue(e);
  };

  return <DatePicker picker="month" onChange={(e) => handleDateChange(e)} value={value} disabled={disabled} />;
};

const getRadio = (value, setValue, disabled = false) => {
  const handleRadioChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Radio.Group disabled={disabled} onChange={handleRadioChange} value={value}>
      <Radio value={true}>Yes</Radio>
      <Radio value={false}>No</Radio>
    </Radio.Group>
  );
};

const getDropdown = (value, setValue, options, defaultText = "Select Track") => {
  // @Zia: should we make the dropdown only on click or is on hover nice?
  const handleMenuClick = (e) => {
    setValue(options.find((obj) => obj.key === e.key).label);
  };
  const menuProps = {
    items: options,
    onClick: handleMenuClick,
  };
  const width = "80%";
  return (
    <Dropdown className="button dropdown" menu={menuProps} width={width}>
      <Button style={{ width, marginBottom: "20px" }}> {value || defaultText}</Button>
    </Dropdown>
  );
};

export { getDropdown, getRadio, getDatePicker, getForm, getNumberForm, getTextArea };
