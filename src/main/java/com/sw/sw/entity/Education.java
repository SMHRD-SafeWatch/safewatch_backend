package com.sw.sw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

@Table(name = "EDUCATION")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="edu_id")
    private int eduId;

    @Column(name ="edu_date")
    private LocalDateTime eduDate;

    @Column(name ="edu_name")
    private String eduName;

    @Column(name ="edu_duration")
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

    // 교육시간
    public String getFormattedDate() {
        LocalDateTime startDateTime = eduDate;
        LocalDateTime endDateTime = startDateTime.plusMinutes(eduDuration);

        String startTime = String.format("%02d:%02d", startDateTime.getHour(), startDateTime.getMinute());
        String endTime = String.format("%02d:%02d", endDateTime.getHour(), endDateTime.getMinute());
        return startTime + "~" + endTime;
    }

}
