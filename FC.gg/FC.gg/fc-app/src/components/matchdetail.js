import React from 'react';

function MatchDetail({ matchDetail }) {
  // matchDetail 객체에서 필요한 정보를 추출합니다
  const { matchId, matchDate, matchType, matchInfo } = matchDetail;

  return (
    <div>
      <h2>Match Detail</h2>
      <p>Match ID: {matchId}</p>
      <p>Match Date: {matchDate}</p>
      <p>Match Type: {matchType}</p>
      <h3>Match Info</h3>
      <ul>
        {matchInfo.map((info, index) => (
          <li key={index}>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchDetail;