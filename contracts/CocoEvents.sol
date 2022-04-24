// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

contract COCOEvents is ERC721, ERC721Pausable, Ownable {
    struct Event {
        uint256 tokenId;
        string name;
        string description;
        string coverImage;
        uint256 ticketSupply;
        uint256 ticketPrice;
        address owner;
    }
    struct Ticket {
        uint256 tokenId;
        uint256 ticketPrice;
        bool ticketUsed;
        uint256 ticketNumber;
        address owner;
        Event parentEvent;
    }
    mapping(uint256 => Event) private events;
    mapping(uint256 => mapping(uint256 => Ticket)) private tickets;
    uint256[] private eventKeys;
    mapping(uint256 => uint256[]) private ticketKeys;
    uint256 private tokenId;
    Ticket[] myTickets;

    constructor() ERC721("COCOEvents", "COCO") {}

    event EventCreated(uint256 _eventId);
    event TicketSold(uint256 _ticketId);

    modifier valueShouldNotBeEmpty(string memory _value, string memory _field) {
        require(
            bytes(_value).length > 0,
            string(abi.encodePacked(_field, " should not be empty"))
        );

        _;
    }

    modifier valueShouldBeGreaterThanZero(
        uint256 _value,
        string memory _field
    ) {
        require(
            _value > 0,
            string(abi.encodePacked(_field, " should be greater than zero"))
        );

        _;
    }

    modifier isEventAvailable(uint256 _eventId) {
        require(
            bytes(events[_eventId].name).length > 0,
            "Event is not available"
        );

        _;
    }

    modifier isTicketAvailable(uint256 _eventId, uint256 _ticketNumber) {
        bool ticketSold = false;
        uint256[] memory _ticketKeys = ticketKeys[_eventId];

        if (_ticketKeys.length > 0) {
            for (uint256 i = 0; i < _ticketKeys.length; i++) {
                if (
                    tickets[_eventId][_ticketKeys[i]].ticketNumber ==
                    _ticketNumber
                ) {
                    ticketSold = true;
                }
            }
        }

        require(ticketSold == false, "Ticket already sold");

        _;
    }

    function _msgValue() internal view returns (uint256) {
        return msg.value;
    }

    function getAllEvents() public view returns (Event[] memory) {
        Event[] memory _events = new Event[](eventKeys.length);

        if (eventKeys.length > 0) {
            for (uint256 i = 0; i < eventKeys.length; i++) {
                Event memory _event = events[eventKeys[i]];
                _event.owner = ownerOf(_event.tokenId);
                _events[i] = _event;
            }
        }

        return _events;
    }

    function createEvent(Event memory _event)
        public
        valueShouldNotBeEmpty(_event.name, "Event Name")
        valueShouldNotBeEmpty(_event.description, "Event Description")
        valueShouldBeGreaterThanZero(_event.ticketSupply, "Ticket Supply")
        valueShouldBeGreaterThanZero(_event.ticketPrice, "Ticket Price")
        returns (uint256)
    {
        uint256 _tokenId = ++tokenId;
        address _owner;
        _event.tokenId = _tokenId;
        _event.owner = _owner;

        events[_tokenId] = _event;

        eventKeys.push(_tokenId);

        _mint(_msgSender(), _tokenId);

        emit EventCreated(_tokenId);

        return _tokenId;
    }

    function buyTicket(uint256 _eventId, uint256 _ticketNumber)
        public
        payable
        whenNotPaused
        isEventAvailable(_eventId)
        isTicketAvailable(_eventId, _ticketNumber)
        returns (uint256)
    {
        uint256 ticketPrice = events[_eventId].ticketPrice;

        require(_msgValue() >= ticketPrice, "Not enough money");

        if (_msgValue() > ticketPrice) {
            payable(_msgSender()).transfer(_msgValue() - ticketPrice);
        }

        uint256 _ticketId = _createTicket(_eventId, _ticketNumber);
        ticketKeys[_eventId].push(_ticketId);
        _mint(_msgSender(), _ticketId);

        emit TicketSold(_ticketId);

        return _ticketId;
    }

    function getAllTicketsByEvent(uint256 _eventId)
        public
        view
        isEventAvailable(_eventId)
        returns (Ticket[] memory)
    {
        uint256[] memory _ticketKeys = ticketKeys[_eventId];
        Ticket[] memory _tickets = new Ticket[](_ticketKeys.length);

        if (_ticketKeys.length > 0) {
            for (uint256 i = 0; i < _ticketKeys.length; i++) {
                _tickets[i] = tickets[_eventId][_ticketKeys[i]];
            }
        }

        return _tickets;
    }

    function getMyTickets() public returns (Ticket[] memory _tickets) {
        if (eventKeys.length > 0) {
            for (uint256 i = 0; i < eventKeys.length; i++) {
                if (ticketKeys[eventKeys[i]].length > 0) {
                    uint256[] memory _ticketKeys = ticketKeys[eventKeys[i]];
                    for (uint256 j = 0; j < _ticketKeys.length; j++) {
                        Ticket memory _ticket = tickets[eventKeys[i]][
                            _ticketKeys[j]
                        ];
                        if (ownerOf(_ticket.tokenId) == _msgSender()) {
                            _ticket.parentEvent = events[eventKeys[i]];
                            myTickets.push(_ticket);
                        }
                    }
                }
            }
            if (myTickets.length > 0) {
                _tickets = myTickets;
                delete myTickets;
            }
        }
    }

    function _createTicket(uint256 _eventId, uint256 _ticketNumber)
        internal
        isEventAvailable(_eventId)
        returns (uint256)
    {
        uint256 _tokenId = ++tokenId;
        Event memory _parentEvent;
        address _owner;
        Ticket memory _ticket = Ticket({
            tokenId: _tokenId,
            ticketPrice: events[_eventId].ticketPrice,
            ticketUsed: bool(false),
            ticketNumber: _ticketNumber,
            owner: _owner,
            parentEvent: _parentEvent
        });
        tickets[_eventId][_tokenId] = _ticket;
        return _tokenId;
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal override(ERC721, ERC721Pausable) {
        super._beforeTokenTransfer(_from, _to, _tokenId);
    }
}
