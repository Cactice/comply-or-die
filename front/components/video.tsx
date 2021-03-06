import React, { LegacyRef, useRef, useState, useEffect } from "react";

import { ButtonGroup, Button, Row, Col, Container } from "react-bootstrap";

import io from "socket.io-client";
const socket = io("http://0.0.0.0:8000");

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
    options: [{ name: "Live", goTo: "complied", id: "scn_4_Y@0" }]
  },
  died: {},
  complied: {
    options: [{ name: "Live", goTo: "complied", id: "complied@0" }]
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
    let { player_id, ...msgObj } = JSON.parse(msg);
    let [question, index]: string[] = msgObj.id.split("@");
    if (poll[question] == null) {
      setPoll(prevPoll => {
        prevPoll[question] = {};
        console.log(prevPoll);
        return prevPoll;
      });
    }
    if (poll[question][player_id] == null) {
      if (poll[question][index] == null) {
        console.log(map);
        setPoll(prevPoll => {
          prevPoll[question][player_id] = true;
          prevPoll[question][index] = 1;
        return prevPoll;
        });
      } else {
        console.log(msg);
        setPoll(prevPoll => {
          prevPoll[question][index] += 1;
        return prevPoll;
        });
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
    setTimeout(function() {
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
        autoPlay
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
          {map[currentName] != null &&
            map[currentName].options.map((option, i) => (
              <Button
                onClick={() => {
                  prepareNext(option);
                }}
                key={i}
                variant="light"
              >{`${option.name}`}</Button>
            ))}
        </ButtonGroup>
          {poll[currentName] != null &&
            Object.keys(poll[currentName]).forEach((key, index) => {
              if(typeof poll[currentName][key] !== 'number'){return }
              console.log("jackpot!!", poll[currentName][key]);
              return (
                <Button
                  style={{ color: "white", backgroundColor: "black" }}
                >Hello {poll[currentName][key]}</Button>
              );
            })}
      </div>
      <style jsx>{``}</style>
    </div>
  );
};

export default video;
