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

const getNumberForm = (value, setValue) => {
  const handleFormInput = (e) => {
    const input = e.target.value;
    const regex = /^[0-9\b]+$/; // only allow digits and backspace
    if (regex.test(input)) {
      setValue(input);
    }
  };

  return <Input value={value} onChange={(e) => handleFormInput(e)} />;
};

const getDatePicker = (value, setValue) => {
  const handleDateChange = (e) => {
    if (!e) setValue(null);
    else setValue(e);
  };

  return (
    <DatePicker
      picker="month"
      onChange={(e) => handleDateChange(e)}
      value={value}
    />
  );
};

const getRadio = (value, setValue) => {
  const handleRadioChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Radio.Group onChange={handleRadioChange} value={value}>
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
