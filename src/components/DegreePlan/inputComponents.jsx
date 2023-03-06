import { Input, DatePicker, Radio } from "antd";

const getForm = (value, setValue) => {
  const handleFormInput = (e) => {
    setValue(e.target.value.trim());
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

export { getRadio, getDatePicker, getForm };
