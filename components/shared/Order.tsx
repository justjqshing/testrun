"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel
  } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { formUrlQuery } from "@/utils/utils"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"

const Order = ({ reset, setReset }: any) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [order, setOrder] = useState(searchParams.get('order') || 'createdAt: -1')
    const pathname = usePathname()

    useEffect(() => {
        if (reset) {
            setOrder('createdAt: -1');
            setReset(false);
        }
    }, [reset, setReset]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const newUrl = formUrlQuery({
              params: searchParams.toString(),
              key: 'order',
              value: order,
            });
      
            if (order !== searchParams.get('order')) {
              router.push(newUrl, { scroll: false });
            }
          }, 100);
        
    }, [order, pathname, searchParams])

  return (
    <div>
      <Select onValueChange={(e) => setOrder(e)} defaultValue={order}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent defaultValue="Descending">
            <SelectGroup>
                <SelectLabel>Time</SelectLabel>
                <SelectItem value="createdAt: -1">Descending</SelectItem>
                <SelectItem value="createdAt: 1">Ascending</SelectItem>
            </SelectGroup>
            <SelectGroup>
                <SelectLabel>Best</SelectLabel>
                <SelectItem value="likes: -1">Most Liked</SelectItem>
                <SelectItem value="likes: 1">Least Liked</SelectItem>
            </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Order
