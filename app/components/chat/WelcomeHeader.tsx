import { Bot } from "lucide-react";

export const WelcomeHeader = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex items-center gap-3 rounded-lg bg-purple4/20 px-4 py-2">
      <Bot className="h-8 w-8 text-white" />
      <span className="font-semibold text-white text-xl">Zuni Assistant</span>
    </div>
    <div className="text-center text-sm text-white/80">
      <p>I can help you place market, limit, and stop orders.</p>
      <p>Just tell me what you want to trade! </p>
    </div>
  </div>
);
