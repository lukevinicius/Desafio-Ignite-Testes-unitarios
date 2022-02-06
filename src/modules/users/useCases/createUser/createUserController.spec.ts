import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";
import createConnection from '../../../../database'

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("password", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
        values('${id}', 'lucas', 'lucas@example.com', '${password}')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user ", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        description: "User Supertest",
      })

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with name exists", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        description: "User Supertest",
      })

    expect(response.status).toBe(400);
  });
});
