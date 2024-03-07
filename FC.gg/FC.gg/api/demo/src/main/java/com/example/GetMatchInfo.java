package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

public class GetMatchInfo implements RequestHandler<Map<String, Object>, String> {

    public String getMatchDetail(String apiKey, String matchId) {
        try {
            // 요청 URL 설정
            String baseUrl = "https://open.api.nexon.com/fconline/v1/match-detail";
            String url = baseUrl + "?matchid=" + matchId;

            // HttpClient 객체 생성
            HttpClient httpClient = HttpClient.newHttpClient();

            // HttpRequest 객체 생성
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-nxopen-api-key", apiKey)
                    .GET()
                    .build();

            // 요청 보내기
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // 응답 반환
            return response.body();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred: " + e.getMessage();
        }
    }

    @Override
    public String handleRequest(Map<String, Object> event, Context context) {
        String apiKey = "test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62";
        String matchId = (String) event.get("matchid");

        return getMatchDetail(apiKey, matchId);
    }
}