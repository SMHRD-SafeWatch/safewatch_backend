package com.sw.sw.repository;

import com.sw.sw.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    /*
        save() : 레코드 저장 (insert, update)
        findOne() : primary key로 레코드 한건 찾기
        findAll() : 전체 레코드 불러오기. 정렬(sort), 페이징(pageable) 가능
        count() : 레코드 갯수
        delete() : 레코드 삭제
        findBy : 쿼리를 요청하는 메서드 임을 알림
        countBy : 쿼리 결과 레토드 수를 요청하는 메서드 임을 알림
   */
    public Admin findByAdminIdAndPassword(String adminId, String password);
}
