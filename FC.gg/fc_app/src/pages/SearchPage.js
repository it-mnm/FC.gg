import React, { useEffect, useState } from 'react'
import '../css/SearchPage.css'
import searchIcon from '../assets/searchicon.png'
import leaguelogos from "../assets/leaguelogos.png"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [notice, setNotice] = useState("");
    const [urgentNotice, setUrgentNotice] = useState("");
    const onChange = (e) => {
        e.preventDefault();
        setSearchText(e.target.value);
    }

    const buttonClick = () => {
        if (!searchText) {
          alert("검색어를 입력해주세요!");
        } else {
          navigate(`./result/?input=${searchText}`);
          setSearchText("");
        }
    };

    useEffect(() => {
        const getNotice = async () => {
            try {
                const response = await axios.get('https://p0l0evybh6.execute-api.ap-northeast-2.amazonaws.com/dev/Getnotice');
                setNotice(response.data["일반공지"]);
                setUrgentNotice(response.data["특별공지"]);
                console.log(response);
            } catch (error) {
                console.error('알림을 가져오는 중 오류가 발생했습니다:', error);
            }
        };
        getNotice();
    }, []);

    
  const keyPress = (e) => {
    if (e.key === "Enter"&&e.nativeEvent.isComposing === false) {
      buttonClick();
    }
  };

  return (
    <div className="SearchPageBackground">
        <div className="MainContainer">
            <div className="SearchContainer">
                <input type="text" placeholder='닉네임을 입력해주세요.' value={searchText} onChange={onChange} className="SearchNickname" maxLength="15"  onKeyDown={keyPress}/>
                <img src={searchIcon} alt="searchIcon" className='SearchIcon' onClick={buttonClick}/>
            </div>
            <div className="NoticeContainer">
                <strong className="NoticeTitle">[공지사항]</strong>
                <ul className='NoticeListContainer'>
                    {
                        urgentNotice ?
                        urgentNotice.map((data, index) => (
                            <li className="urgentNoticeList" key={index}><span className='UrgentNoticeCategory'>{data.category}</span>: <a href={data.href} target="_black" className='NoticeAnker'>{data.title}</a><span> ({data.date})</span></li>

                        )):(<p>데이터를 불러오는데 실패하였습니다.</p>)
                    }
                    {
                        notice ?
                        notice.map((data, index)=>(
                            <li className='NoticeList' key={index}>{data.category}: <a href={data.href} target="_black"  className='NoticeAnker'>{data.title}</a><span> ({data.date})</span></li>
                        )):(<p>데이터를 불러오는데 실패하였습니다.</p>)
                    }
                </ul>
            </div>
            <div className='LogosContainer'>
                <img src={leaguelogos} alt="leaguelogos" className='LeagueLogos' />
            </div>
        </div>
    </div>
  )
}
