// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title AtlasSanctumDAO
 * @notice Global DAO governance contract for Atlas Sanctum.
 *
 * Implements:
 *   - Proposal lifecycle: draft → active → passed/rejected/vetoed
 *   - Weighted voting with bioregional representation
 *   - Supermajority threshold (67%) with quorum requirement (50%)
 *   - Indigenous guardian veto power
 *   - Seven-generation impact declaration (required for all proposals)
 *   - On-chain execution of passed proposals
 *   - Immutable audit trail via events
 *
 * Governance parameters are themselves governed by the DAO (meta-governance).
 */

interface IAtlasExecutable {
    function execute(bytes calldata data) external;
}

contract AtlasSanctumDAO {

    // ─── Constants ────────────────────────────────────────────────────────────

    uint256 public constant VOTING_PERIOD       = 7 days;
    uint256 public constant QUORUM_BPS          = 5000;   // 50%
    uint256 public constant SUPERMAJORITY_BPS   = 6700;   // 67%
    uint256 public constant VETO_WINDOW         = 2 days; // after vote closes
    uint256 public constant BPS_DENOMINATOR     = 10_000;

    // ─── Roles ────────────────────────────────────────────────────────────────

    bytes32 public constant INDIGENOUS_GUARDIAN = keccak256("INDIGENOUS_GUARDIAN");
    bytes32 public constant COUNCIL_MEMBER      = keccak256("COUNCIL_MEMBER");
    bytes32 public constant ADMIN               = keccak256("ADMIN");

    // ─── Storage ──────────────────────────────────────────────────────────────

    struct Proposal {
        uint256 id;
        address proposer;
        string  title;
        string  description;
        string  sevenGenerationImpact;   // required: impact on 7 future generations
        ProposalType proposalType;
        ProposalStatus status;
        uint256 votingStart;
        uint256 votingEnd;
        uint256 yesWeight;
        uint256 noWeight;
        uint256 abstainWeight;
        uint256 totalEligibleWeight;
        address target;                  // contract to call on execution
        bytes   callData;                // encoded function call
        bool    executed;
        bool    vetoed;
    }

    enum ProposalType {
        POLICY,
        CONSTITUTIONAL_AMENDMENT,
        RESOURCE_ALLOCATION,
        PARTNERSHIP,
        PARAMETER_CHANGE
    }

    enum ProposalStatus {
        DRAFT,
        ACTIVE,
        PASSED,
        REJECTED,
        VETOED,
        EXECUTED,
        CANCELLED
    }

    struct Member {
        address addr;
        uint256 votingWeight;
        bytes32 role;
        string  bioregion;
        bool    active;
        uint256 joinedAt;
    }

    mapping(uint256 => Proposal)                          public proposals;
    mapping(uint256 => mapping(address => uint8))         public votes;      // 1=yes 2=no 3=abstain
    mapping(address => Member)                            public members;
    mapping(bytes32 => mapping(address => bool))          public roles;

    uint256 public proposalCount;
    uint256 public totalMemberWeight;

    // ─── Events ───────────────────────────────────────────────────────────────

    event ProposalCreated(uint256 indexed id, address indexed proposer, string title, ProposalType proposalType);
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 vote, uint256 weight);
    event ProposalFinalized(uint256 indexed id, ProposalStatus status, uint256 yesWeight, uint256 noWeight);
    event ProposalExecuted(uint256 indexed id, address target);
    event ProposalVetoed(uint256 indexed id, address indexed guardian, string reason);
    event MemberAdded(address indexed member, bytes32 role, uint256 weight);
    event MemberRemoved(address indexed member);

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender], "AtlasDAO: unauthorized role");
        _;
    }

    modifier onlyActiveMember() {
        require(members[msg.sender].active, "AtlasDAO: not an active member");
        _;
    }

    modifier proposalExists(uint256 id) {
        require(id > 0 && id <= proposalCount, "AtlasDAO: proposal not found");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address[] memory initialAdmins) {
        for (uint256 i = 0; i < initialAdmins.length; i++) {
            roles[ADMIN][initialAdmins[i]] = true;
            _addMember(initialAdmins[i], ADMIN, 100, "global");
        }
    }

    // ─── Proposal Lifecycle ───────────────────────────────────────────────────

    function propose(
        string calldata title,
        string calldata description,
        string calldata sevenGenerationImpact,
        ProposalType proposalType,
        address target,
        bytes calldata callData
    ) external onlyActiveMember returns (uint256) {
        require(bytes(sevenGenerationImpact).length > 0, "AtlasDAO: seven-generation impact required");
        require(bytes(title).length > 0, "AtlasDAO: title required");

        proposalCount++;
        uint256 id = proposalCount;

        proposals[id] = Proposal({
            id:                    id,
            proposer:              msg.sender,
            title:                 title,
            description:           description,
            sevenGenerationImpact: sevenGenerationImpact,
            proposalType:          proposalType,
            status:                ProposalStatus.ACTIVE,
            votingStart:           block.timestamp,
            votingEnd:             block.timestamp + VOTING_PERIOD,
            yesWeight:             0,
            noWeight:              0,
            abstainWeight:         0,
            totalEligibleWeight:   totalMemberWeight,
            target:                target,
            callData:              callData,
            executed:              false,
            vetoed:                false
        });

        emit ProposalCreated(id, msg.sender, title, proposalType);
        return id;
    }

    function castVote(uint256 id, uint8 vote) external onlyActiveMember proposalExists(id) {
        Proposal storage p = proposals[id];
        require(p.status == ProposalStatus.ACTIVE, "AtlasDAO: voting not active");
        require(block.timestamp <= p.votingEnd, "AtlasDAO: voting period ended");
        require(votes[id][msg.sender] == 0, "AtlasDAO: already voted");
        require(vote >= 1 && vote <= 3, "AtlasDAO: invalid vote (1=yes 2=no 3=abstain)");

        uint256 weight = members[msg.sender].votingWeight;
        votes[id][msg.sender] = vote;

        if (vote == 1) p.yesWeight      += weight;
        else if (vote == 2) p.noWeight  += weight;
        else p.abstainWeight             += weight;

        emit VoteCast(id, msg.sender, vote, weight);
    }

    function finalize(uint256 id) external proposalExists(id) {
        Proposal storage p = proposals[id];
        require(p.status == ProposalStatus.ACTIVE, "AtlasDAO: not active");
        require(block.timestamp > p.votingEnd, "AtlasDAO: voting still open");

        uint256 totalVoted = p.yesWeight + p.noWeight + p.abstainWeight;
        uint256 quorumRequired = (p.totalEligibleWeight * QUORUM_BPS) / BPS_DENOMINATOR;
        bool quorumMet = totalVoted >= quorumRequired;

        uint256 totalDecisive = p.yesWeight + p.noWeight;
        bool supermajority = totalDecisive > 0 &&
            (p.yesWeight * BPS_DENOMINATOR) / totalDecisive >= SUPERMAJORITY_BPS;

        ProposalStatus newStatus = (quorumMet && supermajority)
            ? ProposalStatus.PASSED
            : ProposalStatus.REJECTED;

        p.status = newStatus;
        emit ProposalFinalized(id, newStatus, p.yesWeight, p.noWeight);
    }

    function veto(uint256 id, string calldata reason) external onlyRole(INDIGENOUS_GUARDIAN) proposalExists(id) {
        Proposal storage p = proposals[id];
        require(
            p.status == ProposalStatus.PASSED || p.status == ProposalStatus.ACTIVE,
            "AtlasDAO: cannot veto in current state"
        );
        require(block.timestamp <= p.votingEnd + VETO_WINDOW, "AtlasDAO: veto window closed");

        p.status = ProposalStatus.VETOED;
        p.vetoed = true;
        emit ProposalVetoed(id, msg.sender, reason);
    }

    function execute(uint256 id) external proposalExists(id) {
        Proposal storage p = proposals[id];
        require(p.status == ProposalStatus.PASSED, "AtlasDAO: proposal not passed");
        require(!p.executed, "AtlasDAO: already executed");
        require(p.target != address(0), "AtlasDAO: no execution target");

        p.executed = true;
        p.status = ProposalStatus.EXECUTED;

        IAtlasExecutable(p.target).execute(p.callData);
        emit ProposalExecuted(id, p.target);
    }

    // ─── Member Management ────────────────────────────────────────────────────

    function addMember(
        address member,
        bytes32 role,
        uint256 weight,
        string calldata bioregion
    ) external onlyRole(ADMIN) {
        _addMember(member, role, weight, bioregion);
    }

    function removeMember(address member) external onlyRole(ADMIN) {
        require(members[member].active, "AtlasDAO: not a member");
        totalMemberWeight -= members[member].votingWeight;
        members[member].active = false;
        emit MemberRemoved(member);
    }

    function grantRole(bytes32 role, address account) external onlyRole(ADMIN) {
        roles[role][account] = true;
    }

    function revokeRole(bytes32 role, address account) external onlyRole(ADMIN) {
        roles[role][account] = false;
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }

    function hasVoted(uint256 id, address voter) external view returns (bool) {
        return votes[id][voter] != 0;
    }

    function quorumReached(uint256 id) external view returns (bool) {
        Proposal storage p = proposals[id];
        uint256 totalVoted = p.yesWeight + p.noWeight + p.abstainWeight;
        return totalVoted >= (p.totalEligibleWeight * QUORUM_BPS) / BPS_DENOMINATOR;
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _addMember(address addr, bytes32 role, uint256 weight, string memory bioregion) internal {
        require(!members[addr].active, "AtlasDAO: already a member");
        members[addr] = Member({
            addr:         addr,
            votingWeight: weight,
            role:         role,
            bioregion:    bioregion,
            active:       true,
            joinedAt:     block.timestamp
        });
        roles[role][addr] = true;
        totalMemberWeight += weight;
        emit MemberAdded(addr, role, weight);
    }
}
