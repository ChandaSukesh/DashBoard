import React from "react";
import { Jumbotron, Table, Row, Col, Container } from "react-bootstrap";

function PPTScoreRowData(props) {
  if (props.type === "heading") {
    let i = props.startIndex;
    let ppt_table_headings = props.weekly_scores
      .slice(props.startIndex, props.endIndex)
      .map(() => {
        i += 1;
        return (
          <td scope="col" style={{ background: "#CC3314", color: "white" }}>
            {i}
          </td>
        );
      });
    return ppt_table_headings;
  } else if (props.type === "scores") {
    let i = 0;
    let ppt_score_table = props.weekly_scores
      .slice(props.startIndex, props.endIndex)
      .map((score) => {
        i += 1;
        if (i === 1)
          return (
            <React.Fragment>
              <th style={{ background: "#CC3314", color: "white" }}>Scores</th>
              <td>{score}</td>
            </React.Fragment>
          );
        return <td>{score}</td>;
      });
    return ppt_score_table;
  }
}

function PPTScoreTable(props) {
  // console.log(props);
  if (typeof undefined_var != typeof props.info) {
    const data = props.info;
    const num_of_ppt = data["num_of_ppt"];
    const total_ppt = data["total_ppt"];
    const absent = data["absent"];
    const remedial = data["remedial"];
    const average_score = data["average"];
    let weekly_scores = data["weekly_scores"];
    // console.log(average_score);

    let headingRowOne = PPTScoreRowData({
      type: "heading",
      startIndex: 0,
      endIndex: 16,
      weekly_scores: weekly_scores,
    });
    let headingRowTwo = PPTScoreRowData({
      type: "heading",
      startIndex: 16,
      endIndex: 32,
      weekly_scores: weekly_scores,
    });
    let dataRowOne = PPTScoreRowData({
      type: "scores",
      startIndex: 0,
      endIndex: 16,
      weekly_scores: weekly_scores,
    });
    let dataRowTwo = PPTScoreRowData({
      type: "scores",
      startIndex: 16,
      endIndex: 32,
      weekly_scores: weekly_scores,
    });

    return (
      <React.Fragment>
        <Container>
          <Table bordered hover>
            <thead style={{ color: "white", background: "#CC3314" }}>
              <tr>
                <th>Number of ppt</th>
                <th>Total number of ppt conducted</th>
                <th>Absent</th>
                <th>Remedial</th>
                <th>Average scores</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{num_of_ppt}</td>
                <td>{total_ppt}</td>
                <td>{absent}</td>
                <td>{remedial}</td>
                <td>{average_score}</td>
              </tr>
            </tbody>
          </Table>
        </Container>

        <Table
          bordered
          style={{
            alignItems: "center",
            textAlign: "left",
            width: "90rem",
            margin: "auto",
            tableLayout: "fixed",
          }}
        >
          <thead
            style={{
              textAlign: "center",
            }}
          >
            <tr>
              <th
                scope="col"
                style={{
                  color: "white",
                  background: "#CC3314",
                }}
              >
                Week #
              </th>
              {headingRowOne}
            </tr>
          </thead>
          <tbody>
            <tr>{dataRowOne}</tr>
          </tbody>
          <thead
            style={{
              textAlign: "center",
            }}
          >
            <tr>
              <th
                scope="col"
                style={{
                  color: "white",
                  background: "#CC3314",
                }}
              >
                Week #
              </th>
              {headingRowTwo}
            </tr>
          </thead>
          <tbody>
            <tr>{dataRowTwo}</tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
  return <div></div>;
}

export default function PresentationDisplay(props) {
  let capitalize_student_name = "";
  if (
    typeof props.res.dashboard_data.grades["student_name"] !=
    typeof undefined_var
  ) {
    let student_name_arr = props.res.dashboard_data.grades[
      "student_name"
    ].split(" ");
    for (let i = 0; i < student_name_arr.length; i++) {
      capitalize_student_name +=
        student_name_arr[i].charAt(0).toUpperCase() +
        student_name_arr[i].slice(1).toLowerCase() +
        " ";
    }
  }
  return (
    <div>
      <Jumbotron
        style={{
          height: "100px",
          padding: "0px",
          fontFamily: "Raleway",
          backgroundColor: "#001340",
        }}
      >
        {!props.mentor ? (
          <img
            style={{
              height: "100px",
            }}
            src={process.env.PUBLIC_URL + "/msit_new_logo.png"}
            alt="MSIT Logo"
            align="left"
          />
        ) : (
          <span></span>
        )}
        <h1 style={{ color: "white", paddingTop: "1%" }}>
          Presentation Scores
        </h1>
        <h6 style={{ color: "white" }}>
          This web page shows weekly presentation scores.
        </h6>
      </Jumbotron>
      <h4 style={{ fontFamily: "Raleway" }}>
        {capitalize_student_name} ({props.learningCenter})
      </h4>
      <h6 style={{ fontFamily: "Raleway" }}>
        Data was last updated on {props.lastUpdated}
      </h6>
      <br />
      <PPTScoreTable info={props.pptScores} />
    </div>
  );
}
