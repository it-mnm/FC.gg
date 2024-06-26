import React, { useState, useEffect } from "react";
import "../css/MatchResult.css";
import loading from "../assets/loading.gif";
import ball from "../assets/ball.png";
import axios from "axios";

export default function MatchResult(props) {
  const { ouid, input } = props;
  const [expandedId, setExpandedId] = useState(null);
  const [matchtype, setMatch] = useState(50);
  const [matchdetail, setMatchdetail] = useState("");
  const [nickname, setNickname] = useState("");
  
  const toggleExpand = (tab) => {
    setExpandedId((prevId) => (prevId === tab ? null : tab));
  };

  // console.log("디리리디리리 : ", Object.entries(matchdetail)[0][1]['my_data'][0]['name']);
  console.log("matchdetail:", matchdetail);

  useEffect(()=>{
    setNickname(input);
  }, [input])

  useEffect(()=>{
    const getMatchdetail = async() => {
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
              // nickname: sessionStorage.getItem('nickname') 세션 스토리지에 닉네임 넣는 코드가 없어서 그냥 setNickname 있길레 nickname으로 대체했슴다
              nickname: nickname
            }
          });
          // 응답 데이터를 처리하거나 상태에 저장
  
          console.log(response2.data);
          matchData[id] = response2.data;
          
  
        }));
      console.log(matchData);
      setMatchdetail(matchData);
      console.log(matchdetail);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    getMatchdetail();
  }, [ouid, matchtype, nickname])
  console.log('MatchResultOuid:', ouid);

  return (
    <div className="MatchResultBackground">
      {matchdetail !== null ? (
        Object.entries(matchdetail).map(([id, data]) => (
          <div className="MatchResultOuterContainer" key={id}>
            <div
              className="MatchResultContainer"
              style={{
                backgroundColor:
                  data.my_status === "승"
                    ? "rgba(94, 139, 226, 0.8)"
                    : data.my_status === "무"
                    ? "rgba(212, 212, 212, 0.8)" // 무승부인 경우에 해당하는 색상
                    : "rgba(255, 132, 132, 0.8)"
              }}
              onClick={() => toggleExpand(id)}
            >
              <span>
                {nickname} {data.my_score} : {data.other_score} {data.other_nick}
              </span>
              &nbsp; &nbsp; &nbsp;
              <span>{data.my_status}</span>
            </div>
            {expandedId === id && (
              <div className="MatchResuiltDetailContainer">
                <div className="MyInformation">
                  <ul>
                    {data && data.my_data && data.my_player_data && (
                      (() => {
                        let combinedData = [];
                        for (let i = 0; i < data.my_data.length; i++) {
                          combinedData.push({
                            ...data.my_data[i],
                            ...data.my_player_data[i],
                          });
                        }
                        console.log("combinedData:", combinedData);

                        return combinedData.map((value, index) => (
                          <div key={index} className="CombinedDataContainer">
                            <li>
                              <img
                                src={value.seasonImg}
                                alt="season"
                                height="18px"
                                className="SeasonImg"
                              />
                              {value.name}
                              <span>({value.status})</span>
                              {[...Array(value.goal)].map((_, index) => (
                                <img
                                  key={index}
                                  src={ball}
                                  alt="ball"
                                  width="20px"
                                  className="Ball"
                                />
                              ))}
                            </li>
                            <img
                              src={value.p_image}
                              alt="img"
                              width="50px"
                            />
                          </div>
                        ));
                      })() // 여기서 즉시 실행하지 않음
                    )}
                  </ul>
                </div>
                <div className="OtherInformation">
                  <ul>
                    {data && data.other_data && data.other_player_data && (
                      (() => {
                        let combinedData = [];
                        for (let i = 0; i < data.other_data.length; i++) {
                          combinedData.push({
                            ...data.other_data[i],
                            ...data.other_player_data[i],
                          });
                        }
                        console.log("combinedData:", combinedData);

                        return combinedData.map((value, index) => (
                          <div key={index} className="CombinedDataContainer">
                            <li>
                              <img
                                src={value.seasonImg}
                                alt="season"
                                height="18px"
                                className="SeasonImg"
                              />
                              {value.name}
                              <span>({value.status})</span>
                              {[...Array(value.goal)].map((_, index) => (
                                <img
                                  key={index}
                                  src={ball}
                                  alt="ball"
                                  width="20px"
                                  className="Ball"
                                />
                              ))}
                            </li>
                            <img
                              src={value.p_image}
                              alt="img"
                              width="50px"
                            />
                          </div>
                        ));
                      })() // 여기서 즉시 실행하지 않음
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <img src={loading} alt="로딩" width="50px" />
      )}
    </div>
  );
}
