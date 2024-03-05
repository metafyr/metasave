# Introduction

A collaborative project between CUSAT and Homomorphic Software Pvt Ltd with a grant from Ethereum foundation.

## Data Flow Diagram

Below is the Data Flow Diagram (DFD) that outlines the flow of data across the system:

![Data Flow Diagram](DFD.png)

## YOLOv7-W6-pose Model

### Performance: 
1. Resolution: 1280
2. Average Precision (AP): 54.9%
3. AP50: 72.6%
4. AP75: 60.1%
5. Average fps: ~10
6. Latency: ~100 ms

## Installation

This project uses a monorepo structure that includes both front-end and back-end components. To get started, run the following commands:

```bash
# Install dependencies for both front-end and back-end
npm install

# Run the front-end development server
npm run dev-fe

# Run the back-end development server
npm run dev-be
