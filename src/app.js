const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());


function logRequests(req, res, next){
  const { method , url } = req
  const logLabel = `[${method.toUpperCase()}] ${url}`
  console.time(logLabel)
  next()
  console.timeEnd(logLabel)
}
app.use(logRequests)


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body
  const repository = {id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body

  const repoIndex = repositories.findIndex( item => item.id === id)
  
  if (repoIndex< 0){
    return response.status(400).json({res: 'Repositories not found.'})
  }
  const newRepository = { id, title, url, techs,likes: repositories[repoIndex]['likes'] }
  repositories[repoIndex] = newRepository
  return response.json(newRepository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repoIndex = repositories.findIndex( item => item.id === id)
  
  if (repoIndex< 0){
    return response.status(400).json({res: 'Repositories not found.'})
  }
  repositories.splice(repoIndex, 1)

  return response.status(204).send()
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repoExist = repositories.find( item => item.id === id)
  
  if (!repoExist){
    return response.status(400).json({res: 'Repositories not found.'})
  }
  repoExist['likes']=repoExist['likes']+1
  return response.json(repoExist)
});

module.exports = app;
