import React from "react";
import axios from "axios";
import {
  Button,
  Overlay,
  Popover,
  Card,
  Badge,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import PropTypes from "prop-types";

export default function SearchBar(props) {
  const [searchEmail, setSearchEmail] = React.useState("");
  const [activeOption, setActiveOption] = React.useState(0);
  const [filteredOptions, setFilteredOptions] = React.useState([]);
  const [showOptions, setShowOptions] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [target, setTarget] = React.useState(null);
  const ref = React.useRef(null);
  const [recentSearches, setRecentSearches] = React.useState([]);
  const [callAPI, setCallAPI] = React.useState(true);

  const propTypes = {
    options: PropTypes.instanceOf(Array).isRequired,
  };

  let optionList;
  if (showOptions && searchEmail) {
    if (filteredOptions.length) {
      optionList = (
        <div ref={ref}>
          <Overlay
            show={show}
            target={target}
            placement="bottom"
            container={ref.current}
            containerPadding={2}
          >
            <Popover id="popover-contained" style={{ overflow: "scroll" }}>
              <Popover.Content>
                <ul className="options">
                  {filteredOptions.map((optionName, index) => {
                    let className;
                    if (index === activeOption) {
                      className = "option-active";
                    }
                    return (
                      <li
                        className={className}
                        key={optionName}
                        onClick={(e) => {
                          setActiveOption(0);
                          setFilteredOptions([]);
                          setShowOptions(false);
                          setSearchEmail(e.target.innerText);
                          setShow(false);
                        }}
                      >
                        {optionName}
                      </li>
                    );
                  })}
                </ul>
              </Popover.Content>
            </Popover>
          </Overlay>
        </div>
      );
    } else {
      optionList = (
        <div className="no-options">
          <em>File not found</em>
        </div>
      );
    }
  }

  if (callAPI) {
    axios
      .get(
        `https://7seqbvouv4.execute-api.ap-south-1.amazonaws.com/default/StudentZoomData_MentorDashboard/?mentor_email=${props.mentorEmail}&operation=mentor_get_recent_searches`
      )
      .then((response) => {
        setCallAPI(false);
        setRecentSearches(response.data.recent_searches);
      });
  }

  // console.log(recentSearches);
  let recent_searches_data;
  if (recentSearches !== "No recent searches" && recentSearches !== []) {
    var i;
    let temp_searches = [];
    for (i = 0; i < recentSearches.length; i += 3) {
      temp_searches.push([
        recentSearches[i],
        recentSearches[i + 1],
        recentSearches[i + 2],
      ]);
    }
    recent_searches_data = temp_searches.map((email_group) => {
      const email_group_data = email_group.map((email) => {
        return (
          <Col>
            <Badge
              pill
              style={{
                cursor: "pointer",
                margin: "0.3rem",
                fontSize: "14px",
                color: "#CC3314",
              }}
              // variant="primary"
              onClick={(e) => {
                setSearchEmail(email);
                props.updateDropoutFlag(false);
                setShowOptions(false);
              }}
            >
              {email}
            </Badge>
          </Col>
        );
      });
      return <Row>{email_group_data}</Row>;
    });
  } else {
    recent_searches_data = <h5>No recent searches</h5>;
  }

  return (
    <div>
      <Card
        style={{
          width: "70rem",
          marginTop: "2rem",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#0E348D",
        }}
      >
        <Card.Header style={{ padding: 5 }}>
          <input
            style={{
              width: "20rem",
              height: "37px",
              background: "#F2F1F9",
              borderColor: "#F2F1F9",
              border: "none",
              // padding: "0.5rem",
            }}
            type="text"
            placeholder={"search student email id"}
            className="search-box"
            value={searchEmail}
            onChange={(e) => {
              const options = props.options;
              const userInput = e.target.value;
              const filteredOptions = options.filter(
                (optionName) =>
                  optionName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
              );
              setActiveOption(0);
              setFilteredOptions(filteredOptions);
              setShowOptions(true);
              setSearchEmail(e.target.value);
              setShow(true);
              setTarget(e.target);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                setActiveOption(0);
                setShowOptions(false);
                setSearchEmail(filteredOptions[activeOption]);
                setShow(false);
              } else if (e.keyCode === 38) {
                if (activeOption === 0) {
                  return;
                }
                setActiveOption(activeOption - 1);
              } else if (e.keyCode === 40) {
                if (activeOption === filteredOptions.length - 1) {
                  console.log(activeOption);
                  return;
                }
                setActiveOption(activeOption + 1);
              }
            }}
          />
          <input
            type="button"
            value="Search"
            style={{
              backgroundColor: "#CC3314",
              borderColor: "#CC3314",
              height: "37px",
              border: "none",
              color: "white",
            }}
            onClick={() => {
              props.updateErrorFlag(false);
              props.updateErrorMsg("");
              props.updateStudentEmail("");
              props.updateDisplayFlag(false);
              setShow(false);
              props.updateDropoutFlag(false);
              // setCallAPI(true);
              axios
                // .get(`http://127.0.0.1:5000/zoom_output/${props.userEmail}`)
                .get(
                  `https://7seqbvouv4.execute-api.ap-south-1.amazonaws.com/default/StudentZoomData_MentorDashboard/?student_email=${searchEmail}&mentor_email=${props.mentorEmail}&operation=mentor_get_data`
                )
                .then((response) => {
                  if (
                    response.data.dashboard_data === "File Does not exist" ||
                    response.data.dashboard_data === "Permission Denied"
                  ) {
                    console.log("ERROR");
                    props.updateErrorFlag(true);
                    props.updateErrorMsg(response.data.dashboard_data);
                  } else {
                    // console.log("NO ERROR");
                    props.updateDisplayFlag(true);
                    props.updateStudentEmail(searchEmail);
                  }
                });

              axios
                .get(
                  `https://7seqbvouv4.execute-api.ap-south-1.amazonaws.com/default/StudentZoomData_MentorDashboard/?student_email=${searchEmail}&mentor_email=${props.mentorEmail}&operation=mentor_update_search`
                )
                .then((response) => {
                  // console.log(response);
                })
                .then(() => {
                  axios
                    .get(
                      `https://7seqbvouv4.execute-api.ap-south-1.amazonaws.com/default/StudentZoomData_MentorDashboard/?mentor_email=${props.mentorEmail}&operation=mentor_get_recent_searches`
                    )
                    .then((response) => {
                      setRecentSearches(response.data.recent_searches);
                    });
                });

              axios
                .get(
                  `https://7seqbvouv4.execute-api.ap-south-1.amazonaws.com/StudentZoom/StudentZoomData_CoursePerformance/?email=${searchEmail}`
                )
                .then((response) => {
                  if (response.data === "Student dropped out") {
                    props.updateDropoutFlag(true);
                    props.updateData("");
                    props.updateScore("");
                    props.updateSSScore("");
                  } else {
                    props.updateData(response.data);
                    props.updateScore(response.data.course_attendance.IT);
                    props.updateSSScore(response.data.course_attendance.SS);
                  }
                });

              // const urlValue = `https://lzeh91brdj.execute-api.ap-south-1.amazonaws.com/Deveploment/?email=${searchEmail}`;
              // axios
              //   .get(urlValue)
              //   .then((response) => {
              //     const apiResult = response.data.result;
              //     if (apiResult === "Attendance record not found") {
              //       props.updateScore("");
              //       props.updateSSScore("");
              //     } else {
              //       props.updateScore(response.data.percentages);
              //       props.updateSSScore(response.data.ss_percentages);
              //     }
              //   })
              //   .catch((exception) => {
              //     console.log("Exception in the API: ", exception);
              //   });
            }}
          />

          {optionList}
        </Card.Header>
        <Card.Body style={{ backgroundColor: "white" }}>
          {recent_searches_data}
        </Card.Body>
      </Card>
    </div>
  );
}
