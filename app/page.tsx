"use client"
import { ModeToggle } from '@/components/toggle-theme'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { beep } from '@/utils/audio'
import { Camera, FlipHorizontal, PersonStanding, Video, Volume2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import Webcam from 'react-webcam'
import { toast } from 'sonner'
import * as cocossd from '@tensorflow-models/coco-ssd'
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { DetectedObject, ObjectDetection } from '@tensorflow-models/coco-ssd'
import { drawOnCanvas } from '@/utils/draw'
import SocialMediaLinks from '@/components/social-links'
import LandingPage from '@/components/landing-page'

type Props = {}
let interval: any = null
let stopTimeOut: any = null

const HomePage = (props: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
      //sttedsssssssssssssssssssss
  const [mirrored,setMirrored] = useState <boolean> (true)
  const [isRecording, setIsRecording] = useState<boolean> (false)
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false)
  const [volume, setVolume] = useState(0.8)
  const [model,setModel] = useState<ObjectDetection>();
  const [loading, setLoading] = useState(false)

 const mediaRecorderRef =useRef<MediaRecorder | null>(null)

 // intializing the media recorder
 useEffect(() => {
  <LandingPage/>
  if(webcamRef && webcamRef.current){
    const stream = (webcamRef.current.video as any).captureStream()
      if(stream){
        mediaRecorderRef.current =new MediaRecorder(stream)
        mediaRecorderRef.current.ondataavailable = (e)=>{
          if(e.data.size>0){
            const recordedBlob = new Blob([e.data], {type: 'video'})
            const videoURL = URL.createObjectURL(recordedBlob)

            const a = document.createElement('a')
            a.href = videoURL
            a.download = `${formatDate(new Date ())}.webm`
            a.click()

          }
        }
        mediaRecorderRef.current.onstart = (e) =>{
          setIsRecording(true)
        }
        mediaRecorderRef.current.onstop = (e) =>{
          setIsRecording(false)
        }
      }
  }
  },[webcamRef])

  useEffect(() => {
    setLoading(true)
    initModel()

  }, [])
//loads model 
//set it in a state variable

  async function initModel(){
    const loadedModel: ObjectDetection= await cocossd.load({
      base: 'mobilenet_v2'
     })
    setModel(loadedModel)
  }
  useEffect(()=> {
      if (model){
        setLoading(false)
      }
  },  [model])


  async function runPrediction (){
    if (model  && webcamRef.current && webcamRef.current.video 
      && webcamRef.current.video.readyState ===4)
    {
      const predictions: DetectedObject[] = await model.detect(webcamRef.current.video)
      resizeCanvas(canvasRef,webcamRef)
      drawOnCanvas(mirrored, predictions,canvasRef.current?.getContext('2d'))
    
      let isPerson: boolean =  false   

      if (predictions.length > 0) {
        predictions.forEach((predictions) => {
         isPerson = predictions.class === 'person'
        })
        if(isPerson && autoRecordEnabled){
          startRecording(true)
        }
      }
    }
  }

  useEffect(()=> {
    interval =setInterval(() => {
      runPrediction();
    },100)

    return ()=> clearInterval(interval)},
  [webcamRef.current, model, mirrored, autoRecordEnabled, runPrediction])
  return (
    <div className='flex h-screen'>
      
      {/*this is the left devision of webcam and canvas */}
      <div className='relative'>
        <div className='relative h-screen w-full'>
          <Webcam ref={webcamRef} 
          mirrored={mirrored} className='h-full w-full object-contain p-2' />
          <canvas ref={canvasRef} className='absolute top-0 h-full w-full object-contain '></canvas>
        </div>
      </div>
      {/*this is the Right division container for the webcam and the canvas */}
    <div className='flex flex-row flex-1'>
      <div className='border-primary/5 border-2 max-w-xs flex flex-col gap-2 justify-between shadow-md rounded-m p-4'>
      {/* top*/}
          <div className='flex flex-col gap-2'>
            <ModeToggle/>
            <Button variant={'outline'} size={'icon'} onClick={()=> {setMirrored((prev)=> !prev )}}>
            <FlipHorizontal/></Button>
            <Separator className='my-2'/>
          </div>
      {/*middle    */}
        <div className='flex flex-col gap-2'>
           <Separator className='my-2'/>
           <Button variant={'outline'} size={'icon'} onClick= {userPromptScreenshot}>

            <Camera/>

           </Button>

          <Separator className='my-2'/>
           <Button variant={isRecording ? 'destructive' :  'outline'} size={'icon'} onClick= {userPromptRecord}>
            <Video/>
           </Button>
        <Separator className='my-2'/>
          <Button variant={autoRecordEnabled ?  'destructive': 'outline'} size={'icon'}
          onClick={toggleAutoRecord}>
         {autoRecordEnabled ? <ThreeCircles color='white' height= {35} /> : <PersonStanding/>} </Button>
        </div> 
      {/* bottom*/}
        <div className='flex flex-col gap-2'>       
       <Separator className='my-2'/>
       <Popover>
           <PopoverTrigger>
        <Button variant={'outline'} size={'icon'}>
        <Volume2/>
        </Button>
           </PopoverTrigger>
           <PopoverContent>
            <Slider max={1} min={0} step={0.2} defaultValue={[volume]} onValueCommit={(val) => 
            {setVolume (val[0])
              beep(val[0]) 
             }} />
           </PopoverContent>
       </Popover> 
        </div>
      </div>
      <div className='h-full flex-1 py-4 overflow-y-scroll '>
        <RenderFeatureHightsSection />
      </div>
    </div>
    {loading && <div className='z-50 absolute w-full h-full flex items-center justify-center bg-primary-foreground '>
      Getting things ready Please wait.... <ThreeCircles height={50} color='red'/>
      </div>}
      </div>
  )
  //handler
  function userPromptScreenshot() {
    //take picture 
      if (!webcamRef.current){
        toast('Camera not found please can you refresh man It ')
      }
      else{
        //the image quality or the screenshot
         const imgSrc =  webcamRef.current.getScreenshot()
         console.log(imgSrc)
         const blob = base64toBlob(imgSrc)

         //save it to downloads with a time date months format 
         const url = URL.createObjectURL(blob)
         const a = document.createElement('a')
         a.href=url
         a.download =`${formatDate(new Date ())}.png`
         a.click()
      }
  }
   function userPromptRecord() {
    if(webcamRef.current){
      toast('Camera is found. please Refresh it ')
    }
    if (mediaRecorderRef.current?.state == 'recording'){
      //check if Recording
      //then stop recording
      //and save recording
      mediaRecorderRef.current.requestData()
      clearTimeout(stopTimeOut)
      mediaRecorderRef.current.stop()
      toast('The Record is saved to downloads Bro')

    }else{
 // toast('The Record is not saved')
 //if not recording
 //start recording 
       startRecording(false)
      }
  }
  //there is a sound when it webcam and mediaRecorder are on or start 

  
  function startRecording(doBeep: boolean){
    if (webcamRef.current && mediaRecorderRef.current?.state !== 'recording')
    {
      mediaRecorderRef.current?.start()
      doBeep && beep (volume)
      stopTimeOut =  setTimeout(()=> {
        if(mediaRecorderRef.current?.state === 'recording'){
          mediaRecorderRef.current.requestData() 
          mediaRecorderRef.current?.stop()
        }
      }, 30000)
    }
  }
function toggleAutoRecord(){

  if(autoRecordEnabled){
    setAutoRecordEnabled(false)
    toast ("AutoRecord is Disabled")
    //show toast to user to notify the change
  }
  else{
    setAutoRecordEnabled(true)
    toast ("AutoRecord is Enabled")
    //show toast 
  }
}

//inner component
    function RenderFeatureHightsSection (){
    return <div className='text-xs text-muted-foreground'>
      <ul className='space-y-4'>
        <li>
          <strong>Dark Mode/System Theme</strong>
          <p>Toggle between dark mode and system theme</p>

        </li>
        <li>
          <strong>Horizontal flip </strong>
          <p>Adjust Horizontal orientation </p>
        </li>
        <Separator />
        <li> 
        <strong>Take pictures </strong>
        <p>capture snapshots from the video </p>
        </li>
        <li>
        <strong>Manual video record</strong>
        <p>Manually record video clips as needed</p>
        </li> 
        <Separator/>
        <li>
          <strong>Enable/Disable Auto Record</strong>
          <p> option to enable/disable auto recording whenever required</p>
        <Button className='h-6 w-6 my-2'
            variant={autoRecordEnabled ? 'destructive' : 'outline'}
            size={'icon'}
            onClick={toggleAutoRecord}
          >
            {autoRecordEnabled ? <ThreeCircles color='white' height={13} /> : <PersonStanding size={14} />}

          </Button>
        </li>

        <li>
          <strong>Volume Slider </strong>
          <p>Adjust the volume level of the notifications.</p>
        </li>
        <li>
          <strong>Camera Feed Highlighting </strong>
          <p>
            Highlights persons in{" "}
            <span style={{ color: "" }}>red</span> and other objects in{" "}
            <span style={{ color: "" }}>green</span>.
          </p>
        </li>
        <Separator />
        <li className="space-y-4">
          <strong>Connect with me on my socialMedia </strong>
          <SocialMediaLinks/>
          <br />
          <br />
          <br />
        </li>
      </ul>
    </div>
  }
}

export default HomePage

function resizeCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, webcamRef: React.RefObject<Webcam>) {
 const canvas = canvasRef.current
 const video = webcamRef.current?.video
 
 if ((canvas && video ))
 {
  const {videoWidth, videoHeight} = video
  canvas.width = videoWidth
  canvas.height = videoHeight
 }
}
function formatDate (d: Date){
  const formattedDate =  [
    (d.getMonth() + 1).toString().padStart(2,"0"),
     d.getDate().toString().padStart(2,"0"),
     d.getFullYear(),         ]
     
     .join("" ) + " "+ [
      d.getHours().toString().padStart(2,"0"),
      d.getMinutes().toString().padStart(2,"0"),
      d.getSeconds().toString().padStart(2,"0"),
     ].join("-")
     return formatDate;
}
function base64toBlob(base64Data: any ){
  const byteCharacters = atob(base64Data.split(",")[1])
  const arrayBuffer = new ArrayBuffer(byteCharacters.length)
  const byteArray = new Uint8Array(arrayBuffer)

  for(let i = 0; i < byteCharacters.length; i++){
    byteArray[i] = byteCharacters.charCodeAt(i)

  }
  return new Blob ([arrayBuffer], {type: "image/png"})
}