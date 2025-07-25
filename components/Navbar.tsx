"use client";

import { useFrame } from "@/components/farcaster-provider";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { BiUnlink } from "react-icons/bi";
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'

export function Navbar() {
    const { context } = useFrame();
    const { connect } = useConnect();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-sm shadow-md z-50">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="text-lg font-bold">
                    {/* Placeholder for logo */}
                    <img src="/images/icon.png" alt="ShareToMint" className="w-6 h-6" />
                </div>
                <div>
                    {address && context?.user ? (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2"
                            >
                                {context.user.pfpUrl && (
                                    <img
                                        src={context.user.pfpUrl}
                                        alt={context.user.displayName}
                                        className="w-6 h-6 rounded-full"
                                    />
                                )}
                                <span>{context.user.displayName ? context.user.displayName.length > 10 ? `${context.user.displayName.slice(0, 10)}...` : context.user.displayName : context.user.username}</span>
                            </Button>
                            <Button variant="outline">
                                <BiUnlink
                                    className="cursor-pointer hover:text-gray-800"
                                    size={20}
                                    title="Disconnect"
                                    onClick={(e) => {
                                        disconnect();
                                    }}
                                />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => {
                              connect({ connector: miniAppConnector() })
                            }
                            }
                            className="bg-black text-white font-sans hover:bg-black hover:text-white"
                        >
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
