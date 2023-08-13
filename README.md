# nft-image-processor

Processes uploaded images to make them suitable for NFT conversion.

## Architecture

```mermaid
graph TD

  subgraph frontend
    A[front page]
    B[process image]
    A -->|"api"| B
  end

  subgraph contract
    C[issue nft]
  end

  A -->|"web3.js"| C
```
