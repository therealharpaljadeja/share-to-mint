// This is a server component by default
import { Suspense } from "react";
import ShareContent from "../../components/Share/ShareContent";
import Loading from "@/components/screens/coin/Loading";

export default function SharePage() {
  return (
    <Suspense fallback={
     <Loading />
    }>
      <ShareContent />
    </Suspense>
  );
}
