package com.sw.sw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Table(name = "WARNING_STAT")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class WarningStat {

    @Id
    private int warnStatId;
    private int warningId;
    private Date statDate;
    private int cntWarning;
    private int cntResolved;
}
