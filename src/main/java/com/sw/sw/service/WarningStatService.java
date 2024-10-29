package com.sw.sw.service;

import com.sw.sw.repository.WarningStatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class WarningStatService {

    private final WarningStatRepository warningStatRepository;

    // 날짜별 알림건수 가져오기 - 원하는 날짜 기준
//    public Integer getCntWarningByDate(Date statDate) {
//        return warningStatRepository.findCntWarningByStatDate(statDate);
//    }

}
