import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayers from './Prayers';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useEffect, useState } from 'react';
import  axios from 'axios'
import moment from "moment"
import "moment/dist/locale/ar-dz"
moment.locale("ar");



export const MainContent = () => {
    

    // STATS
    const [nextPrayerIndex, setNextPrayeIndex] = useState(0);
    const [timings, setTimings] = useState({
        Fajr: "05:19",
        Dhuhr: "11:58",
        Asr: "2:45",
        Maghrib: "5:04",
        Isha: "6:28"    
    });

    const [remainingTime, setRemainingTime] = useState("")

    const [selectedCity, setSelectedCity] = useState({
        displayName: "المنوفية",
        apiName: "menoufia",
    })

    const [today, setToday] = useState("");

    const availableCities = [
        {
            displayName: "المنوفية",
            apiName: "menoufia",
        },
        {
            displayName: "القاهرة",
            apiName: "cairo",
        }
    ]

    const prayersArray = [
        {key: "Fajr", displayName: "الفجر"}, 
        {key: "Dhuhr", displayName: "الضهر"}, 
        {key: "Asr", displayName: "العصر"}, 
        {key: "Maghrib", displayName: "المغرب"}, 
        {key: "Isha", displayName: "العشاء"}, 
    ];

    const handleCityChange = (event) => {
        const cityObject = availableCities.find((city) => {
            return city.apiName == event.target.value;
        })
        console.log(event.target.value);
        setSelectedCity(cityObject);
    };

    // API 
    const getTimings = async () => {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EGY&city=${selectedCity.apiName}`);
        setTimings(response.data.data.timings)
    }

    useEffect(() => {
        getTimings();
    }, [selectedCity])

    // ##### COUNTER #####
    useEffect(() => {
        let interval = setInterval(() => {
            setupCounterdownTimer();
        }, 1000);

        const t = moment();
        setToday(t.format("MMM Do YYY | h:mm"));
        return () => {
            clearInterval(interval);
        };
    }, [timings])

    // Create Function Set up count down timer
    const setupCounterdownTimer = () => {
        // عاوز احدد الوقت الحالي
        const momentNow = moment();
        // احدد الصلاة القادمة
        let PrayerIndex = 2;

        if(momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) && 
            momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm")) ) 
            {
            PrayerIndex = 1;
        } 
        else if (momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && 
        momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) 
        {
            PrayerIndex = 2;
        }
        else if (momentNow.isAfter(moment(timings["Asr"], "hh:mm")) && 
        momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))) 
        {
            PrayerIndex = 0;
        } 
        else if(momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) && 
        momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) 
        {
            PrayerIndex = 4;
        } 
        else
        {
            PrayerIndex = 0;
        }
        setNextPrayeIndex(PrayerIndex)

        // الوقت المتبقي بين الصلاتان 
        const nextPrayerObject = prayersArray[PrayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingtime = moment(nextPrayerIndex, "hh:mm").diff(momentNow);
        if(remainingtime < 0) {
            const midNightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrtoMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss"));

            // TOTAL
            const totalDiff = midNightDiff + fajrtoMidnightDiff;
            remainingtime = totalDiff;
        }

        const durationRemainingTime = moment.duration(remainingtime);
        setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : 
            ${durationRemainingTime.hours()}
        `)

    }



    return(
        <>
            {/* TOP ROW */}
            <Grid container>
                <Grid xs={6}>
                    <div>
                        <h2>{today}</h2>
                        <h1>{selectedCity.displayName}</h1>
                    </div>
                </Grid>

                <Grid xs={6}>
                    <div>
                        <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                        <h1  >{remainingTime}</h1>
                    </div>
                </Grid>
            </Grid>
            {/* TOP ROW */}

            {/* DIVIDER */}
            <Divider style={{borderColor: "white", opacity: "0.4"}} />
            {/* END  */}

            {/* CARDS */}
            <Stack style={{marginTop: "50px", display: "flex", 
                justifyContent:"center", flexGrow:1,
                flexDirection: "row", gap: 18}} >
                <Prayers name={"الفجر"} time={timings.Fajr}
                    image={"https://hafryat.com/sites/default/files/styles/single_main_image/public/%D9%86%D9%88%D8%B1%D8%A7%D9%86_3.jpg.webp?itok=xDbZ_--i"}
                />
                <Prayers name={"الضهر"} time={timings.Dhuhr}
                    image={"https://media.gemini.media/img/large/2018/3/2/2018_3_2_14_10_55_432.jpg"}
                />
                <Prayers name={"العصر"} time={timings.Asr}
                    image={"data:image/jpeg;base64,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"}
                />
                <Prayers name={"المغرب"} time={timings.Maghrib}
                    image={"https://img.youm7.com/ArticleImgs/2021/11/12/101180-%D9%85%D8%B3%D8%AC%D8%AF-%D8%A7%D9%84%D8%AA%D9%88%D8%A8%D8%A9-%D8%A8%D8%AF%D9%85%D9%86%D9%87%D9%88%D8%B1.jpg"}
                />
                <Prayers name={"العشاء"} time={timings.Isha}
                    image={"data:image/jpeg;base64,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"}
                />
            </Stack>

            {/* END CARDS */}

            {/* SELECT CITY */}
                <Stack direction={"row"} justifyContent={"center"}
                    style={{marginTop: "30px"}}
                >
                    <FormControl style={{width: "40%"}}>
                        <InputLabel id="demo-simple-select-label" 
                        style={{color: "white"}}>المدينة</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                        onChange={handleCityChange}
                        >

                            {availableCities.map((city) => {
                                return(
                                    <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>
                                )
                            })}
                        
                        </Select>
                    </FormControl>
                </Stack>
            {/* END SELECT CITY */}
        </>
    )
}

