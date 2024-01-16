"use client"
import { ModeToggle } from '@/components/toggle-theme';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { beep } from '@/utils/audio';
import { Camera, FlipHorizontal, PersonStanding, Video, Volume2 } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { ThreeCircles } from 'react-loader-spinner';
import Webcam from 'react-webcam';
import { toast } from 'sonner';
type Props = {}

const HomePage = (props: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mirrored,setMirrored] = useState <boolean> (false)
  const [isRecording, serIsRecording] = useState<boolean> (false)
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false)
  const [volume, setVolume] = useState(0.8)
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
            <Button variant={'outline'} size={'icon'} onClick={()=> {setMirrored((prev)=> !prev )}}><FlipHorizontal/></Button>
            <Separator className='my-2'/>
          </div>
      {/*middle */}
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
      </div>
  )
  //handler
  function userPromptScreenshot() {
    //take picture 

    //save it to downloads 

  }
   function userPromptRecord() {
    //check if Recording

      //then stop recording
    
      //and save recording

    //if not recording
       //start recording 


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
          <strong>Dark Mode/Sys Theme</strong>
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
          <strong>Volume Slider 🔊</strong>
          <p>Adjust the volume level of the notifications.</p>
        </li>
        <li>
          <strong>Camera Feed Highlighting 🎨</strong>
          <p>
            Highlights persons in{" "}
            <span style={{ color: "#FF0F0F" }}>red</span> and other objects in{" "}
            <span style={{ color: "#00B612" }}>green</span>.
          </p>
        </li>
        <Separator />
        <li className="space-y-4">
          <strong>Share your thoughts 💬 </strong>
          <br />
          <br />
          <br />
        </li>
      </ul>
    </div>
  }
}

export default HomePage