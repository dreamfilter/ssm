package com.tom.dao;

import com.tom.model.Student;

import java.util.List;

public interface StudentDao {

    int getTotal();
    void addStudent(Student student);
    void deleteStudent(int id);
    void updateStudent(Student student);
    Student getStudent(int id);
    List<Student> list(int start, int count);
}
