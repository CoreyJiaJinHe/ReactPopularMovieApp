const express=require("express");
const mongoose = require('mongoose');
const cors=require('cors')
const dotenv=require('dotenv');
const todoModel=require('./models/todoModel')

dotenv.config();

const app=express();
const port = process.env.PORT || 8080;

//Steps to starting a new node.js
//Initialize new folder
//npm init
//npm install express, mongoose, cors, dotenv, nodemon, body-parser