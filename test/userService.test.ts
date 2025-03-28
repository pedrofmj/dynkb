import { expect } from "chai";
import sinon from "sinon";
import { loadDatabase, saveDatabase } from "../src/models/databaseModel";
import { getUsers, addUser, updateUser, deleteUser } from "../src/services/userService";

describe("UserService", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should get all users", () => {
    const mockUsers = [
      { id: 1, name: "User1", email: "user1@example.com", role: "Viewer", createdAt: "2025-03-28T19:23:42.000Z" },
      { id: 2, name: "User2", email: "user2@example.com", role: "Admin", createdAt: "2025-03-28T19:23:42.000Z" }
    ];

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      users: mockUsers
    });

    const users = getUsers();
    expect(users).to.deep.equal(mockUsers);
  });

  it("should add a new user", () => {
    const mockUser = {
      id: 1,
      name: "New User",
      email: "newuser@example.com",
      role: "Viewer",
      createdAt: "2025-03-28T19:23:42.000Z"
    };

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      users: []
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    const newUser = addUser("New User", "newuser@example.com");
    expect(newUser).to.deep.include({
      name: "New User",
      email: "newuser@example.com",
      role: "Viewer"
    });
    expect(saveStub.calledOnce).to.be.true;
  });

  it("should throw an error when adding a user with an invalid email", () => {
    sandbox.stub(loadDatabase, "loadDatabase").returns({
      users: []
    });

    expect(() => addUser("Invalid User", "invalidemail")).to.throw("Invalid email format");
  });

  it("should update a user", () => {
    const mockUser = {
      id: 1,
      name: "Old User",
      email: "olduser@example.com",
      role: "Viewer",
      createdAt: "2025-03-28T19:23:42.000Z"
    };

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      users: [mockUser]
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    const updatedUser = updateUser(1, { name: "Updated User" });
    expect(updatedUser.name).to.equal("Updated User");
    expect(saveStub.calledOnce).to.be.true;
  });

  it("should delete a user", () => {
    const mockUser = {
      id: 1,
      name: "User to Delete",
      email: "delete@example.com",
      role: "Viewer",
      createdAt: "2025-03-28T19:23:42.000Z"
    };

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      users: [mockUser]
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    deleteUser(1);
    expect(saveStub.calledOnce).to.be.true;
  });
});
