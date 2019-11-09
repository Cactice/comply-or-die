import React, {LegacyRef, useRef,useState, useEffect }  from "react"

import { ButtonGroup, Button, Row, Col, Container} from 'react-bootstrap';

type Option = {
  name:string,
  goTo:string
}

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

const video = () => {
  const video:LegacyRef<HTMLVideoElement> = useRef(null);
  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.body.style.backgroundColor = "black"
    // Update the document title using the browser API

    document.body.addEventListener("mousemove", function () {
      try{
        video.current.play()
      }catch{}
    })

  },[]);
  let [nextVideo,setNextVideo] = useState('option1')
  let [currentName,setCurrentName] = useState('start')

  const playNextVideo = () => {
    setCurrentName(nextVideo)
  }

  const prepareNext = (option:Option) => {
    console.log(option,nextVideo)
    setNextVideo(option.goTo)
  }

  return (
    <div>
      <video autoPlay key={currentName} ref={video} onEnded={playNextVideo}  width={window.innerWidth} height={window.innerHeight}>
      <source src={`/${currentName}.mp4`}
              type="video/mp4"/>
      </video>
      <div style={{
        position:"absolute" ,width: "100%", height: "100%", left:0, top:0,
        display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "end",
          margin:"30px"
        }}>
          <ButtonGroup aria-label="Basic example">
            {map.start.options.map((option,i) => (
              <Button onClick={()=>{prepareNext(option)}} key={i} variant="light">{option.name}</Button>
            ))}
          </ButtonGroup>
      </div>
      <style jsx>{``}</style>
    </div>
  )
}


export default video
