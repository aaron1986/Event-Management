import { useCallback, useState } from "react";
import FilterBox from "../Components/FilterBox"
import SearchEvents from "../Components/SearchEvents";



export default function FilterEvents() {
   const [monthYear,setMonthYear]=useState({
    selectedMonth:null,
    selectedYear:null
   })
   const getMonthYear = useCallback((selectedMonth,selectedYear)=>{
      setMonthYear({selectedYear,selectedMonth})
   },[])
   
    return(
      <div>
        <div className="title"><h1>Find Events</h1></div>
         <div className="find-events-wrapper">
          <FilterBox getMonthYear={getMonthYear}/>
          <SearchEvents monthYear={monthYear}/>

        </div>
      </div>
    )
  }