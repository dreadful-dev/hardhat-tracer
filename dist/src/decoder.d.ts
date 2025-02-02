import { ErrorFragment, EventFragment, Fragment, FunctionFragment, Result } from "ethers/lib/utils";
import { Artifacts } from "hardhat/types";
import { TracerCache } from "./cache";
declare type Mapping<FragmentType> = Map<string, Array<{
    contractName: string;
    fragment: FragmentType;
}>>;
export declare class Decoder {
    cache: TracerCache;
    functionFragmentsBySelector: Mapping<FunctionFragment>;
    errorFragmentsBySelector: Mapping<ErrorFragment>;
    eventFragmentsByTopic0: Mapping<EventFragment>;
    ready: Promise<void>;
    constructor(artifacts: Artifacts, cache: TracerCache);
    updateArtifacts(artifacts: Artifacts): Promise<void>;
    _updateArtifacts(artifacts: Artifacts): Promise<void>;
    decode(inputData: string, returnData: string): Promise<{
        fragment: Fragment;
        inputResult: Result;
        returnResult: Result | undefined;
        contractName: string;
    }>;
    decodeFunction(inputData: string, returnData: string): Promise<{
        fragment: Fragment;
        inputResult: Result;
        returnResult: Result | undefined;
        contractName: string;
    }>;
    decodeError(revertData: string): Promise<{
        fragment: Fragment;
        revertResult: Result;
        contractName: string;
    }>;
    decodeEvent(topics: string[], data: string): Promise<{
        fragment: EventFragment;
        result: Result;
        contractName: string;
    }>;
}
export {};
//# sourceMappingURL=decoder.d.ts.map