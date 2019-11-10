import React, {LegacyRef, useRef,useState, useEffect }  from "react"

import { Widget,addResponseMessage } from 'react-chat-widget';
import { ChatFeed, Message } from 'react-chat-ui'
import { ButtonGroup, Button, Form, Row, Col, Modal,Container} from 'react-bootstrap';

import 'react-chat-widget/lib/styles.css';
import io from 'socket.io-client';

type Option = {
  name:string,
  goTo:string
}
const socket = io('http://localhost:8000');
let map = {
  start:{
    options:[
      {name:'Kill Connor', goTo:'option2'},
      {name:'Sacrifice Hank', goTo:'option1'}
    ]
  },
  option2:{
  },
  option1:{
  }
}

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
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
const video = () => {
  const video:LegacyRef<HTMLVideoElement> = useRef(null);
  useEffect(() => {
    document.body.style.overflow = "hidden"
    // Update the document title using the browser API

    document.body.addEventListener("mousemove", function () {
      try{
        video.current.play()
      }catch{}
    })

  },[]);

  const [modalShow, setModalShow] = React.useState(false);
  let [nextVideo,setNextVideo] = useState('option1')
  let [currentName,setCurrentName] = useState('start')
  let [shouldAnswer,setShouldAnswer] = useState(false)
  let sentComment = ''

  socket.on('chat',
  (msg:string)=>{
    if(msg!=sentComment){

      addResponseMessage(msg)
    }
  });

  const newMessage = (message:string) => {
    console.log(`New message incoming! ${message}`);
    sentComment= message
    socket.emit('chat', message);
  }
  const playNextVideo = () => {
    setCurrentName(nextVideo)
  }

  const prepareNext = (option:Option) => {
    console.log(option,nextVideo)
    setNextVideo(option.goTo)
  }

  return (
    <div>

<MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
        <Widget
        title="Chat"
        handleNewUserMessage={newMessage}
        subtitle=""/>
      <style jsx>{``}</style>
    </div>
  )
}


export default video
