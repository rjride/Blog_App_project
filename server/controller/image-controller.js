//import { request, response } from "express";
import grid from 'gridfs-stream';
//import { GridFSBucket } from "mongodb";
import mongoose  from "mongoose";


const url = 'http://localhost:8000'


const conn = mongoose.connection;
let gfs, gridfSBucket;
conn.once('open', () => {
    gridfSBucket = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName: 'fs'
    });
    gfs = grid(conn.db,mongoose.mongo);
    gfs.collection('fs');
})

export const uploadImage = (request,response) =>{
    try {
        if (!request.file) {
            return response.status(404).json({ msg:"File not found"});
        }
        const imageUrl = `${url}/file/${request.file.filename}`;
        return response.status(200).json(imageUrl);
    } catch (error) {
        console.error("Error uploading image:", error);
        return response.status(500).json("Internal Server Error");
    }
}

export const getImage = async (request,response) =>{
        try{
       const file = await gfs.files.findOne({filename: request.params.filename});
       const readstream = gridfSBucket.openDownloadStream(file._id);
       readstream.pipe(response);
        }catch(error){
       return response.status(500).json({msg: error.message});
        }
}