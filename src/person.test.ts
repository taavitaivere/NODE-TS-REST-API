import {server} from "./app";
const request = require('supertest');
import { Persons } from './interfaces/persons';

jest.mock("./interfaces/persons", () => {
  return {
    Persons: {
      create: jest.fn().mockResolvedValue({ name: "Test Person", email: "test@example.com", avatar: "test_avatar.jpg" }),
      findByPk: jest.fn().mockResolvedValue({ name: "Test Person", email: "test@example.com", avatar: "test_avatar.jpg" }),
      findAll: jest.fn().mockResolvedValue([{ name: "Test Person", email: "test@example.com", avatar: "test_avatar.jpg" }]),
      update: jest.fn().mockResolvedValue({ name: "Updated Test Person", email: "updated_test@example.com", avatar: "updated_test_avatar.jpg" }),
      destroy: jest.fn().mockResolvedValue({ name: "Test Person", email: "test@example.com", avatar: "test_avatar.jpg" })
    }
  };
});

let token: string;
let id: number;

describe("Authorization", () => {
  it("should return a token", async () => {
    setTimeout(async () => {
      const res = await request(server).get("/token");
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBeDefined();
      token = res.text;
    }, 1000);
  });

  it("createPerson should be created successfully", async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));  // Adding a delay of 1000ms

    const response = await request(server)
        .post("/persons")
        .send({ name: "Test Person", email: "test@example.com", avatar: "test_avatar.jpg", token: token })
        .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toEqual(200);

    const { body } = response;
    id = body.id;

    expect(body.data).toEqual({
      name: "Test Person",
      email: "test@example.com",
      avatar: "test_avatar.jpg"
    });
    expect(body).toEqual({
      data: {
        name: "Test Person",
        email: "test@example.com",
        avatar: "test_avatar.jpg"
      },
      message: "Persons created successfully"
    });
  });

  it("createPerson should return 401 if token is not provided", async () => {
    const response = await request(server)
        .post("/persons")
        .send({ name: "Test Person", email: "test@example.com", avatar: "test_avatar.jpg", token: token })
        .set({ Authorization: `Bearer ${null}` });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({"message": "invalid token"});
  });

  it('should retrieve all persons', async () => {
    const res = await request(server).get('/persons');

    expect(res.body).toEqual([{
      name: "Test Person",
      email: "test@example.com",
      avatar: "test_avatar.jpg"
    }]);
  });

  it('should successfully edit a person', async () => {
    const updatedData = {
      name: 'Updated Test Person',
      email: 'test@example.com',
      avatar: 'test_avatar.jpg'
    };

    const response = await request(server)
        .put(`/persons/1`)
        .send(updatedData)
        .set('Content-Type', 'application/json')
        .set({ Authorization: `Bearer ${token}` });

    setTimeout(() => {
      const { body } = response;

      expect(response.status).toEqual(200);
      expect(body).toEqual({
        message: "Person updated successfully",
        name: updatedData.name,
        email: updatedData.email,
        avatar: updatedData.avatar
      });
    }, 5000);
  });

  it("getPersonById should return a person", async () => {
    id = 1;
    const response = await request(server)
        .get(`/persons/1`)
        .send({ name: "Test Person", email: "test@example.com", avatar: "test_avatar.jpg", token: token })
        .set({ Authorization: `Bearer ${token}` });

    const { body } = response;
    expect(body).toEqual({
      name: "Test Person",
      email: "test@example.com",
      avatar: "test_avatar.jpg"
    });
  });
  it("should not creata a person due missing fields", async () => {
    const response = await request(server)
        .post("/persons")
        .send({email: "test@example.com", avatar: "test_avatar.jpg", token: token})
        .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toEqual(400);
  });
  it("should return a bad request error", async () => {
    const updatedData = {
      name: 'Updated Test Person',
      email: 'test@example.com',
      avatar: 'test_avatar.jpg'
    };

    const response = await request(server)
        .put(`/persons/`)
        .set('Content-Type', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send(updatedData);
    expect(response.status).toEqual(404);
  });
  it('should successfully delete a person', async () => {
    const response = await request(server)
        .delete(`/persons/1`)
        .set({ Authorization: `Bearer ${token}` });

    setTimeout(async () => {
      const deletedPerson = await Persons.findByPk(1);
      expect(response.status).toEqual(200);
      expect(deletedPerson).toBeNull();
    }, 1000);
  });
  it("should return an unauthorized message", async () => {
    const response = await request(server).delete("/persons/1");
    const { body } = response;

    expect(response.statusCode).toEqual(401);
    expect(body).toEqual({ message: 'include token' });
  });
  it ("should prohibit from deleting a person", async () => {
    const response = await request(server)
        .delete(`/persons/1222fdss2`)
        .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toEqual(403);
  });
  it("Should return 404 if person with specified ID does not exist", async () => {
    const res = await request(server)
        .delete("/person/5")
        .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toEqual(404)
  });
});
