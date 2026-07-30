# EthosDAO - Blockchain & AI Integration Guide

This guide explains how to integrate real blockchain networks and AI services into your decentralized governance platform.

## 🔗 Blockchain Integration

### 1. Get a WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID
4. Update `/src/app/config/wagmi.ts`:
   ```typescript
   const projectId = 'YOUR_ACTUAL_PROJECT_ID_HERE';
   ```

### 2. Deploy Smart Contracts

#### Example DAO Smart Contract (Solidity)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EthosDAO {
    struct Proposal {
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        uint8 ethicsScore;
        bool executed;
        address proposer;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;
    uint256 public quorumPercentage = 10; // 10% quorum
    uint256 public totalMembers;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    
    function createProposal(
        string memory title,
        string memory description,
        uint8 ethicsScore,
        uint256 duration
    ) external returns (uint256) {
        require(ethicsScore <= 100, "Invalid ethics score");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        proposal.title = title;
        proposal.description = description;
        proposal.ethicsScore = ethicsScore;
        proposal.endTime = block.timestamp + duration;
        proposal.proposer = msg.sender;
        
        emit ProposalCreated(proposalId, msg.sender);
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external {
        require(proposalId < proposalCount, "Invalid proposal");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(block.timestamp < proposals[proposalId].endTime, "Voting ended");
        
        hasVoted[proposalId][msg.sender] = true;
        
        if (support) {
            proposals[proposalId].votesFor++;
        } else {
            proposals[proposalId].votesAgainst++;
        }
        
        emit VoteCast(proposalId, msg.sender, support);
    }
    
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(
            (proposal.votesFor + proposal.votesAgainst) * 100 / totalMembers >= quorumPercentage,
            "Quorum not reached"
        );
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
        
        // Add execution logic here
    }
}
```

#### Deploy Using Hardhat

1. Install Hardhat:
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. Initialize Hardhat:
   ```bash
   npx hardhat init
   ```

3. Configure `hardhat.config.js`:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.20",
     networks: {
       sepolia: {
         url: process.env.SEPOLIA_RPC_URL,
         accounts: [process.env.PRIVATE_KEY]
       },
       polygon: {
         url: process.env.POLYGON_RPC_URL,
         accounts: [process.env.PRIVATE_KEY]
       }
     },
     etherscan: {
       apiKey: process.env.ETHERSCAN_API_KEY
     }
   };
   ```

4. Deploy:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. Update contract address in `/src/app/services/blockchainService.ts`:
   ```typescript
   export const DAO_CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
   ```

### 3. Use Wagmi Hooks in Components

Example implementation:

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { prepareCreateProposal } from '../services/blockchainService';

function CreateProposalButton() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  const handleCreate = async (data: ProposalData) => {
    writeContract(prepareCreateProposal(data));
  };
  
  return (
    <button disabled={isPending || isConfirming}>
      {isPending ? 'Confirming...' : isConfirming ? 'Creating...' : 'Create Proposal'}
    </button>
  );
}
```

## 🤖 AI Integration

### 1. Set Up Backend Service

AI API keys should NEVER be exposed in the frontend. Create a backend service:

#### Option A: Node.js/Express Backend

1. Install dependencies:
   ```bash
   npm install express openai cors dotenv
   ```

2. Create `server.js`:
   ```javascript
   const express = require('express');
   const OpenAI = require('openai');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

   app.use(cors());
   app.use(express.json());

   app.post('/api/analyze-proposal', async (req, res) => {
     try {
       const { title, description, category } = req.body;
       
       const completion = await openai.chat.completions.create({
         model: "gpt-4",
         messages: [{
           role: "system",
           content: "You are an AI ethics expert analyzing DAO proposals."
         }, {
           role: "user",
           content: `Analyze this DAO proposal for ethical alignment:
             
Title: ${title}
Description: ${description}
Category: ${category}

Evaluate against these principles:
1. Human Dignity (respect for individual rights)
2. Fairness & Justice (equitable treatment)
3. Transparency (open decision-making)
4. Privacy Protection (data safeguards)
5. Global Welfare (collective well-being)
6. Responsible AI (ethical technology use)

Return a JSON object with:
{
  "ethicsScore": number (0-100),
  "recommendation": {
    "score": number (0-100),
    "reasoning": string
  },
  "breakdown": {
    "humanDignity": number (0-100),
    "fairness": number (0-100),
    "transparency": number (0-100),
    "privacy": number (0-100),
    "globalWelfare": number (0-100),
    "responsibleAI": number (0-100)
  }
}`
         }],
         response_format: { type: "json_object" },
         temperature: 0.7
       });
       
       const analysis = JSON.parse(completion.choices[0].message.content);
       res.json(analysis);
     } catch (error) {
       console.error('Analysis error:', error);
       res.status(500).json({ error: 'Analysis failed' });
     }
   });

   app.listen(3001, () => {
     console.log('AI Service running on port 3001');
   });
   ```

3. Create `.env`:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

4. Start server:
   ```bash
   node server.js
   ```

#### Option B: Serverless Functions (Vercel, Netlify)

Create `/api/analyze-proposal.ts`:

```typescript
import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { title, description, category } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [/* same as above */],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
}
```

### 2. Update Frontend Service

Update `/src/app/services/aiService.ts`:

```typescript
export async function analyzeProposal(
  title: string,
  description: string,
  category: string
): Promise<AIAnalysisResult> {
  const response = await fetch('http://localhost:3001/api/analyze-proposal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, category })
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}
```

### 3. Alternative AI Services

#### Anthropic Claude

```javascript
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Analyze this proposal..." }]
});
```

#### Google Gemini

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent("Analyze this proposal...");
```

## 🔒 Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use environment variables for all secrets**
3. **Implement rate limiting on backend endpoints**
4. **Validate all inputs before sending to AI/blockchain**
5. **Use HTTPS for all API communications**
6. **Implement proper error handling**
7. **Audit smart contracts before mainnet deployment**
8. **Set up monitoring and alerts**
9. **Use multi-signature wallets for critical operations**
10. **Implement emergency pause functionality**

## 📊 Testing

### Test Networks

- Ethereum: Sepolia, Goerli
- Polygon: Mumbai
- Arbitrum: Goerli
- Optimism: Goerli

### Get Test Tokens

- Ethereum Sepolia: https://sepoliafaucet.com
- Polygon Mumbai: https://faucet.polygon.technology

### Testing Workflow

1. Deploy to testnet
2. Connect with test wallet
3. Create test proposals
4. Vote on proposals
5. Execute proposals
6. Monitor gas usage
7. Test edge cases
8. Audit and fix issues

## 🚀 Production Deployment

1. Audit smart contracts (OpenZeppelin, CertiK)
2. Deploy to mainnet
3. Verify contracts on Etherscan
4. Set up backend service (AWS, GCP, Vercel)
5. Configure production API keys
6. Set up monitoring (Sentry, DataDog)
7. Implement analytics (Mixpanel, Amplitude)
8. Create documentation
9. Launch governance forum
10. Announce to community

## 📚 Resources

- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Docs](https://rainbowkit.com)
- [OpenAI API](https://platform.openai.com/docs)
- [Hardhat](https://hardhat.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Etherscan API](https://docs.etherscan.io)

## 🤝 Support

For questions and support:
- Discord: [Your Discord]
- Twitter: [Your Twitter]
- Forum: [Your Forum]
