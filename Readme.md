# Introduction

A collaborative project between CUSAT and Homomorphic Software Pvt Ltd with a grant from Ethereum foundation.

## Data Flow Diagram

Below is the Data Flow Diagram (DFD) that outlines the flow of data across the system:

![Data Flow Diagram](DFD.png)

## YOLOv7-W6-Pose Model

### Performance: 
1. Resolution: 1280
2. Average Precision (AP): 54.9%
3. Recall: 25.1%
4. Train/Box Loss: 1.8%
5. Train/Class Loss: 0.0%
6. Train/Object Loss: 0.6%
7. Val/Box Loss: 2.8%
8. Val/Class Loss: 0.0%
9. Val/Object Loss: 1.5%
10. Learning rate: 0.00447
11. AP50 (50% IoU): 72.6%
12. AP75 (75% IoU): 60.1%
13. Average fps: ~10
14. Latency: ~100 ms

## Installation

This project uses a monorepo structure that includes both front-end and back-end components. To get started, run the following commands:

```bash
# Install dependencies for both front-end and back-end
npm install

# Run the front-end development server
npm run dev-fe

# Run the back-end development server
npm run dev-be
