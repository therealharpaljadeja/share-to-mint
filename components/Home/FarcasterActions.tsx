import { useFrame } from '@/components/farcaster-provider'
import { APP_URL } from '@/lib/constants'
import { useState } from 'react'

export function FarcasterActions() {
  const { actions } = useFrame()
  const [ error, setError ] = useState<string | null>(null)

  function addFrame() {
    try {
      actions?.addFrame()
    } catch(error: any) {
      console.error(error);
      setError(error.message)
    }
  }

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">sdk.actions</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        {actions ? (
          <div className="flex flex-col space-y-4 justify-start">
            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={addFrame}
            >
              addFrame
            </button>
            {error && <p className="text-sm text-left text-red-500">{error}</p>}
            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => actions?.close()}
            >
              close
            </button>
            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() =>
                actions?.composeCast({
                  text: 'Check out this Monad Farcaster MiniApp Template!',
                  embeds: [`${APP_URL}`],
                })
              }
            >
              composeCast
            </button>
            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => actions?.openUrl('https://docs.monad.xyz')}
            >
              openUrl
            </button>
            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() =>
                actions?.signIn({ nonce: '1201', acceptAuthAddress: true })
              }
            >
              signIn
            </button>
            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => actions?.viewProfile({ fid: 17979 })}
            >
              viewProfile
            </button>
          </div>
        ) : (
          <p className="text-sm text-left">Actions not available</p>
        )}
      </div>
    </div>
  )
}
