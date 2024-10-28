package com.sw.sw.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Education {

    @Id
    private int eduId;
    private LocalDateTime eduDate;
    private String eduName;
    private int eduDuration;

    // 월
    public String getMonth(){
        return String.valueOf(eduDate.getMonthValue());
    }

    // 일
    public String getDay(){
        return String.valueOf(eduDate.getDayOfMonth());
    }

    // 요일
    public String getWeekday(){
        DayOfWeek dayOfWeek = eduDate.getDayOfWeek();
        switch (dayOfWeek){
            case MONDAY: return "월";
            case TUESDAY: return "화";
            case WEDNESDAY: return "수";
            case THURSDAY: return "목";
            case FRIDAY: return "금";
            case SATURDAY: return "토";
            case SUNDAY: return "일";
            default: return "";
        }
    }

    // 교육시간(시작시간~종료시간)
    public String getFormattedDate() {
        LocalDateTime startDateTime = eduDate;
        LocalDateTime endDateTime = startDateTime.plusMinutes(eduDuration);

        // 시간 (시:분)
        String startTime = String.format("%02d:%02d", startDateTime.getHour(), startDateTime.getMinute());
        String endTime = String.format("%02d:%02d", endDateTime.getHour(), endDateTime.getMinute());
        return startTime + "~" + endTime;
    }

}
