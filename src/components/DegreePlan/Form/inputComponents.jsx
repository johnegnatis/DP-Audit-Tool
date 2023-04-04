import { Input, InputNumber, DatePicker, Radio, Dropdown } from "antd";

const getForm = (value, setValue, disabled = false) => {
  const handleFormInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <Input
      value={value}
      onChange={(e) => handleFormInput(e)}
      disabled={disabled}
    />
  );
};

const getNumberForm = (value, setValue, disabled=false) => {
  const handleFormInput = (e) => {
    const input = e.target.value;
    const regex = /^[0-9\b]+$/; // only allow digits and backspace
    if (regex.test(input)) {
      setValue(input);
    }
  };

  return <Input value={value} onChange={(e) => handleFormInput(e)} disabled={disabled} />;
};

const getDatePicker = (value, setValue, disabled=false) => {
  const handleDateChange = (e) => {
    if (!e) setValue(null);
    else setValue(e);
  };

  return (
    <DatePicker
      picker="month"
      onChange={(e) => handleDateChange(e)}
      value={value}
      disabled={disabled}
    />
  );
};

const getRadio = (value, setValue, disabled=false) => {
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

const getDropdown = (value, setValue, options) => {
  const handleMenuClick = (e) => {
    setValue(options.find((obj) => obj.key === e.key).label);
  };
  const menuProps = {
    items: options,
    onClick: handleMenuClick,
  };
  // TODO: make popup open everywhere
  return (
    <Dropdown.Button
      menu={menuProps}
      onClick={() => {
        console.log("hi");
      }}
      className="d-dropdown"
    >
      {value || "Select Track"}
    </Dropdown.Button>
  );
};

export { getDropdown, getRadio, getDatePicker, getForm, getNumberForm };
