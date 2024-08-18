package com.studytempo.studytempoapp.controllers.gemini;

import com.studytempo.studytempoapp.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/gemini")
public class GeminiController {

    @Autowired
    GeminiService geminiService;

    @PostMapping("/prompt")
    public String getResponse(@RequestBody String prompt) {
        return geminiService.callApi(prompt);

    }
}