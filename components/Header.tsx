import { Button } from "@/components/shadcn/Button";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import { LogoSvg } from "./icons/LogoSvg";
import { SettingIcon } from "./icons/Setting";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between">
      <Link href="/">
        <LogoSvg />
      </Link>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
        >
          <SettingIcon className="h-5 w-5" />
        </Button>
        <ConnectWallet />
      </div>
    </header>
  );
}

// <div className='flex items-center gap-2'>
// <Image src='/Logo.svg' alt='Dexon Logo' width={96} height={96} priority />
// </div>

// </div>
