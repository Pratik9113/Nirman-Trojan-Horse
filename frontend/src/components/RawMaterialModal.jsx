"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function RawMaterialModal({ isOpen, onClose, material, onUpdate }) {
  const [editedMaterial, setEditedMaterial] = useState(material);

  const handleUpdate = () => {
    onUpdate(editedMaterial);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-gray-800 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#f9960e]">
            Raw Material Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Material Name</Label>
            <Input
              id="name"
              value={editedMaterial.name}
              onChange={(e) =>
                setEditedMaterial((prev) => ({ ...prev, name: e.target.value }))
              }
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedMaterial.description}
              onChange={(e) =>
                setEditedMaterial((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="border-gray-300 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={editedMaterial.price}
              onChange={(e) =>
                setEditedMaterial((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Available Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={editedMaterial.quantity}
              onChange={(e) =>
                setEditedMaterial((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              className="border-gray-300"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="bg-[#f9960e] text-white hover:bg-[#da850d]"
          >
            Update Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
