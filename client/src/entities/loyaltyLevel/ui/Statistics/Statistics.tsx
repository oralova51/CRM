import React from 'react'
import './Statistics.css'
import { useEffect, useState } from 'react'
import LoyaltyApi from '../../api/LoyaltyApi'
import { BookingApiItem } from '../../model'

export default function Statistics() {
    const [statistics, setStatistics] = useState<BookingApiItem[]>([])
    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await LoyaltyApi.getStatistics()
            console.log(response.data)
            setStatistics(response.data)
        }
        fetchStatistics()
    }, [])

  return (
   <>
   <h3>Посещений</h3>
   {statistics.filter((el) => el.status === 'completed').reduce((acc, el) => acc + parseFloat(el.price_paid), 0)}
    </>
    
  )
}
