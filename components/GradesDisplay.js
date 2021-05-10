import React from "react";
import axios from "axios";
import { Jumbotron, Row, Table, Col, Container } from "react-bootstrap";
import Login from "./Login";
import Logout from "./Logout";
import PerformanceDisplay from "./NEW_PerformanceDisplay";

function GradesCard(props) {
  if (props.info.dashboard_data === "File Does not exist") {
    return <div>Attendance record not found</div>;
  }
  if (typeof undefined_var != typeof props.info.dashboard_data) {
    const data = props.info.dashboard_data.grades;
    // console.log("GRADES", data);
    let course_names = Object.keys(data);
    let course_credit = "";
    let course_grade = "";
    let course_points = "";
    let cgpa_sum = 0;
    let credit_sum = 0;

    let empty_cells = [<React.Fragment></React.Fragment>];

    let grade_table = course_names.map((course) => {
      // console.log(course, data[course]);
      if (
        ![
          "learning_center",
          "CGPA",
          "student_email",
          "student_name",
          "Sno",
          "roll_number",
        ].includes(course)
      ) {
        course_credit = parseInt(data[course]["Credits"]);
        course_grade = data[course]["Grade"];
        course_points = data[course]["Points"];

        let cgpa_computation =
          course_credit * parseFloat(course_points).toFixed(2);
        cgpa_sum += cgpa_computation;
        credit_sum += course_credit;
        // console.log(data["student_email"]);
        return (
          <tbody>
            <tr variant="flush">
              <th scope="row">{course}</th>
              <td> {course_grade}</td>
              <td> {course_credit}</td>
              <td> {course_points}</td>

              <td>{cgpa_computation}</td>
            </tr>
          </tbody>
        );
      } else {
        return <div></div>;
      }
    });

    const cgpa = (
      <div>
        <h4> CGPA: {data["CGPA"]}</h4>
      </div>
    );

    // console.log(course_names);
    for (let i = 0; i < 3; i++) {
      empty_cells.push(<td></td>);
    }

    let capitalize_student_name = "";
    if (typeof data["student_name"] != typeof undefined_var) {
      let student_name_arr = data["student_name"].split(" ");
      for (let i = 0; i < student_name_arr.length; i++) {
        capitalize_student_name +=
          student_name_arr[i].charAt(0).toUpperCase() +
          student_name_arr[i].slice(1).toLowerCase() +
          " ";
      }
    }

    return (
      <React.Fragment>
        <h4 style={{ fontFamily: "Raleway" }}>
          {capitalize_student_name} ({props.learningCenter})
        </h4>
        <h6 style={{ fontFamily: "Raleway" }}>{cgpa}</h6>
        <h6 style={{ fontFamily: "Raleway" }}>
          Data was last updated on {props.lastUpdated}
        </h6>
        <br />
        <Container>
          <Row>
            <Col style={{ paddingLeft: 15 }}>
              <Table bordered hover style={{ textAlign: "left" }}>
                <thead style={{ background: "#CC3314", color: "white" }}>
                  <tr style={{ textAlign: "center" }}>
                    <th scope="col" style={{ width: "20rem" }}>
                      Course Name
                    </th>

                    <th scope="col" style={{ width: "10rem" }}>
                      Grade
                    </th>
                    <th scope="col" style={{ width: "8rem" }}>
                      Credits
                    </th>
                    <th scope="col" style={{ width: "8rem" }}>
                      Points
                    </th>
                    <th scope="col" style={{ width: "8rem" }}>
                      Grade Points
                    </th>
                  </tr>
                </thead>
                {grade_table}
                <td style={{ fontWeight: "bold" }}>
                  CGPA (Sum of Grade Points / Sum of Credits)
                </td>

                {empty_cells}
                {/* <td>{cgpa_sum}</td> */}
                <td>
                  {cgpa_sum}/{credit_sum} = {(cgpa_sum / credit_sum).toFixed(1)}
                </td>
              </Table>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
  return <div>Attendance record not found</div>;
}

export default function DisplayGrades(props) {
  return (
    // <div className="App" style={{ marginLeft: 15, marginRight: 15 }}>
    <React.Fragment>
      <Jumbotron
        style={{
          height: "100px",
          padding: "0px",
          fontFamily: "Raleway",
          backgroundColor: "#001340"
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

        <h1 style={{color: "white", paddingTop: "1%"}}>Transcript</h1>
        <h6 style={{ color: "white"}}>
          This web page shows the details of grades in MSIT courses.
        </h6>
      </Jumbotron>
      <React.Fragment>
        <div>
          <GradesCard
            info={props.res}
            lastUpdated={props.lastUpdated}
            learningCenter={props.learningCenter}
          />
          <br />
          <br />
          <h7 style={{ color: "gray" }}>
            Note : Contact your mentor if you need any clarification.
          </h7>
        </div>
      </React.Fragment>
    </React.Fragment>
    // </div>
  );
}
