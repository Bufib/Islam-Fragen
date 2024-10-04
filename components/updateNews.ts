import fetchNews from "./fetchNews";
import { useState } from "react";
import { useRef } from "react";
import { useCallback } from "react";

const [refreshing, setRefreshing] = useState(false);
const {refetch, applyUpdates } =
  fetchNews();
const scrollRef = useRef<any>();
const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
const CONTENT_OFFSET_THRESHOLD_NEW_UPDATE = 5;


const updateNews = useCallback(() => {
  setRefreshing(true);

  if (contentVerticalOffset > CONTENT_OFFSET_THRESHOLD_NEW_UPDATE) {
    scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
  }
  refetch()
    .then(() => applyUpdates())
    .catch((error: any) => {
      console.log(error);
    })
    .finally(() => {
      setRefreshing(false);
    });
}, [applyUpdates]);
