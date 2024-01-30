import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { connect } from './config.js';
import { chatModel } from './chat.schema.js';

const app=express();
//1.create server using http
const server=http.createServer(app);
//2.create socker server
const io=new Server((server),{
    cors:{
        origin:'*',
        method:['GET','POST']
    }
});
//3.use socket events
io.on('connection',(socket)=>{
    console.log("Connection is established");
    socket.on("join",(data)=>{
        socket.username=data;
        //load the previous messages to clients
        chatModel.find().sort({timestamp:1}).limit(75)
        .then(messages=>{
            socket.emit('load_messages',messages)
        }).catch(err=>{
            console.log(err);
        })
    })
    socket.on('new_message',(message)=>{

        let userMessage={
            username:socket.username,
            message:message
        }
        const newChat=new chatModel({
            username:socket.username,
            message:message,
            timestamp:new Date()
        });
        newChat.save();
        //broadcast this message to all clients
        socket.broadcast.emit('broadcast_message',userMessage);
    })
    socket.on('disconnect',()=>{
        console.log("Connection is disconnected");
    })
});
server.listen(3100,()=>{
    console.log("Server is running on port 3000");
    connect();
})