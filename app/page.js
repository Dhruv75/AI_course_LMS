import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <>
      <div>hello from dtu</div>
      <Button>Click me</Button>
      <UserButton />
    </>
  );
}
