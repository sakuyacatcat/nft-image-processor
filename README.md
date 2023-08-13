# nft-image-processor

Processes uploaded images to make them suitable for NFT conversion.

## Architecture

```mermaid
graph TD

  subgraph frontend
    A[front page]
  end

  subgraph backend
    B[process image]
  end

  subgraph contract
    C[issue nft]
  end

  A -->|"api"| B
  A -->|"web3.js"| C
```
