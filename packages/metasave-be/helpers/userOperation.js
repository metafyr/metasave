import AA from './aa.js';
import {encodeFunctionData} from 'viem'

async function userOperation(abi, functionName, args, address, PRIV_KEY) {
  try {
    const callData = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    const AAProvider = await AA(PRIV_KEY)

    const userOperation = await AAProvider.sendUserOperation({
      target: address, 
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
