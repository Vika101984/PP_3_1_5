package ru.kata.spring.boot_security.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.HashSet;
import java.util.List;

@Component
public class UsersInitializer implements CommandLineRunner {
    public final UserRepository userRepository;
    public final RoleRepository roleRepository;

    @Autowired
    public UsersInitializer(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    @Override
    public void run(String... args) throws Exception {
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");

        roleRepository.save(adminRole);
        roleRepository.save(userRole);

        User admin = new User("admin", 25, "admin");
        admin.setRoles(new HashSet<>(List.of(adminRole, userRole)));
        userRepository.save(admin);

        User user = new User("user", 35, "user");
        user.setRoles(new HashSet<>(List.of(userRole)));
        userRepository.save(user);
    }
}

