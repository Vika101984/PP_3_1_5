package ru.kata.spring.boot_security.demo.dto;

import java.util.Set;

public class UserDto {
    private Long id;
    private String username;
    private  int age;
    private String password;
    private Set<RoleDto> roles;

    public UserDto() {
    }

    public UserDto(String username, int age, String password, Set<RoleDto> roles) {
        this.username = username;
        this.age = age;
        this.password = password;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<RoleDto> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleDto> roles) {
        this.roles = roles;
    }
}
