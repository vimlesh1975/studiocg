'use client'

import React, { } from 'react'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import Rawtcpmosclient from './Rawtcpmosclient'
import RedisTest from './RedisTest'
import Mosapi from './Mosapi'
import Npmmosclient from './Npmmosclient'
import R3Controller from './R3Controller'
import Mongodb from './Mongodb'
import Nrcs2 from './Nrcs2'
import MosServer from './MosServer'
import VideoPlayer from './components/VideoPlayer';
import NrcsScroll from './components/NrcsScroll';
import ScriptTest from './components/ScriptTest';




// import Scroll from './components/Scroll'

const aa1 = 0;

import dynamic from "next/dynamic";

const Scroll = dynamic(() => import("./components/Scroll"), {
  ssr: false,
});


export default function Page() {
  const [aa, setA] = React.useState(0)

  // if (!isClient || data.length === 0) return null

  return (<div>
    <Tabs
      forceRenderTabPanel={true}
    >
      <TabList>

        <Tab> NRCS Scroll</Tab>
        <Tab> Video Player</Tab>
        <Tab> Scroll</Tab>
        <Tab> NRCS</Tab>
        <Tab> Mongodb</Tab>
        <Tab>R³ Scene Controller</Tab>
        <Tab> Raw Tcpmosclient</Tab>
        <Tab> Reddis</Tab>
        <Tab> MosApi</Tab>
        <Tab> Npmmosclient</Tab>
        <Tab> MosServer</Tab>
        <Tab> ScriptTest</Tab>

      </TabList>

      <TabPanel>
        < NrcsScroll />
      </TabPanel>
      <TabPanel>
        < VideoPlayer />
      </TabPanel>
      <TabPanel>
        < Scroll />
      </TabPanel>
      <TabPanel>
        < Nrcs2 />
      </TabPanel>
      <TabPanel>
        < Mongodb />
      </TabPanel>
      <TabPanel>
        <R3Controller />
      </TabPanel>
      <TabPanel>
        < Rawtcpmosclient />
      </TabPanel>

      <TabPanel>
        < RedisTest />
      </TabPanel>

      <TabPanel>
        < Mosapi />
      </TabPanel>

      <TabPanel>
        < Npmmosclient />
      </TabPanel>
      <TabPanel>
        < MosServer />
      </TabPanel>
      <TabPanel>
        < ScriptTest />
      </TabPanel>
    </Tabs>


  </div>)
}
