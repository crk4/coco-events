const CocoEvents = artifacts.require("./CocoEvents.sol");

contract("CocoEvents", (accounts) => {
  it("Should create an event", async () => {
    const cocoEventsInstance = await CocoEvents.deployed();

    const eventResult = await cocoEventsInstance.createEvent(
      {
        name: "Event 1",
        description: "This is description",
        coverImage: "http://test/com/test.jpg",
        ticketSupply: "100",
        ticketPrice: "100",
        tokenId: 0,
        owner: accounts[0],
      },
      { from: accounts[0] }
    );

    assert.equal(eventResult.logs[1].event, "EventCreated");
  });

  it("Should read all events", async () => {
    const cocoEventsInstance = await CocoEvents.deployed();

    const result = await cocoEventsInstance.getAllEvents();

    assert.equal(result.length, 1);
    assert.equal(result[0].name, "Event 1");
  });

  it("Should book ticket", async () => {
    const cocoEventsInstance = await CocoEvents.deployed();
    const events = await cocoEventsInstance.getAllEvents();

    const result = await cocoEventsInstance.buyTicket(events[0].tokenId, 10, {
      from: accounts[0],
      value: 100,
    });

    assert.equal(result.logs[1].event, "TicketSold");
  });

  it("Should read my tickets", async () => {
    const cocoEventsInstance = await CocoEvents.deployed();

    const result = await cocoEventsInstance.getMyTickets.call({
      from: accounts[0],
    });
    assert.equal(result.length, 1);
    assert.equal(result[0].ticketNumber, "10");
  });
});
