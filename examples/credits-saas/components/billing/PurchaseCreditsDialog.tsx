"use client";

// NOTE: This component is kept for future use when Commet SDK adds credit pack support
// import { purchaseCreditsAction } from "@/actions/credits";
import type { CreditPack } from "@/actions/credits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Coins, Loader2, Zap } from "lucide-react";
import { useState } from "react";

interface PurchaseCreditsDialogProps {
  creditPacks: CreditPack[];
}

export function PurchaseCreditsDialog({
  creditPacks,
}: PurchaseCreditsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPackId) return;
    setIsPurchasing(true);
    try {
      // TODO: Implement when Commet SDK adds credit pack purchase support
      // const result = await purchaseCreditsAction(selectedPackId);
      // if (result.success && result.checkoutUrl) {
      //   window.location.href = result.checkoutUrl;
      // }
      console.warn("Credit pack purchase not yet supported by Commet SDK");
    } catch (error) {
      console.error("Purchase failed", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gray-900 hover:bg-black text-white gap-2"
      >
        <Zap className="w-4 h-4" />
        Buy Credits
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl overflow-hidden border-none animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  Purchase Credits
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select a pack to add credits to your account
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              {creditPacks.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSelectedPackId(pack.id)}
                  className={`relative w-full p-4 border rounded-xl cursor-pointer transition-all duration-200 text-left ${
                    selectedPackId === pack.id
                      ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-gray-900">{pack.name}</div>
                      <div className="text-sm text-gray-500">
                        {pack.credits.toLocaleString()} Credits
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${(pack.price / 100).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        ${(pack.pricePerCredit / 100).toFixed(3)} / credit
                      </div>
                    </div>
                  </div>
                  {selectedPackId === pack.id && (
                    <div className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPurchasing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={!selectedPackId || isPurchasing}
                className="bg-gray-900 hover:bg-black text-white"
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
