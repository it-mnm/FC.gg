import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import MatchDetail from '../components/matchdetail';



function GetouidPage() {
  const [nickname, setNickname] = useState('');
  const [ouid, setOuid] = useState('');
  const [matchtype, setMatch] = useState('');
  const [matchdetail, setMatchdetail] = useState(null);
  // const [myStatus, setMyStatus] = useState('');
  // const [myScore, setMyScore] = useState('');
  // const [myPlayerData, setMyPlayerData] = useState([]);
  // const [myData, setMyData] = useState([]);
  // const [otherStatus, setOtherStatus] = useState('');
  // const [otherScore, setOtherScore] = useState('');
  // const [otherPlayerData, setOtherPlayerData] = useState([]);
  // const [otherData, setOtherData] = useState([]);
  useEffect(() => {
    sessionStorage.setItem('nickname', nickname);
  }, [nickname]);  

  const handleGetouid = async () => {
    try {
      const response = await axios.get('https://p0l0evybh6.execute-api.ap-northeast-2.amazonaws.com/dev/Getouid', {
        params: {  
          nickname: nickname,
        }
      });
      console.log(response);
      // Extracting ouid from the response
      
      setOuid(response.data);
      console.log("데이터", response.data);
      // Fetching match data using ouid

      
    } catch (error) {
      console.error('Error:', error);
    }
  
    try {
      const response1 = await axios.get('https://p0l0evybh6.execute-api.ap-northeast-2.amazonaws.com/dev/Getmatchid', {
        params: {
          ouid: ouid,
          matchtype: matchtype,
          offset: 0,
          limit: 10
        }
      });
      setMatch(matchtype);

      console.log(response1);

      const matchData = {};
      console.log('matchid', response1.data);

      await Promise.all(response1.data.map(async (id) => {
        console.log('id', id);
        const response2 = await axios.get('https://p0l0evybh6.execute-api.ap-northeast-2.amazonaws.com/dev/Getmatchdetail', {
          params: {
            matchid: String(id),
            nickname: sessionStorage.getItem('nickname')
          }
        });
        // 응답 데이터를 처리하거나 상태에 저장

        console.log(response2.data);
        matchData[id] = response2.data;
        

      }));
    console.log(matchData);
    setMatchdetail(matchData)
    } catch (error) {
      console.error('Error:', error);
    }
      


  };



  return (
    <div style={{ paddingLeft: '20px' }}>
      <h1>유저 전적 조회</h1>
      <input type="text" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input type="text" placeholder="매치 종류" value={matchtype} onChange={(e) => setMatch(e.target.value)} />
      <button onClick={() => {
          handleGetouid();
      }}>검색</button>
    <div>
      <h2>Match Data</h2>
      {matchdetail && Object.keys(matchdetail).length > 0 ? (
        Object.keys(matchdetail).map((matchId) => (
          <div key={matchId}>
            <p>나 : {matchdetail[matchId].my_status} 상대방 : {matchdetail[matchId].other_status} </p>
            <p>내 점수: {matchdetail[matchId].my_score}, 상대방 점수 : {matchdetail[matchId].other_score}</p>
            <p>내 선수 : </p>
            <ul>
              {matchdetail[matchId].my_data.map((player, index) => (
                <li key={index}>
                  <img src={player.p_action_image} alt={player.name} />
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No match data available</p>
      )}
    </div>

  </div>
  );
}

export default GetouidPage;
