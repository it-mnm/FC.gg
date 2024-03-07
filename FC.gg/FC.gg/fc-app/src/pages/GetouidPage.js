import React, { useState } from 'react';
import axios from 'axios';
// import MatchDetail from '../components/matchdetail';



function GetouidPage() {
  const [nickname, setNickname] = useState('');
  const [ouid, setOuid] = useState('');
  const [matchtype, setMatch] = useState('');
  const [matchid, setMatchid] = useState('');
  const [matchdetail, setMatchdetail] = useState(null);
  
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
      setMatchid(response1.data);
      console.log(response1);

      const matchData = {};
      console.log('matchid', response1.data);

      await Promise.all(response1.data.map(async (id) => {
        console.log('id', id);
        const response2 = await axios.get('https://p0l0evybh6.execute-api.ap-northeast-2.amazonaws.com/dev/Getmatchdetail', {
          params: {
            matchid: String(id)
          }
        });
        // 응답 데이터를 처리하거나 상태에 저장

        console.log(response2.data);
        matchData[id] = response2.data;
        setMatchdetail(matchData);
      }));
      
      
    } catch (error) {
      console.error('Error:', error);
    }
      


  };
  const displayMatchDetail = () => {
    if (matchdetail) {
      return (
        <div>
          {Object.keys(matchdetail).map((matchId) => (
            <div key={matchId}>
              <p>Match ID: {matchId}</p>
              <p>Match Date: {matchdetail[matchId].matchDate}</p>
              <p>Match Type: {matchdetail[matchId].matchType}</p>
              <div>
                Match Info:
                {matchdetail[matchId].matchInfo.map((info, index) => (
                  <div key={index}>
                    <p>{`Info ${index + 1}: ${info}`}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return <p>No match detail available</p>;
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
      {ouid && <p>OUID: {ouid}</p>}
    <div>
      {Array.isArray(matchid) && matchid.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
    <div>
      <h2>Match Detail</h2>
      {displayMatchDetail()}
    </div>
      
    </div>
  );
}

export default GetouidPage;
