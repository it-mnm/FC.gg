package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
// import com.google.gson.JsonObject;
// import com.google.gson.JsonParser;
import java.util.Map;

public class GetMatchid implements RequestHandler<Map<String, Object>, String> {

    @Override
    public String handleRequest(Map<String, Object> event, Context context) {
        try {
            // nickname 가져오기
            String ouid = (String) event.get("ouid");
            String matchtype = (String) event.get("matchtype");
            String offset = (String) event.get("offset");
            String limit = (String) event.get("limit");
            
            String matchUrl = "https://open.api.nexon.com/fconline/v1/user/match?";
            Map<String, String> matchQueryParams = new HashMap<>();
            matchQueryParams.put("ouid", ouid);
            matchQueryParams.put("matchtype", matchtype);
            matchQueryParams.put("offset", offset);
            matchQueryParams.put("limit", limit);

            String matchUrlWithParams = matchUrl + "=" + buildQueryParams(matchQueryParams);

            // HttpRequest 객체 생성
            HttpRequest matchRequest = HttpRequest.newBuilder()
                    .uri(URI.create(matchUrlWithParams))
                    .header("accept", "application/json")
                    .header("x-nxopen-api-key", "test_f15f9ee815ab4be133e13c2028780bfc1375fec5c24fbe5b2436a1070879273300ad5d0d0126614ece0a1c1c2d180b62")
                    .GET()
                    .build();
            HttpClient httpClient = HttpClient.newBuilder().build();
            // 요청 보내기
            HttpResponse<String> matchResponse = httpClient.send(matchRequest, HttpResponse.BodyHandlers.ofString());
            System.out.println("Match Response: " + matchResponse.body());

            return matchResponse.body();


        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred: " + e.getMessage();
        }
    }
        public static String buildQueryParams(Map<String, String> params) {
        StringBuilder result = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (result.length() > 0) {
                result.append("&");
            }
            result.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            result.append("=");
            result.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }
        return result.toString();
    }
}