import React, { LegacyRef, useRef, useState, useEffect } from "react";

import { Widget, addResponseMessage } from "react-chat-widget";
import { ChatFeed, Message } from "react-chat-ui";
import {
  ButtonGroup,
  Button,
  Form,
  Row,
  Col,
  Modal,
  Container
} from "react-bootstrap";
import { Option } from "./video";
import "react-chat-widget/lib/styles.css";
import io from "socket.io-client";

const socket = io("http://10.129.167.84:8000");
let map = {
  start: {
    options: [
      { name: "Kill Connor", goTo: "option2" },
      { name: "Sacrifice Hank", goTo: "option1" }
    ]
  },
  option2: {},
  option1: {}
};

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ButtonGroup aria-label="Basic example">
          {props.options.map((option: Option, i) => (
            <Button
              onClick={() => {
                props.guessOption(option);
              }}
              key={i}
              variant="light"
            >
              {option.name}
            </Button>
          ))}
        </ButtonGroup>
        {/* <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p> */}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
const video = () => {
  const video: LegacyRef<HTMLVideoElement> = useRef(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Update the document title using the browser API

    document.body.addEventListener("mousemove", function() {
      try {
        video.current.play();
      } catch {}
    });
  }, []);

  const [modalShow, setModalShow] = React.useState(false);
  let [nextVideo, setNextVideo] = useState("option1");
  let [currentName, setCurrentName] = useState("start");
  let sentComment = "";

  let [options, setOptions] = useState([]);
  socket.on("chat", (msg: string) => {
    if (msg != sentComment) {
      addResponseMessage(msg);
    }
  });
  socket.on("showOptions", (msg: string) => {
    let msgObj: Option[] = JSON.parse(msg);
    setOptions(msgObj);
    setModalShow(true);
  });

  const guessOption = (option: Option) => {
    const optionStr = JSON.stringify(option);
    socket.emit("guessOption", optionStr);
    setModalShow(false);
  };

  const newMessage = (message: string) => {
    console.log(`New message incoming! ${message}`);
    sentComment = message;
    socket.emit("chat", message);
  };
  const playNextVideo = () => {
    setCurrentName(nextVideo);
  };

  const prepareNext = (option: Option) => {
    console.log(option, nextVideo);
    setNextVideo(option.goTo);
  };

  return (
    <div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        guessOption={guessOption}
        options={options}
      />
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <img
          src="/blink.gif"
          style={{ maxWidth: "100%", height: "auto" }}
        ></img>
        <h3>Enjoy The Movie</h3>
      </div>
      <Widget title="Chat" handleNewUserMessage={newMessage} subtitle="" />
      <style jsx>{``}</style>
    </div>
  );
};

export default video;
