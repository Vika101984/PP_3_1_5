package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final UserService userService;
@Autowired
    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/current-user")
    public User getCurrentUser(Principal principal) {
        return userService.findByUsername(principal.getName());
    }

    @GetMapping("/all-users")
    public List<User> getAllUserWithRoles() {
        return userService.getAllUsersWithRoles().keySet().stream().toList();
    }
    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestBody UserDto userDto) {
        userService.addUser(userDto);
        return ResponseEntity.ok(" Everything went well");
    }

    @PutMapping ("/updateUser")
    public ResponseEntity<String> updateUser(@RequestBody UserDto userDto) {
        userService.updateUser(userDto);
        return ResponseEntity.ok("Everything went well");
    }

    @DeleteMapping ("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestBody UserDto userDto) {
        userService.deleteUser(userDto.getId());
        return ResponseEntity.ok("Everything went well");
    }
}