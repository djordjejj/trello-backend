import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import Task from "../models/Task";
import User from "../models/User";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await User.deleteMany({});
  await Task.deleteMany({});

  // create a test user
  await User.create({ name: "Test User" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe("Task API", () => {
  let userId: string;
  let taskId: string;

  beforeAll(async () => {
    const user = await User.findOne();
    userId = user!._id.toString();
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({
        title: "Test Task",
        description: "Task description",
        status: "todo",
        assignedUserId: userId
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");
    taskId = res.body._id;
  });

  it("should get all tasks", async () => {
    await Task.create({
      title: "Task 1",
      description: "Desc",
      status: "todo",
      assignedUserId: userId
    });

    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should get one task by id", async () => {
    const task = await Task.create({
      title: "Single Task",
      description: "Desc",
      status: "todo",
      assignedUserId: userId
    });

    const res = await request(app).get(`/api/tasks/${task._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Single Task");
  });

  it("should update a task", async () => {
    const task = await Task.create({
      title: "Old Title",
      description: "Desc",
      status: "todo",
      assignedUserId: userId
    });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  it("should delete a task", async () => {
    const task = await Task.create({
      title: "Delete Me",
      description: "Desc",
      status: "todo",
      assignedUserId: userId
    });

    const res = await request(app).delete(`/api/tasks/${task._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted");

    const deleted = await Task.findById(task._id);
    expect(deleted).toBeNull();
  });
});
