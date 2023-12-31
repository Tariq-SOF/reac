

import { useState } from "react";
import { useEffect } from "react";
import { Map, Polygon, GoogleApiWrapper } from "google-maps-react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";



function BookInfo({ google }) {
    const position = { lat: 24.85353885090064, lng: 46.71209072625354 };

    const [fillColor,setFillColor] = useState()
    const [parking,setParking] = useState([])
    const [reservations,setReservations] = useState([])

    const navigate = useNavigate();


    //Reservation data
  const [date,setDate]=useState();
  const [startTime,setStartTime]= useState("");
  const [endTime,setEndTime] = useState("");
  const [parkingNum ,setParkingNum]= useState();
  const [totalCost,setTotalCost] = useState();

  const [parkingId,setParkingId]= useState();

  const [reservationExpired, setReservationExpired] = useState(false);



  useEffect(() => {

    axios.get('https://658c45f8859b3491d3f5d2ff.mockapi.io/Parking')
    .then(function (response) {
      setParking(response.data)
      // handle success
      // console.log(response);
    })


    axios.get('https://658c45f8859b3491d3f5d2ff.mockapi.io/Reservation')
    .then(function (response) {
      setReservations(response.data)
      // handle success
      // console.log(response);
    })



    if (startTime !== "" && endTime !== "") {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diff = Math.abs(end - start);
      const hours = Math.ceil(diff / (1000 * 60 * 60)); 
      setTotalCost(hours*8);

    
    const currentDate = new Date();
    const startRes = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), Number(startTime.split(":")[0]), Number(startTime.split(":")[1]));
    const endRes = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), Number(endTime.split(":")[0]), Number(endTime.split(":")[1]));
    const currentTime = new Date();


      console.log("Current Time:", currentTime);
      console.log("End Time:", endRes);

      if (endRes > currentTime) {
        const timeDiff = endRes.getTime() - currentTime.getTime();

        console.log("Time Difference:", timeDiff);

  
        const timeoutId = setTimeout(() => {
          console.log("تم انتهاء مدة الحجز");
          setReservationExpired(true);
        }, timeDiff);

      return () => {
        clearTimeout(timeoutId);
      };

    }
    }

  }, [startTime, endTime]);



  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
  
    if (month < 10) {
      month = `0${month}`;
    }
  
    if (day < 10) {
      day = `0${day}`;
    }
  
    return `${year}-${month}-${day}`;
  }



  // const selectedDate  = date;

 function getMinTimeForToday(date ) {
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];

        if (date === currentDate) {
            let hour = today.getHours().toString().padStart(2, '0');
            let minute = today.getMinutes().toString().padStart(2, '0');
            return `${hour}:${minute}`;
        }
        return '00:00';
    }


  const handleParking = (parkingNum) => {
    setParkingNum(parkingNum);
  };


  const book = ()=>{
    axios.post('https://658c45f8859b3491d3f5d2ff.mockapi.io/Reservation', {
      // userId: ,
      parkingId: parkingNum,
      date: date,
      startTime: startTime,
      endTime: endTime,
      totalCost: totalCost,
      paymentStatus: "incomplete",
      reservationStatus: "active"
    })

    .then(res => {
      localStorage.setItem("ReservationId",res.data.id);
      // localStorage.setItem("parkingNum",parkingNum);

    })
     
  }



 

  return (
    <div className="flex border-8" >


    {/* <!-- component --> */}


  <div class="flex h-fit justify-center max-sm:flex-col">

  <div className="card shrink-0 max-md:w-72 max-sm:w-screen  max-w-sm shadow-2xl bg-base-100 ">
      <form className="card-body">
        <div className="form-control border-none">

            <p className="text-center font-bold">معلومات الحجز </p>
    <div className="">
      <label htmlFor="date" className=" block mb-2">تحديد التاريخ:</label>

      <input value={date} onChange={(e)=>setDate(e.target.value)} type="date" id="date" name="date" className="input input-bordered  p-4 h-[5vh] w-[84%] shadow-sm flex " required
      min={getCurrentDate()}/>




    </div> 
        </div>
    <div className="w-full h-[20vh] flex flex-col gap-2 ">
  <label htmlFor="time" className="block">
    تحديد الوقت:
  </label>
  <input
    value={startTime}
    onChange={(e)=>setStartTime(e.target.value)}
    type="time"
    id="startTime"
    name="startTime"
    className="input input-bordered p-4 h-[5vh] w-[84%] shadow-sm flex"
     required min={getMinTimeForToday(date)}
  />

  
  
   <div className=" w-[50%] flex items-center justify-evenly gap-3">

            <hr className="border-[1px] w-[84%]"></hr>
            <p className="text-[12px] text-[#5d5b5b] ">الى</p>
            <hr className="border-[1px] w-[84%]"></hr>
    </div>

    <input
    value={endTime}
    onChange={(e)=>setEndTime(e.target.value)}
    type="time"
    id="endTime"
    name="endTime"
    className="input input-bordered p-4 h-[5vh] w-[84%] shadow-sm flex" required
    min={startTime || getMinTimeForToday(date)}
  />
</div>

       <div className="form-control">
          <label className="label">
            <span className="label-text">رقم الموقف (حدد موقفك من الخريطة)</span>
          </label>

          <input value={parkingNum} type="text" className="p-2 h-[5vh] shadow-sm input input-bordered w-[84%]" readOnly />


        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text max-sm:text-sm">التكلفة الإجمالية (لكل ساعة 8 ريال سعودي) </span>
          </label>

          <input value={totalCost} type="text" className="p-4 h-[5vh] shadow-sm input input-bordered w-[84%]" readOnly />


          
        </div>
        <div className="form-control border-none ">
          <Link to={"/userdata"}>
          <button onClick={book} className="btn btn-primary">التالي</button>
          </Link>
        </div>
      </form>
    </div>

    
    <div className=" h-full items-center justify-center content-center">
   <div className="w-44 max-sm:hidden" >
        <Map  containerStyle={{ width: '72vw' , height: '85%'}}
          google={google}
          zoom={25}
          initialCenter={position} mapId="30946c4a5f450f07" mapTypeId="satellite">


          {parking.map(item=>{
           
          //  const isParkingAvailable = !reservations.some(
          //   reservation =>
          //     reservation.parkingId === item.parkingNum &&
          //     new Date(reservation.endTime) > new Date(startTime) &&
          //     new Date(reservation.startTime) < new Date(endTime)
          // );
        
          // const activeReservation = reservations.find(
          //   reservation =>
          //     reservation.parkingId === item.parkingNum &&
          //     new Date(reservation.endTime) > new Date(startTime) &&
          //     new Date(reservation.startTime) < new Date(endTime) &&
          //     reservation.reservationStatus === "active"
          // );
        
          // const parkingColor = activeReservation
          //   ? "#FF0000" // اللون الأحمر إذا كان هناك حجز نشط
          //   : isParkingAvailable
          //   ? "#34a653" // اللون الأخضر إذا كان هناك حجز غير نشط
          //   : "#808080"; // اللون الرمادي إذا كان الموقف غير متاح
        
        
          
          return (

          <Polygon
          key={item.id}
          paths={item.coords}
          strokeColor={parkingColor}
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor={parkingColor}
          fillOpacity={0.35}
          tilt={item.parkingNum}
          
          // onClick={() => {
          //   if (item.status === "available") {
          //     localStorage.setItem("parkingId",item.id)
          //     handleParking(item.parkingNum);
          //   }
          // }}

          onClick={() => {
            // if (isParkingAvailable) {
              localStorage.setItem("parkingId", item.id);
              handleParking(item.parkingNum);
            // } else if (!isReservationActive) {
            //   alert("الموقف غير متاح في هذا الوقت.");
            // }
          }}
        />
        );

        })}
        </Map>
        </div>

         
  </div>

    </div>
    </div>
    
  )
}

// export default BookInfo
export default GoogleApiWrapper({
  apiKey: "AIzaSyCOEE04AQC7gzfcMrUrmYoHiULXK7yJaeA",
})(BookInfo);

