import React, { LegacyRef, useRef, useState, useEffect } from "react";

import { ButtonGroup, Button, Row, Col, Container } from "react-bootstrap";

import io from "socket.io-client";
const socket = io("http://10.129.167.84:8000");

export type Option = {
  id: string;
  name: string;
  goTo: string;
};
let map = {
  scn_1: {
    options: [
      { name: "Refuse to help", goTo: "scn_2_N", id: "scn_1@0" },
      { name: "Introduce the boyfriend", goTo: "scn_2_Y", id: "scn_1@1" }
    ]
  },
  scn_2_N: {
    options: [{ name: "Die", goTo: "died", id: "scn_2_N@0" }]
  },
  scn_3_N: {
    options: [{ name: "Die", goTo: "died", id: "scn_3_N@0" }]
  },
  scn_4_N: {
    options: [{ name: "Die", goTo: "died", id: "scn_4_N@0" }]
  },
  scn_2_Y: {
    options: [
      {
        name: "Accept the invitation to join",
        goTo: "scn_3_N",
        id: "scn_2_Y@0"
      },
      { name: "Decline", goTo: "scn_3_Y", id: "scn_2_Y@1" }
    ]
  },
  scn_3_Y: {
    options: [
      { name: "Keep it a secret", goTo: "scn_4_N", id: "scn_3_Y@0" },
      {
        name: "Disclose mentioning the budget",
        goTo: "scn_4_Y",
        id: "scn_3_Y@1"
      }
    ]
  },
  scn_4_Y: {
    options: [{ name: "Live", goTo: "complied", id: "scn_4_Y@1" }]
  },
  died: {},
  complied: {
    options: [{ name: "Live", goTo: "complied", id: "complied@1" }]
  },
  start: {
    options: [
      { name: "Kill Connor", goTo: "option2", id: "start@0" },
      { name: "Sacrifice Hank", goTo: "option1", id: "start@1" }
    ]
  },
  option2: {},
  option1: {}
};

const video = () => {
  const video: LegacyRef<HTMLVideoElement> = useRef(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "black";
    // Update the document title using the browser API

    document.body.addEventListener("mousedown", function() {
      try {
        video.current.play();
      } catch {}
    });
    socket.emit("start", "");
  }, []);
  let [nextVideo, setNextVideo] = useState("scn_2_N");
  let [currentName, setCurrentName] = useState("scn_1");
  const [count, setCount] = useState(8);
  const [poll, setPoll] = useState({});
  const [zero, setZero] = useState({});
  const [one, setOne] = useState({});

  const [timeLeft, setTimeLeft] = useState(8);

  socket.on("guessOption", (msg: string) => {
    console.log(msg);
    let { player_id, ...msgObj } = JSON.parse(msg);
    let [question, index]: string[] = msgObj.id.split("@");
    if (poll[question] == null) {
      let newPoll = poll;
      newPoll[question] = {};
      setPoll(newPoll);
    }
    if (!poll[question][player_id]) {
      if (poll[question][index] == null) {
        let newPoll = poll;
        newPoll[question][player_id] = true;
        newPoll[question][index] = 1;
        setPoll(newPoll);
      } else {
        let newPoll = poll;
        newPoll[question][index] += 1;
        setPoll(newPoll);
      }
    }
  });

  const answerOption = (option: Option) => {
    console.log("answer", option);
    socket.emit("answerOption", option);
  };
  const showOptions = (options: Option[]) => {
    socket.emit("showOptions", JSON.stringify(options));
  };
  const playNextVideo = () => {
    // setNextVideo(map[nextVideo].options[0])
    // setCurrentName(nextVideo)
    showOptions(map[currentName].options);
    let refresh = setTimeout(function() {
      console.log("count");
      let guess;
      let name;
      try {
        guess = poll[currentName]["0"] > poll[currentName]["1"] ? 0 : 1;
        name = map[currentName].options[guess].goTo;
      } catch {
        name = map[currentName].options[0].goTo;
      }
      console.log("guessname", name);
      setNextVideo(map[name].options[0]);
      setCurrentName(name);
      answerOption(map[currentName].options[guess]);
      video.current.play();
    }, 5000);
  };

  const prepareNext = (option: Option) => {
    setNextVideo(option.goTo);
  };

  return (
    <div>
      <video
        key={currentName}
        ref={video}
        onEnded={playNextVideo}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <source src={`/${currentName}.mp4`} type="video/mp4" />
      </video>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "end",
          margin: "30px"
        }}
      >
        <ButtonGroup aria-label="Basic example">
          {map[currentName] != null
            ? map[currentName].options.map((option, i) => (
                <Button
                  onClick={() => {
                    prepareNext(option);
                  }}
                  key={i}
                  variant="light"
                >{`${option.name}`}</Button>
              ))
            : null}
          {poll[currentName] != null &&
            Object.keys(poll[currentName]).forEach((key, index) => (
              <Button
                key={key}
                variant="light"
              >{`${poll[currentName][index]}`}</Button>
            ))}
        </ButtonGroup>
      </div>
      <style jsx>{``}</style>
    </div>
  );
};

export default video;
