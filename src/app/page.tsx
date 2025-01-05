import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
   <div className="flex flex-col items-center justify-center">
    <header className="text-center">
      <h1 className="text-4xl font-bold">Spider Craft</h1>
      
    </header>
    </div>
    <div className="flex flex-col items-center justify-center mt-5">
    <Link href="/round-1">
        <Button className="bg-primary text-white rounded-md p-4 hover:bg-secondary">Round 1 </Button>
      </Link>
    </div>
    
    </>


  );
}