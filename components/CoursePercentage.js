import React from "react";
import axios from "axios";
import { Table, Col, Row, Card } from "react-bootstrap";

export default function CoursePercentage(props) {
  let score_component = <h6></h6>;
  if (props.score !== "" && props.score !== "File Does not exist") {
    // console.log(props.score);
    const course_names = Object.keys(props.score).reverse();
    score_component = course_names.map((course) => {
      return (
        <Card
          style={{
            width: "10.5rem",
            paddingBottom: "5px",
            paddingTop: "5px",
            borderRight: "none",
            borderLeft: "none",
          }}
        >
          <Card.Text
            style={{ fontWeight: "bold", fontSize: "15px", padding: "0px" }}
          >
            {course}
          </Card.Text>

          <Card.Text style={{ fontSize: "14px" }}>
            {props.score[course][2]}%
          </Card.Text>
          <Card.Text style={{ fontSize: "14px", padding: "0px" }}>
            {props.score[course][0].slice(0, -5)} -
            {props.score[course][1].slice(0, -5)}
          </Card.Text>
        </Card>
      );
    });
  }

  let ss_score_component = <h6></h6>;
  if (props.ss_score !== "" && props.ss_score !== "File Does not exist") {
    const ss_course_names = Object.keys(props.ss_score).reverse();
    ss_score_component = ss_course_names.map((course) => {
      return (
        <Card
          style={{
            width: "10.5rem",
            paddingBottom: "5px",
            paddingTop: "5px",
            borderRight: "none",
            borderLeft: "none",
          }}
        >
          <Card.Text
            style={{ fontWeight: "bold", fontSize: "15px", padding: "0px" }}
          >
            {course}
          </Card.Text>

          <Card.Text style={{ fontSize: "14px" }}>
            {props.ss_score[course][2]}%
          </Card.Text>
          <Card.Text style={{ fontSize: "14px", padding: "0px" }}>
            {props.ss_score[course][0].slice(0, -5)} -
            {props.ss_score[course][1].slice(0, -5)}
          </Card.Text>
        </Card>
      );
    });
  }

  return (
    <span>
      <Row>
        <Col xs={1.5} style={{ paddingRight: 0 }}>
          <Table responsive="sm" bordered>
            <div>
              <Card.Header style={{ background: "#CC3314", color: "white" }}>
                SS Course%
              </Card.Header>

              {ss_score_component}
            </div>
          </Table>
        </Col>

        <Col xs={1.5} style={{ paddingRight: 0 }}>
          <Table responsive="sm" bordered>
            <div>
              <Card.Header style={{ background: "#CC3314", color: "white" }}>
                IT Course%
              </Card.Header>

              {score_component}
            </div>
          </Table>
        </Col>
      </Row>
    </span>
  );
}
