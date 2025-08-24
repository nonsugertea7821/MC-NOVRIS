package com.github.nonsugertea7821.novris.apps.test.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/test/need-auth")
@RequiredArgsConstructor
public class NeedAuthApiTestController {

    @GetMapping("/get-test")
    public String getTest() {
        return "認証成功";
    }

    @PostMapping("/post-test")
    public String postTest(@RequestBody String entity) {
        var result = "認証成功" + entity;
        return result;
    }

    @PutMapping("/put-test")
    public void putTest(@RequestParam String entity) {
        var result = "認証成功" + entity;
        System.out.println(result);
    }

    @DeleteMapping("/delete-test")
    public void deleteTest() {
        System.out.println("delete認証成功");
    }
}
