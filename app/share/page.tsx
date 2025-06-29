// This is a server component by default
import { Suspense } from "react";
import Loading from "@/components/screens/coin/Loading";
import Coin from "@/components/screens/coin";

export default function SharePage() {
  return (
    <Suspense fallback={
     <Loading />
    }>
      <Coin />
    </Suspense>
  );
}
