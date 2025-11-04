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

import dynamic from "next/dynamic";
const Scroll = dynamic(() => import("./components/Scroll"), {
  ssr: false,
});
const ScrollBreakingNewsClock = dynamic(() => import("./components/ScrollBreakingNewsClock"), {
  ssr: false, // ✅ disables SSR for this component
});

export default function Page() {
  const [aa, setA] = React.useState(0)

  return (<div>
    <Tabs
      forceRenderTabPanel={true}
    >
      <TabList>

        <Tab> Scroll BreakingNews Clock</Tab>
        <Tab> NRCS Scroll</Tab>
        <Tab> Video Player</Tab>
        <Tab> General Scroll and Other Templates Testing</Tab>
        <Tab> NRCS linking of Templates and script to Samvad Teleprompter</Tab>
        <Tab> Mongodb</Tab>
        <Tab>R³ Scene Controller</Tab>
        <Tab> Raw Tcpmosclient</Tab>
        <Tab> Reddis</Tab>
        <Tab> MosApi</Tab>
        <Tab> Npmmosclient</Tab>
        <Tab> MosServer</Tab>

      </TabList>

      <TabPanel>
        < ScrollBreakingNewsClock />
      </TabPanel>
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

    </Tabs>


  </div>)
}
