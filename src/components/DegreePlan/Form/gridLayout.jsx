import { Col, Row } from "antd";

// x1 and x2 must sum to 24, x1 is left box, x2 is right box
const formatGrid = (layout, x1, x2) => {
    return (
      <div className="grid">
        {layout.map((row, index) => {
          return (
            <Row key={index} className="row">
              <Col className="right" span={x2} push={x1}>
                {row.cell_two}
              </Col>
              <Col className="left" span={x1} pull={x2}>
                {row.cell_one}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  // x1 and x2 must sum to 12, x1 is 1st and 3rd box, x2 is 2nd and 4th box
  const formatHalfGrid = (layout, x1, x2, x3, x4) => {
    return (
      <div className="grid">
        {layout.map((row, index) => {
          return (
            <Row key={index} className="row">
              <Col className="right" span={x2} push={x1}>
                {row.cell_two}
              </Col>
              <Col className="left" span={x1} pull={x2}>
                {row.cell_one}
              </Col>
              <Col className="right" span={x4} push={x3}>
                {row.cell_four}
              </Col>
              <Col className="left" span={x3} pull={x4}>
                {row.cell_three}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };
  const getSpan = (name, required=true) => {
    return (
      <span>
        {required && <span className="asterisk">*</span>}
        <span className="name">{name}</span>
        <span className="colon">:</span>
      </span>
    );
  };
export { formatGrid, formatHalfGrid, getSpan}