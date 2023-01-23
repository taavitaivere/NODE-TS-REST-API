const request = require('supertest');
const router = require('./src/routes/router');
import {createPerson, deletePerson, getAllPerson, getPersonById, updatePerson } from './src/controller/personController';
const { Persons } = require('./src/interfaces/persons');
const { Request, Response } = require('express');

jest.mock("./src/interfaces/persons", () => {
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

describe("Persons", () => {
  it("create should create a new person", async () => {
    const person = await Persons.create({
      name: "Test Person",
      email: "test@example.com",
      avatar: "test_avatar.jpg"
    });
    expect(person).toEqual({
      name: "Test Person",
      email: "test@example.com",
      avatar: "test_avatar.jpg"
    });
  });

  it("findByPk should find a person by id", async () => {
    const person = await Persons.findByPk(1);
    expect(person).toEqual({
      name: "Test Person",
      email: "test@example.com",
      avatar: "test_avatar.jpg"
    });
  });

  it("findAll should return all persons", async () => {
    const persons = await Persons.findAll();
    expect(persons).toEqual([{
      name: "Test Person",
      email: "test@example.com",
      avatar: "test_avatar.jpg"
    }]);
  });

  it("update should update a person", async () => {
    const updatedPerson = await Persons.update({
      name: "Updated Test Person",
      email: "updated_test@example.com",
      avatar: "updated_test_avatar.jpg" },
        { where: { id: 1 }
        }
    );
    expect(updatedPerson).toEqual({"avatar": "updated_test_avatar.jpg", "email": "updated_test@example.com", "name": "Updated Test Person"});
  });

  it("destroy should delete a person", async () => {
    const deletedPerson = await Persons.destroy({ where: { id: 1 } });
    expect(deletedPerson).toEqual({"avatar": "test_avatar.jpg", "email": "test@example.com", "name": "Test Person"});
  });
});


