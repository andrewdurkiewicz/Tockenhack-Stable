pragma solidity ^0.4.11;

contract Scholarship {
    // Contract that allows a third party validator (like a school) to check
    // grades of student and release escrow funds from a sponsor in rounds.
    // Inspired by seed investing. We call it "Seed Scholarships."
    struct SeedFund {
        address sponsor;    // The individual who seeds money. initializes to 0x0.
        address student;    // The individual seeking funds.
        uint startTerm;     // The start date of the seed rounds, ends the ability to contribute.
        bool completed;     // The funding is complete.
        
        uint fundsRequest;  // The amount the student needs.
        uint balance;       // The amount in the contract that will be returned to sponsor if unclaimed.
        uint initial;       // Initial round of funding (at beginning of term.)
        uint roundOne;      // Round one of funding after first grade report.
        uint roundTwo;      // Round two of funding after second grade report.
        uint roundThree;    // Round three of funding after third grade report.
        uint timelock;      // Time that must elapse between rounds. [NOT MVP]
        // [NOT MVP] mapping(uint => Round) rounds;
    }
    
    struct GradeReport {
        bool reportOne;     
        uint gradeOne;
        
        bool reportTwo;
        uint gradeTwo;
        
        bool reportThree;
        uint gradeThree;
    }
    
    // [NOT MVP] struct Round {
    //     bool complete; // true if round already happened.
    //     uint funds; // Amount held for round.
    // }
    
    address school;  // The third party (school.) Could !(will)! be an oracle in the future.
    uint[] grades = [0, 1, 2, 3, 4]; // 0 = F ... 4 = A (Think GPA) 
    
    mapping(address => mapping(address => bool)) validatesFor; // Maps school 
        // to student and returns true if that school validates for that student.
        
    // mapping(address => bool) seeded; // Returns true if student already seeded.
    // mapping(address => SeedFund[]) scholarship;
    
    mapping(address => SeedFund) seedFunds; // ONE PER STUDENT ATM.
    mapping(address => GradeReport) gradeReports;
    address[] students;
    
    function Scholarship(
        address _school) {
        school = _school;
    }
    
    function officiateStudent(address _student, uint _request) {
        if (msg.sender != school) throw; // Only school official can validate student.
        validatesFor[school][_student] = true;
        students.push(_student);
        
        SeedFund sf = seedFunds[_student];
        sf.fundsRequest = _request; // Eventually the student will be able to do this themselves.
    }
    
    function getStatus(address _student) constant returns (bool, address, uint) {
        if (!validatesFor[school][_student]) throw;
        bool seeded;
        
        SeedFund sf = seedFunds[_student];
        if(sf.balance != 0) seeded = true;
        address sponsor = sf.sponsor;
        uint funds = sf.fundsRequest;
        
        return(seeded, sponsor, funds);
    }
    
    function seed(address _student, 
                  uint _initial, 
                  uint _roundOne, 
                  uint _roundTwo,
                  uint _roundThree) payable {
        SeedFund sf = seedFunds[_student];
        
        if (sf.sponsor != 0x0) throw; // Throw if student is sponsored.
        if (now > sf.startTerm) throw; // Throw if student already started term.
        if (!validatesFor[school][_student]) throw; // Throw if student not validated.
        
        uint totalScholarshipFund = msg.value;
        if (_initial + _roundOne + _roundTwo + _roundThree != totalScholarshipFund)
            throw; // Math's wrong!
        
        sf.initial = _initial;
        sf.roundOne = _roundOne;
        sf.roundTwo = _roundTwo;
        sf.roundThree = _roundThree;
        sf.balance = totalScholarshipFund;
    }
    
    function reportGrade(address _student, uint _round, uint _grade) returns (bool) {
    // INCLUDE TIMELOCK BETWEEN ROUNDS TO PROTECT THE SPONSOR.. AKA IF THEY
    // NOTICE SOMETHING FISHY... THEY CAN LOCK FUNDS. [NOT MVP]
    if (msg.sender != school) throw; // In the future, this will call an oracle to
    // report grades but for now the school must manually report.
    if (!validatesFor[school][_student]) throw;
    
    uint grade = 88;
    for (var i = 0; i < grades.length; i++) {
        if (_grade == grades[i]) grade = _grade;
    } 
    require(grade != 88); // Make sure school entered in valid grade number.
    
    GradeReport gr = gradeReports[_student];
    
    if (_round == 1) require(!gr.reportOne); gr.gradeOne = grade; gr.reportOne = true; return true;
    if (_round == 2) require(!gr.reportTwo); gr.gradeTwo = grade; gr.reportTwo = true; return true;
    if (_round == 3) require(!gr.reportThree); gr.gradeThree = grade; gr. reportThree = true; return true;
    return false;
    }
    
    // All the logic contained within this one function so the student only has
    // to call `studentWithdrawal()` and if there's any money unlocked, they will
    // get sent it.
    function studentWithdrawal() {
        SeedFund memory sf;
        GradeReport memory gr;
        
        for (var i = 0; i < students.length; i++) {
            if (msg.sender == students[i]) {
                sf = seedFunds[students[i]];
                gr = gradeReports[students[i]];
            }
        }
        
        require(sf.balance != 0); // require that it's nonzero
        require(!sf.completed);
        
        uint amt;
        if (sf.initial != 0 && now > sf.startTerm) {
            amt = sf.initial;
            if (!msg.sender.send(amt)) throw;
            sf.balance -= amt;
            sf.initial = 0;
        } else if (sf.roundOne != 0) {
            require(gr.reportOne);
            amt = sf.roundOne * gr.gradeOne;
            if (!msg.sender.send(amt)) throw;
            sf.balance -= amt;
            sf.roundOne = 0;
        } else if (sf.roundTwo != 0) {
            require(gr.reportOne);
            amt = sf.roundTwo;
            if (!msg.sender.send(amt)) throw;
            sf.balance -= amt;
            sf.roundTwo = 0;
        } else if (sf.roundThree != 0) {
            require(gr.reportOne);
            amt = sf.roundThree;
            if (!msg.sender.send(amt)) throw;
            sf.balance -= amt;
            sf.roundThree = 0;
            sf.completed = true;
        } else throw; 
    }
    
    
    function listStudents() constant returns (address[]) {
        return students;
    }
}

// The contract above is deployed per school.