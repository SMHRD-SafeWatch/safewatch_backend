package com.sw.sw.repository;

import com.sw.sw.entity.WarningStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface WarningStatRepository extends JpaRepository<WarningStat, Integer> {


}
