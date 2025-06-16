import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SendOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [discount, setDiscount] = useState(10);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-xl max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Send Overlay</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Date */}
          <div>
            <p className="text-sm mb-1">Date</p>
            <input type="date" className="w-full border rounded px-3 py-2" />
          </div>

          {/* Discount Rate */}
          <div>
            <p className="text-sm mb-1">Discount Rate: {discount}%</p>
            <input
              type="range"
              min="5"
              max="15"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Discount Validity */}
          <div className="col-span-2">
            <p className="text-sm mb-1">Discount Validity</p>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">From</span>
                <input type="date" className="border rounded px-3 py-2" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">To</span>
                <input type="date" className="border rounded px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Template */}
          <div>
            <p className="text-sm mb-1">Template</p>
            <select className="w-full border rounded px-3 py-2">
              <option>Welcome #12</option>
              <option>Welcome #11</option>
              <option>Promo #1</option>
            </select>
          </div>

          {/* Emails Count */}
          <div>
            <p className="text-sm mb-1">Emails Count</p>
            <input
              type="number"
              min={1}
              defaultValue={500}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Customer Type */}
          <div className="col-span-2">
            <p className="text-sm mb-1">Customer Type</p>
            <select className="w-full border rounded px-3 py-2">
              <option>New</option>
              <option>Loyal</option>
              <option>To All</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex justify-between pt-4">
          <Button variant="ghost" onClick={onClose}>
            Reject
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Smart Send</Button>
            <Button>Confirm Send</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
