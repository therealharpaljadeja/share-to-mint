"use client";

import { useFrame } from "@/components/farcaster-provider";
import { Button } from "@/components/ui/button";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { useConnect } from "wagmi";

export function Navbar() {
  const { context } = useFrame();
  const { connect } = useConnect();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-sm shadow-md z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="text-lg font-bold">
          {/* Placeholder for logo */}
          <span className="text-gray-800">Logo</span>
        </div>
        <div>
          {context?.user ? (
            <Button variant="outline" className="flex items-center space-x-2">
              {context.user.pfpUrl && (
                <img
                  src={context.user.pfpUrl}
                  alt={context.user.displayName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span>{context.user.displayName}</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => connect({ connector: farcasterFrame() })}
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
