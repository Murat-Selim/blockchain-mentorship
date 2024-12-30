// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MentorshipSystem {
    struct Mentor {
        address payable walletAddress;
        string name;
        string expertise;
        uint256 hourlyRate;
        bool isAvailable;
        uint256 rating;
        uint256 totalRatings;
        uint256[] sessionIds;
    }

    struct Student {
        address walletAddress;
        string name;
        bool isRegistered;
        address currentMentor;
        uint256[] sessionIds;
    }

    struct Session {
        uint256 sessionId;
        address mentor;
        address student;
        uint256 startTime;
        uint256 duration;
        uint256 amount;
        bool isActive;
        bool isPaid;
        bool isCompleted;
    }

    mapping(address => Mentor) public mentors;
    mapping(address => Student) public students;
    mapping(uint256 => Session) public sessions;
    mapping(bytes32 => Session) public activeSessionsByHash;
    
    uint256 public platformFee = 5; // %5 platform ücreti
    address payable public platformWallet;
    uint256 public sessionCounter;
    
    event MentorRegistered(address indexed mentorAddress, string name, string expertise);
    event StudentRegistered(address indexed studentAddress, string name);
    event SessionStarted(address indexed mentor, address indexed student, uint256 startTime);
    event SessionEnded(address indexed mentor, address indexed student, uint256 endTime);
    event SessionCompleted(uint256 indexed sessionId);
    event PaymentProcessed(uint256 indexed sessionId, uint256 amount);
    
    constructor() {
        platformWallet = payable(msg.sender);
        sessionCounter = 0;
    }
    
    function registerMentor(string memory _name, string memory _expertise, uint256 _hourlyRate) external {
        require(!mentors[msg.sender].isAvailable, "Mentor already registered");
        
        uint256[] memory emptyArray;
        mentors[msg.sender] = Mentor({
            walletAddress: payable(msg.sender),
            name: _name,
            expertise: _expertise,
            hourlyRate: _hourlyRate,
            isAvailable: true,
            rating: 0,
            totalRatings: 0,
            sessionIds: emptyArray
        });
        
        emit MentorRegistered(msg.sender, _name, _expertise);
    }
    
    function registerStudent(string memory _name) external {
        require(!students[msg.sender].isRegistered, "Student already registered");
        
        uint256[] memory emptyArray;
        students[msg.sender] = Student({
            walletAddress: msg.sender,
            name: _name,
            isRegistered: true,
            currentMentor: address(0),
            sessionIds: emptyArray
        });
        
        emit StudentRegistered(msg.sender, _name);
    }
    
    function startSession(address _mentorAddress) external payable {
        require(students[msg.sender].isRegistered, "Student not registered");
        require(mentors[_mentorAddress].isAvailable, "Mentor not available");
        require(msg.value >= mentors[_mentorAddress].hourlyRate, "Insufficient payment");
        
        uint256 sessionId = sessionCounter++;
        bytes32 sessionHash = keccak256(abi.encodePacked(_mentorAddress, msg.sender, block.timestamp));
        
        Session memory newSession = Session({
            sessionId: sessionId,
            mentor: _mentorAddress,
            student: msg.sender,
            startTime: block.timestamp,
            duration: 1 hours,
            amount: msg.value,
            isActive: true,
            isPaid: true,
            isCompleted: false
        });
        
        sessions[sessionId] = newSession;
        activeSessionsByHash[sessionHash] = newSession;
        
        mentors[_mentorAddress].sessionIds.push(sessionId);
        students[msg.sender].sessionIds.push(sessionId);
        
        students[msg.sender].currentMentor = _mentorAddress;
        mentors[_mentorAddress].isAvailable = false;
        
        emit SessionStarted(_mentorAddress, msg.sender, block.timestamp);
    }
    
    function endSession(address _studentAddress) external {
        require(msg.sender == mentors[msg.sender].walletAddress, "Only mentor can end session");
        
        bytes32 sessionHash = keccak256(abi.encodePacked(msg.sender, _studentAddress, block.timestamp));
        Session storage session = activeSessionsByHash[sessionHash];
        
        require(session.isActive, "Session not active");
        
        session.isActive = false;
        session.isCompleted = true;
        mentors[msg.sender].isAvailable = true;
        students[_studentAddress].currentMentor = address(0);
        
        uint256 payment = session.amount;
        uint256 platformCut = (payment * platformFee) / 100;
        uint256 mentorPayment = payment - platformCut;
        
        platformWallet.transfer(platformCut);
        mentors[msg.sender].walletAddress.transfer(mentorPayment);
        
        emit SessionEnded(msg.sender, _studentAddress, block.timestamp);
        emit SessionCompleted(session.sessionId);
        emit PaymentProcessed(session.sessionId, payment);
    }
    
    function rateMentor(address _mentorAddress, uint256 _rating) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(students[msg.sender].isRegistered, "Only registered students can rate");
        
        Mentor storage mentor = mentors[_mentorAddress];
        mentor.rating = ((mentor.rating * mentor.totalRatings) + _rating) / (mentor.totalRatings + 1);
        mentor.totalRatings++;
    }
    
    function getMentorRating(address _mentorAddress) external view returns (uint256, uint256) {
        return (mentors[_mentorAddress].rating, mentors[_mentorAddress].totalRatings);
    }

    // Eklenen yeni fonksiyonlar
    function getMentorSessions() external view returns (uint256[] memory) {
        return mentors[msg.sender].sessionIds;
    }

    function getStudentSessions() external view returns (uint256[] memory) {
        return students[msg.sender].sessionIds;
    }

    function updateMentorStatus(bool _isAvailable) external {
        require(mentors[msg.sender].walletAddress != address(0), "Not a registered mentor");
        mentors[msg.sender].isAvailable = _isAvailable;
    }

    function updateHourlyRate(uint256 _newRate) external {
        require(mentors[msg.sender].walletAddress != address(0), "Not a registered mentor");
        mentors[msg.sender].hourlyRate = _newRate;
    }

    // Emergency functions
    function withdrawEmergency() external {
        require(msg.sender == platformWallet, "Only platform owner can withdraw");
        platformWallet.transfer(address(this).balance);
    }
} 