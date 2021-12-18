const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const addDay = require("date-fns/addDays");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");

const app = express();

const dbPath = path.join(__dirname, "todoApplication.db");

let database = null;

const initializationDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializationDbAndServer();

const convertDBObjectTOResponseObject = (dbObject) => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    category: dbObject.category,
    priority: dbObject.priority,
    status: dbObject.status,
    dueDate: dbObject.due_date,
  };
};

const validCheck = (request, response, next) => {
  const { status, priority, category, dueDate } = request.body;
  const statusArray = ["TO DO", "PROGRESS", "DONE"];
  const priorityArray = ["HIGH", "MEDIUM", "LOW"];
  const categoryArray = ["WORK", "HOME", "LEARNING"];
  const date = isValid(new Date(dueDate));
  if (statusArray.includes(status) === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (priorityArray.includes(priority) === false) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (categoryArray.includes(category) === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (date === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    next();
  }
};

// API_1

app.get("/todos/", async (request, response) => {
  const { search_q = "", status, category, priority } = request.query;
  if (status !== undefined) {
    const getQueryApi1 = `
        SELECT 
            *
        FROM 
            todo
        WHERE
           status = '${status}';
  `;
    const queryApi1 = await database.all(getQueryApi1);
    response.send(
      queryApi1.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
    );
  } else if (category !== undefined) {
    const getQueryApi1 = `
        SELECT 
            *
        FROM 
            todo
        WHERE
           category = '${category}';
  `;
    const queryApi1 = await database.all(getQueryApi1);
    response.send(
      queryApi1.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
    );
  } else if (priority !== undefined) {
    const getQueryApi1 = `
        SELECT 
            *
        FROM 
            todo
        WHERE
           priority = '${priority}';
  `;
    const queryApi1 = await database.all(getQueryApi1);
    response.send(
      queryApi1.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
    );
  } else if (status !== undefined && priority !== undefined) {
    const getQueryApi1 = `
        SELECT 
            *
        FROM 
            todo
        WHERE
           priority = '${priority}'
           AND
           status = '${status}';
  `;
    const queryApi1 = await database.all(getQueryApi1);
    response.send(
      queryApi1.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
    );
  } else if (search_q !== undefined) {
    const getQueryApi1 = `
        SELECT 
            *
        FROM 
            todo
        WHERE
           todo LIKE '%${search_q}%';
  `;
    const queryApi1 = await database.all(getQueryApi1);
    response.send(
      queryApi1.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
    );
  } else if (category !== undefined && status !== undefined) {
    const getQueryApi1 = `
        SELECT 
            *
        FROM 
            todo
        WHERE
           status = '${status}'
           AND
           category = '${category}';
  `;
    const queryApi1 = await database.all(getQueryApi1);
    response.send(
      queryApi1.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
    );
  } else if (category !== undefined && priority !== undefined) {
    const getQueryApi1 = `
        SELECT 
            *
        FROM 
            todo
        WHERE
           category = '${category}'
           AND 
           priority = '${priority}';
  `;
    const queryApi1 = await database.all(getQueryApi1);
    response.send(
      queryApi1.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
    );
  }
});

//API - 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const queryApi2 = `
        SELECT 
            *
        FROM
            todo
        WHERE 
            id = ${todoId};
     `;
  const queryB = await database.get(queryApi2);
  response.send(convertDBObjectTOResponseObject(queryB));
});

// API -3

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const dates = format(new Date(date), "yyyy-MM-dd");
  const queryApi3 = `
        SELECT 
            *
        FROM
            todo
        WHERE
            due_date = '${dates}';
    `;
  const query3 = await database.all(queryApi3);
  response.send(
    query3.map((eachOne) => convertDBObjectTOResponseObject(eachOne))
  );
});

// API -4

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const dates = format(new Date(dueDate), "yyyy-MM-dd");
  const queryApi4 = `
        INSERT INTO 
            todo (id, todo, priority, status, category, due_date)
        VALUES
            (${id}, 
            '${todo}',
            '${priority}',
            '${status}',
            '${category}',
            '${dates}');
    `;
  await database.run(queryApi4);
  response.send("Todo Successfully Added");
});

//API_5

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo, category, priority, status, dueDate } = request.body;

  if (todo !== undefined) {
    const queryApi5 = `UPDATE todo 
            SET todo = '${todo}' WHERE id = '${todoId}';
        `;
    await database.run(queryApi5);
    respond.send("Todo Updated");
  } else if (category !== undefined) {
    const queryApi5 = `UPDATE todo 
            SET category = '${category}' WHERE id = '${todoId}';
        `;
    await database.run(queryApi5);
    respond.send("Category Updated");
  } else if (priority !== undefined) {
    const queryApi5 = `UPDATE todo 
            SET priority = '${priority}' WHERE id = '${todoId}';
        `;
    await database.run(queryApi5);
    respond.send("Priority Updated");
  } else if (status !== undefined) {
    const queryApi5 = `UPDATE todo 
            SET status = '${status}' WHERE id = '${todoId}';
        `;
    await database.run(queryApi5);
    respond.send("Status Updated");
  } else if (dueDate !== undefined) {
    const dates = format(new Date(dueDate), "yyyy-MM-dd");
    const queryApi5 = `UPDATE todo 
            SET todo = ${dates} WHERE id = '${todoId}';
        `;
    await database.run(queryApi5);
    respond.send("Due Date Updated");
  }
});

// API-6

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const queryApi5 = `
        DELETE FROM todo WHERE id = '${todoId}';
    `;
  await database.run(queryApi5);
  response.send("Todo Deleted");
});

module.exports = app;
