import { expect } from "chai";
import sinon from "sinon";
import { loadDatabase, saveDatabase } from "../src/models/databaseModel";
import { getTopics, addTopic, updateTopic, deleteTopic, buildTopicTree, findShortestPath } from "../src/services/topicService";

describe("TopicService", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should get all topics", () => {
    const mockTopics = [
      { id: 1, name: "Topic1", content: "Content1", description: "Description1", createdAt: "2025-03-28T19:23:42.000Z", updatedAt: "2025-03-28T19:23:42.000Z", version: 0, parentTopicId: null },
      { id: 2, name: "Topic2", content: "Content2", description: "Description2", createdAt: "2025-03-28T19:23:42.000Z", updatedAt: "2025-03-28T19:23:42.000Z", version: 0, parentTopicId: null }
    ];

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      topics: mockTopics
    });

    const topics = getTopics();
    expect(topics).to.deep.equal(mockTopics);
  });

  it("should add a new topic", () => {
    sandbox.stub(loadDatabase, "loadDatabase").returns({
      topics: []
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    const newTopic = addTopic("New Topic", "New Content");
    expect(newTopic).to.deep.include({
      name: "New Topic",
      content: "New Content",
      version: 0
    });
    expect(saveStub.calledOnce).to.be.true;
  });

  it("should update a topic", () => {
    const mockTopic = {
      id: 1,
      name: "Old Topic",
      content: "Old Content",
      description: "Old Description",
      createdAt: "2025-03-28T19:23:42.000Z",
      updatedAt: "2025-03-28T19:23:42.000Z",
      version: 0,
      parentTopicId: null
    };

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      topics: [mockTopic]
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    const updatedTopic = updateTopic(1, { name: "Updated Topic" });
    expect(updatedTopic.name).to.equal("Updated Topic");
    expect(updatedTopic.version).to.equal(1);
    expect(saveStub.calledOnce).to.be.true;
  });

  it("should delete a topic", () => {
    const mockTopic = {
      id: 1,
      name: "Topic to Delete",
      content: "Content to Delete",
      description: "Description to Delete",
      createdAt: "2025-03-28T19:23:42.000Z",
      updatedAt: "2025-03-28T19:23:42.000Z",
      version: 0,
      parentTopicId: null
    };

    sandbox.stub(loadDatabase, "loadDatabase").returns({
      topics: [mockTopic]
    });

    const saveStub = sandbox.stub(saveDatabase, "saveDatabase").returns();

    deleteTopic(1);
    expect(saveStub.calledOnce).to.be.true;
  });
});
