"use client";
import { useState, useEffect } from 'react';

function useDebounce({value, delay}:{value:string,delay:number}) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Thiết lập timer để cập nhật debouncedValue sau khoảng 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Xóa timer nếu value thay đổi (người dùng tiếp tục gõ) 
    // hoặc khi component bị gỡ bỏ (unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chạy lại nếu value hoặc delay thay đổi
  return debouncedValue;
}

export default useDebounce;