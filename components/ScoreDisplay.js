import React from "react";
import axios from "axios";
import { Table, Row, Col, Container, Jumbotron } from "react-bootstrap";
import CoursePercentage from "./CoursePercentage";

function Display_table(props) {
  if (props.info.dashboard_data === "File Does not exist") {
    return <div>Attendance record not found</div>;
  }
  if (typeof undefined_var != typeof props.info.dashboard_data) {
    const data = props.info["dashboard_data"]["attendance"];
    let keys = Object.keys(data);
    // console.log(keys, "Hello");

    let sorted_keys = keys.map((key) => {
      return parseInt(key.split(" ")[1]);
    });
    sorted_keys.sort(function (a, b) {
      return b - a;
    });
    let row_data = sorted_keys.map((week) => {
      let dates_data = data["Week " + week.toString()];
      let dates = Object.keys(dates_data);
      let total_score = 0;
      let percentage = 0;
      let ss_score = 0;
      let ss_percentage = 0;
      let it_count = 0;
      let ss_count = 0;
      // console.log(dates);
      let dates_res = dates.map((date) => {
        let tool_tip_str1 = "";
        let tool_tip_str2 = "";
        let tool_tip_str3 = "";
        if ("Duration3" in dates_data[date]) {
          tool_tip_str1 = `Seen on zoom call for ${dates_data[date]["9:00 AM Active minutes"]}/${dates_data[date]["Duration1"]} minutes`;
          tool_tip_str2 = `Seen on zoom call for ${dates_data[date]["11:00 AM Active minutes"]}/${dates_data[date]["Duration2"]} minutes`;
          tool_tip_str3 = `Seen on zoom call for ${dates_data[date]["2:00 PM Active minutes"]}/${dates_data[date]["Duration3"]} minutes`;
        } else if ("Duration1" in dates_data[date]) {
          tool_tip_str1 = `Seen on zoom call for ${dates_data[date]["9:00 AM Active minutes"]}/${dates_data[date]["Duration1"]} minutes`;
          tool_tip_str2 = `Seen on zoom call for ${dates_data[date]["11:00 AM Active minutes"]}/${dates_data[date]["Duration2"]} minutes`;
          tool_tip_str3 = `N/A`;
        } else {
          tool_tip_str1 = `Seen on zoom call for ${dates_data[date]["9:00 AM Active minutes"]} minutes`;
          tool_tip_str2 = `Seen on zoom call for ${dates_data[date]["11:00 AM Active minutes"]} minutes`;
          tool_tip_str3 = `N/A`;
        }

        if (dates_data[date]["Total"] !== "-") {
          it_count += 1;
          total_score += parseFloat(dates_data[date]["Total"]);
          percentage = ((total_score / it_count) * 100).toFixed(2);
          if (dates_data[date]["2:00 PM"] !== "-") {
            ss_count += 1;
            ss_score += parseFloat(dates_data[date]["2:00 PM"]);
            ss_percentage = ((ss_score / ss_count) * 100).toFixed(2);
          }
        }

        if (dates_data[date]["Duration1"] === "-") {
          tool_tip_str1 = "No session";
        }
        if (dates_data[date]["Duration2"] === "-") {
          tool_tip_str2 = "No session";
        }
        if (dates_data[date]["Duration3"] === "-") {
          tool_tip_str3 = "No session";
        }

        return (
          <React.Fragment>
            <td
              style={
                dates_data[date]["9:00 AM"] === "0"
                  ? { backgroundColor: "#FED4F8" }
                  : {}
              }
            >
              <a
                data-toggle="tooltip"
                title={tool_tip_str1}
                style={{ cursor: "pointer" }}
              >
                {dates_data[date]["9:00 AM"]}
              </a>
            </td>
            <td
              style={
                dates_data[date]["11:00 AM"] === "0"
                  ? { backgroundColor: "#FED4F8" }
                  : {}
              }
            >
              <a
                data-toggle="tooltip"
                title={tool_tip_str2}
                style={{ cursor: "pointer" }}
              >
                {dates_data[date]["11:00 AM"]}
              </a>
            </td>

            {dates_data[date]["2:00 PM"] === null ? (
              <td>
                <a
                  data-toggle="tooltip"
                  title={tool_tip_str3}
                  style={{ cursor: "pointer" }}
                >
                  -
                </a>
              </td>
            ) : (
              <td
                style={
                  dates_data[date]["2:00 PM"] === "0"
                    ? { backgroundColor: "#FED4F8" }
                    : {}
                }
              >
                <a
                  data-toggle="tooltip"
                  title={tool_tip_str3}
                  style={{ cursor: "pointer" }}
                >
                  {dates_data[date]["2:00 PM"]}
                </a>
              </td>
            )}
          </React.Fragment>
        );
      });
      let empty_cells = [<React.Fragment></React.Fragment>];
      if (dates_res.length < 5) {
        let diff = 5 - dates_res.length;
        for (let i = 0; i < diff * 3; i++) {
          empty_cells.push(<td></td>);
        }
      }
      let dd_mm_start = dates[0].slice(5).split("-");
      dd_mm_start = dd_mm_start.reverse();
      dd_mm_start = dd_mm_start.join("/");
      let dd_mm_end = "";
      if (dates.length == 5) {
        dd_mm_end = dates[4].slice(5).split("-");
        dd_mm_end = dd_mm_end.reverse();
        dd_mm_end = dd_mm_end.join("/");
      }

      return (
        <tr>
          <a
            data-toggle="tooltip"
            title={`Starting date of Week ${week}`}
            style={{ cursor: "pointer" }}
          >
            <td style={{ fontWeight: "bold" }}>{dd_mm_start}</td>
          </a>

          {dates_res}
          {empty_cells}
          <td>{total_score}</td>
          <td>{percentage}</td>
          {isNaN(ss_score) ? <td>-</td> : <td>{ss_score}</td>}
          {isNaN(ss_percentage) ? <td>-</td> : <td>{ss_percentage}</td>}
        </tr>
      );
    });
    let weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    let td_day = weekdays.map((val) => {
      return (
        <React.Fragment>
          <td style={{ border: "none" }}></td>
          <td style={{ border: "none", fontWeight: "bold" }}>{val}</td>
          <td
            style={{
              borderLeft: "none",
              borderTop: "none",
              borderBottom: "none",
            }}
          ></td>
        </React.Fragment>
      );
    });
    let sub_head = ["0900", "1100", "1400"];
    let tool_tip_title = {
      "0900": "09:00 AM Score",
      1100: "11:00 AM Score",
      1400: "Soft Skills",
      Total: "Total Score",
    };
    let td_val = sub_head.map((val) => {
      return (
        <td style={{ background: "#CC3314", color: "white" }}>
          <a
            data-toggle="tooltip"
            title={tool_tip_title[val]}
            style={{ cursor: "pointer" }}
          >
            {val}
          </a>
        </td>
      );
    });

    return (
      <React.Fragment>
        <Col xs={5} style={{ paddingLeft: 15 }}>
          <Table
            size="sm"
            bordered
            striped
            style={{
              width: "60%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                background: "#CC3314",
                color: "white",
              }}
            >
              <tr>
                <td>
                  <a
                    data-toggle="tooltip"
                    title="Day"
                    style={{ cursor: "pointer" }}
                  >
                    Day
                  </a>
                </td>
                {td_day}
                <td>IT Score</td>
                <td>IT %</td>
                <td>SS Score</td>
                <td>SS %</td>
              </tr>
            </thead>
            <thead
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                background: "#CC3314",
                color: "white",
              }}
            >
              <tr>
                <a
                  data-toggle="tooltip"
                  title={`Starting date of the Week`}
                  style={{ cursor: "pointer" }}
                >
                  Date
                </a>
                {td_val}
                {td_val}
                {td_val}
                {td_val}
                {td_val}
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody style={{ fontSize: "15px" }}>{row_data}</tbody>
          </Table>
        </Col>
      </React.Fragment>
    );
  }

  return <div>Attendance record not found</div>;
}

export default function Display(props) {
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
    <React.Fragment>
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
              // margin: "20px",
            }}
            src={process.env.PUBLIC_URL + "/msit_new_logo.png"}
            alt="MSIT Logo"
            align="left"
          />
        ) : (
          <span></span>
        )}

        <h1
          style={{ color: "white", paddingTop: "1%", alignContent: "left" }}
        >
          Attendance
        </h1>
        <h6 style={{ color: "white" }}>
          This web page shows the details of attendance in Zoom classes.
        </h6>
      </Jumbotron>
      <h4 style={{ fontFamily: "Raleway" }}>
        {capitalize_student_name} ({props.learningCenter})
      </h4>
      <h6 style={{ fontFamily: "Raleway" }}>
        Data was last updated on {props.lastUpdated}
      </h6>
      <br />
      <Container>
        <Row>
          <CoursePercentage score={props.score} ss_score={props.ss_score} />
          <Display_table info={props.res} />
        </Row>
        <br />
        <br />
        <h7 style={{ color: "gray" }}>
          Note : Contact your mentor if you need any clarification.
        </h7>
      </Container>
    </React.Fragment>
  );
}
