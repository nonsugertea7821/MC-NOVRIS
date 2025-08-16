package com.github.nonsugertea7821.novris.apps.management.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.nonsugertea7821.novris.apps.management.dto.request.RunMCServerRequest;
import com.github.nonsugertea7821.novris.apps.management.dto.response.RunMCServerResponse;
import com.github.nonsugertea7821.novris.apps.management.service.MCServerControlService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RestController("api/management/")
public class ManagementController {

    private final MCServerControlService serverControlService;

    /**
     * マインクラフトサーバーを起動する。
     * 
     * @param request {@link RunMCServerRequest}
     * @return {@link RunMCServerResponse}
     * @throws IOException {@link MCServerControlService#bootMcServer(String)}に失敗
     */
    @PostMapping("run-mc-server")
    public ResponseEntity<RunMCServerResponse> runMCServer(@RequestBody RunMCServerRequest request) throws IOException {
        serverControlService.bootMcServer();
        return ResponseEntity.ok().body(new RunMCServerResponse());
    }

}