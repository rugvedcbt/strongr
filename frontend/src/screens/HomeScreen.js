import React, { useEffect, useRef, useState } from "react";
import "../css/homescreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SearchBar from "../components/SearchBar";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listAreas,
  listGames,
  filterLocation,
} from "../actions/actions";
import { useHomeContext } from '../context/HomeContext'


function HomeScreen() {
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedDate, setSelectedArea, setSelectedGame  } = useHomeContext();


  const handleClick = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const areaList = useSelector((state) => state.areaList);
  const { areaerror, arealoading, areas } = areaList;

  const gameList = useSelector((state) => state.gameList);
  const { gameerror, gameloading, games } = gameList;

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(filterLocation(areaName, gameName, date));
    navigate("/clubs");
  };
 
  const [gameName, setGameName] = useState(games[0]?.game_name);
  const [areaName, setAreaName] = useState(areas[0]?.area_name);
  const [date, setDate] = useState();

  useEffect(() => {
    dispatch(listGames());
    dispatch(listAreas());
    const dtToday = new Date();
    const month = dtToday.getMonth() + 1;
    const day = dtToday.getDate();
    const year = dtToday.getFullYear();
    const maxDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.setAttribute('min', maxDate);
    }
  }, [dispatch]);

  useEffect(() => {
    setSelectedArea(areaName)
    setSelectedGame(gameName)
    setSelectedDate(date)
  }, [areaName, gameName, date]);

  return (
    <div className="home">
      <Header location="nav-home" />
      <div className="banner">
        <video autoPlay muted loop id="myVideo">
          <source src="/videos/sample-video.mp4" type="video/mp4" />
        </video>
        <div className="content">
          <h1>Fuel your spirit, lit your soul</h1>
          <div>
            <Button
              onClick={handleClick}
              className="btn-explore"
              text="Explore"
            />
          </div>
        </div>
      </div>

      <section ref={sectionRef} className="section1-container" id="section1-id">
        <div>
          <h1 style={{ color: "black" }}>
            We offer you the best Grounds <br />
            with <span style={{ color: "midnightblue" }}>best deals.</span>
          </h1>
        </div>

        <SearchBar placeholder="Area / Clubs / Locations" />

        <div className="lines">
          <div className="or-line1"></div>
          OR
          <div className="or-line2"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="check-availability-container-home">
          {gameloading ? (
              <Loader />
            ) : gameerror ? (
              <Message variant="danger">{gameerror}</Message>
            ) : (
              <SelectInput
                label="game"
                id="gameName"
                value={gameName}
                onChange={(value) => setGameName(value)}
                options={games}
              />
            )}
            
            {arealoading ? (
              <Loader />
            ) : areaerror ? (
              <Message variant="danger">{areaerror}</Message>
            ) : (
            <SelectInput
              label="area"
              id="areaName"
              value={areaName}
              onChange={(value) => setAreaName(value)}
              options={areas}
            />)}

            <DateInput id="date" value={date} onChange={handleDateChange} />

          </div>
          <div className="availability-btn-class">
            <Button
              onClick={handleSubmit}
              className="btn-check-availability-home"
              text="Check Availability"
            />
          </div>
        </form>
      </section>
    </div>
  );
}

export default HomeScreen;