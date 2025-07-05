"use client";

import { useFrame } from "@/components/farcaster-provider";
import { Button } from "@/components/ui/button";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { useConnect, useDisconnect } from "wagmi";
import { FiXSquare } from "react-icons/fi";

export function Navbar() {
    const { context } = useFrame();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-sm shadow-md z-50">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="text-lg font-bold">
                    {/* Placeholder for logo */}
                    <span className="text-gray-800">ShareToMint</span>
                </div>
                <div>
                    {context?.user ? (
                        <div className="flex items-center space-x-2">
                            <FiXSquare
                                className="ml-2 cursor-pointer hover:text-red-500"
                                size={20}
                                title="Disconnect"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    disconnect();
                                }}
                            />
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
                                <span>{context.user.displayName}</span>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() =>
                                connect({ connector: farcasterFrame() })
                            }
                            className="bg-black text-white font-sans"
                        >
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
