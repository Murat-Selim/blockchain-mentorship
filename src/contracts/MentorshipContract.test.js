const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MentorshipSystem", function () {
  let MentorshipSystem;
  let EduToken;
  let mentorshipSystem;
  let eduToken;
  let owner;
  let mentor;
  let student;
  let addr3;
  const hourlyRate = ethers.parseEther("100"); // 100 EDU tokens
  const initialBalance = ethers.parseEther("1000"); // 1000 EDU tokens

  beforeEach(async function () {
    [owner, mentor, student, addr3] = await ethers.getSigners();

    // Deploy EDU Token
    EduToken = await ethers.getContractFactory("EduToken");
    eduToken = await EduToken.deploy();
    await eduToken.waitForDeployment();

    // Deploy MentorshipSystem
    MentorshipSystem = await ethers.getContractFactory("MentorshipSystem");
    mentorshipSystem = await MentorshipSystem.deploy(await eduToken.getAddress());
    await mentorshipSystem.waitForDeployment();

    // Mint EDU tokens to student for testing
    await eduToken.mint(student.address, initialBalance);
  });

  describe("Deployment", function () {
    it("Should set the right platform wallet", async function () {
      expect(await mentorshipSystem.platformWallet()).to.equal(owner.address);
    });

    it("Should set the initial platform fee to 5%", async function () {
      expect(await mentorshipSystem.platformFee()).to.equal(5);
    });

    it("Should set the correct EDU token address", async function () {
      expect(await mentorshipSystem.eduToken()).to.equal(await eduToken.getAddress());
    });
  });

  describe("Mentor Registration", function () {
    it("Should register a new mentor", async function () {
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
      
      const mentorData = await mentorshipSystem.mentors(mentor.address);
      expect(mentorData.name).to.equal("John Doe");
      expect(mentorData.expertise).to.equal("Blockchain");
      expect(mentorData.hourlyRate).to.equal(hourlyRate);
      expect(mentorData.isAvailable).to.equal(true);
    });

    it("Should not allow non-platform users to register mentors", async function () {
      await expect(
        mentorshipSystem.connect(addr3).registerMentor(
          mentor.address,
          "John Doe",
          "Blockchain",
          hourlyRate
        )
      ).to.be.revertedWith("Only platform can call this function");
    });

    it("Should not allow non-platform to register mentor", async function () {
      await expect(
        mentorshipSystem.connect(addr3).registerMentor(
          mentor.address,
          "John Doe",
          "Blockchain",
          hourlyRate
        )
      ).to.be.revertedWith("Only platform can call this function");
    });
  });

  describe("Student Registration", function () {
    it("Should register a new student", async function () {
      await mentorshipSystem.connect(student).registerStudent("Jane Doe");
      const studentData = await mentorshipSystem.students(student.address);
      expect(studentData.name).to.equal("Jane Doe");
      expect(studentData.isRegistered).to.equal(true);
    });

    it("Should not allow duplicate student registration", async function () {
      await mentorshipSystem.connect(student).registerStudent("Jane Doe");
      await expect(
        mentorshipSystem.connect(student).registerStudent("Jane Doe")
      ).to.be.revertedWith("Student already registered");
    });
  });

  describe("Session Management", function () {
    beforeEach(async function () {
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
      await mentorshipSystem.connect(student).registerStudent("Jane Doe");
      await eduToken.connect(student).approve(mentorshipSystem.getAddress(), hourlyRate);
    });

    it("Should start a session with EDU token payment", async function () {
      const initialStudentBalance = await eduToken.balanceOf(student.address);
      const initialContractBalance = await eduToken.balanceOf(mentorshipSystem.getAddress());

      await mentorshipSystem.connect(student).startSession(mentor.address);

      const finalStudentBalance = await eduToken.balanceOf(student.address);
      const finalContractBalance = await eduToken.balanceOf(mentorshipSystem.getAddress());

      expect(initialStudentBalance - finalStudentBalance).to.equal(hourlyRate);
      expect(finalContractBalance - initialContractBalance).to.equal(hourlyRate);

      const studentData = await mentorshipSystem.students(student.address);
      expect(studentData.currentMentor).to.equal(mentor.address);

      const mentorData = await mentorshipSystem.mentors(mentor.address);
      expect(mentorData.isAvailable).to.equal(false);
    });

    it("Should end session and distribute EDU tokens correctly", async function () {
      await mentorshipSystem.connect(student).startSession(mentor.address);

      const initialPlatformBalance = await eduToken.balanceOf(owner.address);
      const initialMentorBalance = await eduToken.balanceOf(mentor.address);

      await mentorshipSystem.connect(mentor).endSession(student.address);

      const finalPlatformBalance = await eduToken.balanceOf(owner.address);
      const finalMentorBalance = await eduToken.balanceOf(mentor.address);

      // Platform should receive 5%
      const platformFee = hourlyRate * BigInt(5) / BigInt(100);
      expect(finalPlatformBalance - initialPlatformBalance).to.equal(platformFee);

      // Mentor should receive 95%
      const mentorPayment = hourlyRate - platformFee;
      expect(finalMentorBalance - initialMentorBalance).to.equal(mentorPayment);
    });

    it("Should fail if student has insufficient EDU token balance", async function () {
      // Burn all tokens from student
      const balance = await eduToken.balanceOf(student.address);
      await eduToken.connect(student).transfer(addr3.address, balance);

      await expect(
        mentorshipSystem.connect(student).startSession(mentor.address)
      ).to.be.revertedWith("Insufficient EDU token balance");
    });

    it("Should fail if student has not approved enough EDU tokens", async function () {
      // Reset approval to 0
      await eduToken.connect(student).approve(mentorshipSystem.getAddress(), 0);

      await expect(
        mentorshipSystem.connect(student).startSession(mentor.address)
      ).to.be.revertedWith("Insufficient EDU token allowance");
    });
  });

  describe("NFT Integration", function () {
    let nftContract;

    beforeEach(async function () {
      // Deploy NFT Contract
      const MentorshipNFT = await ethers.getContractFactory("MentorshipNFT");
      nftContract = await MentorshipNFT.deploy();
      await nftContract.waitForDeployment();

      // Setup NFT Contract
      await nftContract.setMinterRole(mentorshipSystem.getAddress(), true);
      await mentorshipSystem.connect(owner).setNFTContract(nftContract.getAddress());

      // Setup session
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
      await mentorshipSystem.connect(student).registerStudent("Jane Doe");
      await eduToken.connect(student).approve(mentorshipSystem.getAddress(), hourlyRate);
      await mentorshipSystem.connect(student).startSession(mentor.address);
    });

    it("Should mint NFT when session is completed", async function () {
      await mentorshipSystem.connect(mentor).endSession(student.address);
      
      const studentAchievements = await mentorshipSystem.getStudentAchievements(student.address);
      expect(studentAchievements.length).to.equal(1);
      
      const nftOwner = await nftContract.ownerOf(1);
      expect(nftOwner).to.equal(student.address);
    });
  });

  describe("Platform Management", function () {
    it("Should allow platform to update fee", async function () {
      await mentorshipSystem.connect(owner).updatePlatformFee(10);
      expect(await mentorshipSystem.platformFee()).to.equal(10);
    });

    it("Should not allow fee above 20%", async function () {
      await expect(
        mentorshipSystem.connect(owner).updatePlatformFee(21)
      ).to.be.revertedWith("Fee cannot exceed 20%");
    });

    it("Should allow emergency withdrawal", async function () {
      // First create a session and send EDU tokens to contract
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
      await mentorshipSystem.connect(student).registerStudent("Jane Doe");
      await eduToken.connect(student).approve(mentorshipSystem.getAddress(), hourlyRate);
      await mentorshipSystem.connect(student).startSession(mentor.address);

      const initialBalance = await eduToken.balanceOf(owner.address);
      await mentorshipSystem.connect(owner).withdrawEmergency();
      const finalBalance = await eduToken.balanceOf(owner.address);

      expect(finalBalance > initialBalance).to.be.true;
    });
  });
});
