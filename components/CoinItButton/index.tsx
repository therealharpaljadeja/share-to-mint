import { useWriteContract } from "wagmi";

export default function CoinItButton({ writeConfig }: { writeConfig: any }) {
   

    return <button
    type="button"
    // onClick={handleCoinIt}
    // disabled={isMinting}
    className="w-full bg-primary text-text-light font-bold py-3 px-5 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
>
    {/* {isMinting ? 'Coining it...' : 'Coin it'} */}
</button>

}