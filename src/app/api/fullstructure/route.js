

import { NextResponse } from 'next/server'
import { getR3Client } from '../../lib/r3client.js'
import fs from 'fs'
import path from 'path'
import { MongoClient } from 'mongodb';



export async function GET() {


  const mongoUri = process.env.MONGOURI;// "mongodb://localhost:27017";
  const MongoClient1 = new MongoClient(mongoUri);
  await MongoClient1.connect();

  const db = MongoClient1.db(process.env.PROJECT_NAME);
  const collection = db.collection('Graphics');
  const allDocs = await collection.find().toArray();
  // console.log(allDocs)

  var allDocs2 = []

  const adminDb = MongoClient1.db().admin();
  const { databases } = await adminDb.listDatabases();

  const results = [];

  for (const dbInfo of databases) {
    const dbName = dbInfo.name;
    const db = MongoClient1.db(dbName);
    const collections = await db.listCollections().toArray();
    if (collections.some(c => c.name === "GraphicTemplates")) {
      results.push(dbName);
    }
  }

  for (const result of results) {
    const db = MongoClient1.db(result);
    const collection = db.collection('Graphics');
    const aa = await collection.find().toArray();
    allDocs2.push(...aa)
  }

  const sceneNames = allDocs2
    .filter(doc => doc.SceneFullName && doc.SceneFullName.includes('25IN'))
    .map(doc => doc.SceneFullName);

  console.log(sceneNames)



  const r3 = await getR3Client()
  const projects = await r3.getProjects()
  const projectData = []

  for (const project of projects) {
    const scenes = await r3.getScenes(project)
    const sceneData = scenes.map((sceneFullName) => {
      const cleanName = sceneFullName.includes('/')
        ? sceneFullName.split('/')[1]
        : sceneFullName

      // Try reading the thumbnail
      let thumbnail = null
      try {
        const filePath = path.join(
          process.env.R3_PATH || 'C:/Users/Administrator/Documents/R3.Space.Projects/projects',
          project,
          cleanName,
          'thumb.png'
        )
        const fileData = fs.readFileSync(filePath)
        thumbnail = `data:image/png;base64,${fileData.toString('base64')}`
      } catch (err) {
        // No thumb.png or error reading — ignore
        thumbnail = null
      }

      return {
        name: cleanName,
        thumbnail
      }
    })

    projectData.push({
      name: project,
      scenes: sceneData,

    })
  }

  // console.log(allDocs2)
  // return NextResponse.json({ projectData, allDocs })
  return NextResponse.json({ projectData, allDocs: allDocs2 })
}
