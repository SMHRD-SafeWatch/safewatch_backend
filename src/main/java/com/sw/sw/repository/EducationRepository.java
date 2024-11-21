package com.sw.sw.repository;

import com.sw.sw.entity.Education;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EducationRepository extends JpaRepository<Education, Integer> {

    // 특정 날짜 이전의 교육 일정을 삭제하는 메서드
    @Transactional
    @Modifying
    @Query("DELETE FROM Education e WHERE e.eduDate < :date")
    void deleteByEduDateBefore(LocalDateTime date);

}
