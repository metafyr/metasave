import { easUserOperation } from './blHelpers';
import { abi } from '../abi';

async function executeSaveFallData(CFAddress, imgIPFSid, dataIPFSid) {
    try {
        functionName = "saveFallData";
        args = [CFAddress, imgIPFSid, dataIPFSid];
        
        const txHash = await easUserOperation(abi.MetaSave, functionName, args);
        console.log(`Data saved successfully. Transaction hash: ${txHash}`);
    } catch (error) {
        console.error(`Failed to save data: ${error}`);
    }
}

