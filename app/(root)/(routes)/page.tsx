"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";


// We use this page to trigger the store modal.
const SetupPage = () => {

  const isOpen = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);


  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen])

  return null;
}

export default SetupPage;