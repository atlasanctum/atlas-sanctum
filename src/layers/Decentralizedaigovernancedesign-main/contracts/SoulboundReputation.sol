// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title SoulboundReputation
 * @dev Non-transferable reputation tokens (ERC-5192 compliant)
 */
contract SoulboundReputation is
    Initializable,
    ERC721Upgradeable,
    AccessControlUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REPUTATION_UPDATER_ROLE = keccak256("REPUTATION_UPDATER_ROLE");

    struct Reputation {
        uint256 overall;
        uint256 votingAccuracy;
        uint256 expertiseScore;
        uint256 participationConsistency;
        uint256 ethicalAlignment;
        uint256 contributionValue;
    }

    struct DomainExpertise {
        string domain;
        uint256 score;
        uint256 verifications;
        uint256 lastActivity;
    }

    // Mapping from token ID to reputation
    mapping(uint256 => Reputation) public reputations;
    
    // Mapping from address to token ID
    mapping(address => uint256) public addressToTokenId;
    
    // Mapping from token ID to domain expertise
    mapping(uint256 => mapping(string => DomainExpertise)) public domainExpertise;
    
    // Counter for token IDs
    uint256 private _tokenIdCounter;
    
    // Mapping to track if token is locked (always true for soulbound)
    mapping(uint256 => bool) private _locked;

    // Events
    event ReputationUpdated(uint256 indexed tokenId, Reputation reputation);
    event DomainExpertiseUpdated(uint256 indexed tokenId, string domain, uint256 score);
    event Locked(uint256 indexed tokenId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init("Soulbound Reputation", "SBR");
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(REPUTATION_UPDATER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a new soulbound token
     */
    function mint(address to) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(addressToTokenId[to] == 0, "Address already has a token");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(to, tokenId);
        addressToTokenId[to] = tokenId;
        _locked[tokenId] = true;
        
        emit Locked(tokenId);
        
        return tokenId;
    }

    /**
     * @dev Update reputation metrics
     */
    function updateReputation(
        uint256 tokenId,
        uint256 overall,
        uint256 votingAccuracy,
        uint256 expertiseScore,
        uint256 participationConsistency,
        uint256 ethicalAlignment,
        uint256 contributionValue
    ) external onlyRole(REPUTATION_UPDATER_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        
        reputations[tokenId] = Reputation({
            overall: overall,
            votingAccuracy: votingAccuracy,
            expertiseScore: expertiseScore,
            participationConsistency: participationConsistency,
            ethicalAlignment: ethicalAlignment,
            contributionValue: contributionValue
        });
        
        emit ReputationUpdated(tokenId, reputations[tokenId]);
    }

    /**
     * @dev Update domain expertise
     */
    function updateDomainExpertise(
        uint256 tokenId,
        string calldata domain,
        uint256 score,
        uint256 verifications
    ) external onlyRole(REPUTATION_UPDATER_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        
        domainExpertise[tokenId][domain] = DomainExpertise({
            domain: domain,
            score: score,
            verifications: verifications,
            lastActivity: block.timestamp
        });
        
        emit DomainExpertiseUpdated(tokenId, domain, score);
    }

    /**
     * @dev Get reputation for a token
     */
    function getReputation(uint256 tokenId) external view returns (Reputation memory) {
        require(_exists(tokenId), "Token does not exist");
        return reputations[tokenId];
    }

    /**
     * @dev Get reputation by address
     */
    function getReputationByAddress(address account) external view returns (Reputation memory) {
        uint256 tokenId = addressToTokenId[account];
        require(tokenId != 0, "Address does not have a token");
        return reputations[tokenId];
    }

    /**
     * @dev Get domain expertise
     */
    function getDomainExpertise(uint256 tokenId, string calldata domain)
        external
        view
        returns (DomainExpertise memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return domainExpertise[tokenId][domain];
    }

    /**
     * @dev Check if token is locked (always true for soulbound)
     */
    function locked(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        return _locked[tokenId];
    }

    /**
     * @dev Override transfer functions to make tokens non-transferable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0) || to == address(0), "Token is soulbound and cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Override approve to prevent approvals
     */
    function approve(address, uint256) public virtual override {
        revert("Token is soulbound and cannot be approved");
    }

    /**
     * @dev Override setApprovalForAll to prevent approvals
     */
    function setApprovalForAll(address, bool) public virtual override {
        revert("Token is soulbound and cannot be approved");
    }

    /**
     * @dev Required override for AccessControl
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
