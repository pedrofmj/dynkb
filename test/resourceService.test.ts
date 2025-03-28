import { expect } from "chai";
import sinon from "sinon";
import { loadDatabase, saveDatabase } from "../src/models/databaseModel";
import { getResources, addResource, updateResource, deleteResource } from "../src/services/resourceService";

describe("ResourceService", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should get all resources", () => {
    const mockResources = [
      { id: 1, title: "Resource1", url: "http://example.com/1", type: "article", description: "Description1", topicId: null, createdAt: "2025-03-28T19:23:42.000Z", updatedAt: "2025-03-28T19:23:42.000Z" },
      { id: 2, title: "Resource2", url: "http://example.com/2", type: "video", description: "Description2", topicId: null, createdAt: "2025-03-28T19:23:42.000Z", updatedAt: "2025-03-28T19:23:42.000Z" }
    ];

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      resources: mockResources
    });

    const resources = getResources();
    expect(resources).to.deep.equal(mockResources);
  });

  it("should add a new resource", () => {
    sandbox.stub(loadDatabase, "loadDatabase").returns({
      resources: []
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    const newResource = addResource("New Resource", "http://example.com", "article");
    expect(newResource).to.deep.include({
      title: "New Resource",
      url: "http://example.com",
      type: "article"
    });
    expect(saveStub.calledOnce).to.be.true;
  });

  it("should throw an error when adding a resource with an invalid URL", () => {
    sandbox.stub(loadDatabase, "loadDatabase").returns({
      resources: []
    });

    expect(() => addResource("Invalid Resource", "invalid-url", "article")).to.throw("Invalid URL format");
  });

  it("should update a resource", () => {
    const mockResource = {
      id: 1,
      title: "Old Resource",
      url: "http://example.com/old",
      type: "article",
      description: "Old Description",
      topicId: null,
      createdAt: "2025-03-28T19:23:42.000Z",
      updatedAt: "2025-03-28T19:23:42.000Z"
    };

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      resources: [mockResource]
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    const updatedResource = updateResource(1, { title: "Updated Resource" });
    expect(updatedResource.title).to.equal("Updated Resource");
    expect(saveStub.calledOnce).to.be.true;
  });

  it("should delete a resource", () => {
    const mockResource = {
      id: 1,
      title: "Resource to Delete",
      url: "http://example.com/delete",
      type: "article",
      description: "Description to Delete",
      topicId: null,
      createdAt: "2025-03-28T19:23:42.000Z",
      updatedAt: "2025-03-28T19:23:42.000Z"
    };

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      resources: [mockResource]
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    deleteResource(1);
    expect(saveStub.calledOnce).to.be.true;
  });
});
