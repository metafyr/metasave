import { AAProvider } from './aa';
import {encodeFunctionData} from 'viem'

async function userOperation(abi, functionName, args) {
  try {
    const callData = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    const userOperation = await AAProvider.sendUserOperation({
      target: abi.address, 
      data: callData,
    });

    const txHash = await AAProvider.waitForUserOperationTransaction(userOperation.hash);
    console.log(`Transaction successful with hash: ${txHash}`);

    return txHash;
  } catch (error) {
    console.error(`Error in userOperation: ${error}`);
    throw error;
  }
}

export { userOperation };
