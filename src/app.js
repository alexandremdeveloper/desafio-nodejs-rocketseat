const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryItem = repositories.findIndex(repository => 
    repository.id === id
  );

  if (findRepositoryItem === -1) {
    return response.status(400).json({ error: "Repository does not exist at the list." })
  }

  const newRepository = {
      id,
      title,
      url,
      techs,
      likes: repositories[findRepositoryItem].likes,
  };

  repositories[findRepositoryItem] = newRepository;

  return response.json(newRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryItem = repositories.findIndex(repository => 
    repository.id === id
  );

  if (findRepositoryItem >= 0) {
    repositories.splice(findRepositoryItem, 1);
  } else {
    return response.status(400).json({ error: "Reposity inexistent." })
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepositoryItem = repositories.findIndex(repository => 
    repository.id === id
  );

  if (findRepositoryItem === -1) {
    return response.status(400).json({ error: 'Repository does not exist at the list.' })
  }

  repositories[findRepositoryItem].likes += 1;

  return response.json(repositories[findRepositoryItem]);
});

module.exports = app;
