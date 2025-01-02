const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MentorshipSystem", function () {
  let MentorshipSystem;
  let mentorshipSystem;
  let owner;
  let mentor;
  let student;
  let addr3;
  const hourlyRate = ethers.parseEther("0.1"); // 0.1 ETH

  beforeEach(async function () {
    [owner, mentor, student, addr3] = await ethers.getSigners();
    MentorshipSystem = await ethers.getContractFactory("MentorshipSystem");
    mentorshipSystem = await MentorshipSystem.deploy();
    await mentorshipSystem.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right platform wallet", async function () {
      expect(await mentorshipSystem.platformWallet()).to.equal(owner.address);
    });

    it("Should set the initial platform fee to 5%", async function () {
      expect(await mentorshipSystem.platformFee()).to.equal(5);
    });
  });

  describe("Mentor Registration", function () {
    it("Should register a new mentor when called by platform", async function () {
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

    it("Should not allow duplicate mentor registration", async function () {
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
      await expect(
        mentorshipSystem.connect(owner).registerMentor(
          mentor.address,
          "John Doe",
          "Blockchain",
          hourlyRate
        )
      ).to.be.revertedWith("Mentor already registered");
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
      await mentorshipSystem.connect(student).registerStudent("Jane Doe");
    });

    it("Should start a session", async function () {
      await mentorshipSystem.connect(student).startSession(mentor.address, {
        value: hourlyRate
      });

      const studentData = await mentorshipSystem.students(student.address);
      expect(studentData.currentMentor).to.equal(mentor.address);

      const mentorData = await mentorshipSystem.mentors(mentor.address);
      expect(mentorData.isAvailable).to.equal(false);
    });

    it("Should end a session and process payment", async function () {
      const initialPlatformBalance = await ethers.provider.getBalance(owner.address);
      const initialMentorBalance = await ethers.provider.getBalance(mentor.address);

      await mentorshipSystem.connect(student).startSession(mentor.address, {
        value: hourlyRate
      });

      await mentorshipSystem.connect(mentor).endSession(student.address);

      const finalPlatformBalance = await ethers.provider.getBalance(owner.address);
      const finalMentorBalance = await ethers.provider.getBalance(mentor.address);

      // Platform should receive 5%
      const platformFee = hourlyRate * BigInt(5) / BigInt(100);
      expect(finalPlatformBalance - initialPlatformBalance).to.equal(platformFee);

      // Mentor should receive 95%
      const mentorPayment = hourlyRate - platformFee;
      expect(finalMentorBalance > initialMentorBalance).to.be.true;
    });
  });

  describe("Mentor Management", function () {
    beforeEach(async function () {
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
    });

    it("Should allow platform to update mentor info", async function () {
      const newRate = ethers.parseEther("0.2");
      await mentorshipSystem.connect(owner).updateMentorInfo(
        mentor.address,
        "John Updated",
        "Updated Expertise",
        newRate,
        false
      );
      
      const mentorData = await mentorshipSystem.mentors(mentor.address);
      expect(mentorData.name).to.equal("John Updated");
      expect(mentorData.expertise).to.equal("Updated Expertise");
      expect(mentorData.hourlyRate).to.equal(newRate);
      expect(mentorData.isAvailable).to.equal(false);
    });

    it("Should not allow non-platform users to update mentor info", async function () {
      await expect(
        mentorshipSystem.connect(addr3).updateMentorInfo(
          mentor.address,
          "John Updated",
          "Updated Expertise",
          hourlyRate,
          false
        )
      ).to.be.revertedWith("Only platform can call this function");
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

    it("Should not allow non-platform users to update fee", async function () {
      await expect(
        mentorshipSystem.connect(addr3).updatePlatformFee(10)
      ).to.be.revertedWith("Only platform can call this function");
    });
  });

  describe("Rating System", function () {
    beforeEach(async function () {
      await mentorshipSystem.connect(owner).registerMentor(
        mentor.address,
        "John Doe",
        "Blockchain",
        hourlyRate
      );
      await mentorshipSystem.connect(student).registerStudent("Jane Doe");
    });

    it("Should allow student to rate mentor", async function () {
      await mentorshipSystem.connect(student).rateMentor(mentor.address, 5);
      const [rating, totalRatings] = await mentorshipSystem.getMentorRating(mentor.address);
      expect(rating).to.equal(5);
      expect(totalRatings).to.equal(1);
    });

    it("Should calculate average rating correctly", async function () {
      await mentorshipSystem.connect(student).rateMentor(mentor.address, 5);
      await mentorshipSystem.connect(addr3).registerStudent("Test Student");
      await mentorshipSystem.connect(addr3).rateMentor(mentor.address, 3);
      
      const [rating, totalRatings] = await mentorshipSystem.getMentorRating(mentor.address);
      expect(rating).to.equal(4); // (5 + 3) / 2 = 4
      expect(totalRatings).to.equal(2);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow platform to withdraw", async function () {
      await mentorshipSystem.connect(student).startSession(mentor.address, {
        value: hourlyRate
      });

      await expect(
        mentorshipSystem.connect(owner).withdrawEmergency()
      ).not.to.be.reverted;
    });

    it("Should not allow non-platform users to withdraw", async function () {
      await expect(
        mentorshipSystem.connect(addr3).withdrawEmergency()
      ).to.be.revertedWith("Only platform can call this function");
    });
  });
});
