package ru.kata.spring.boot_security.demo.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRole()))
                .collect(Collectors.toList());
        return new org.springframework.security.core.userdetails.
                User(user.getUsername(), user.getPassword(), authorities);
    }

    @Override
    @Transactional
    public void addUser(UserDto userDto) {
        User user = modelMapper.map(userDto,User.class);
        Set<Role> roles = userDto.getRoles().stream()
                .map(role -> roleRepository.findByRole("ROLE_" + role.getRole()))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUser(UserDto userDto) {
        User users = userRepository.findById(userDto.getId()).orElse(null);
        if (users != null) {
            users.setUsername(userDto.getUsername());
            users.setAge(userDto.getAge());
            users.setPassword(userDto.getPassword());

            Set<Role> roles = userDto.getRoles().stream()
                    .map(role -> roleRepository.findByRole("ROLE_" + role.getRole()))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            users.setRoles(roles);
            userRepository.save(users);

        }
    }

    @Override
    @Transactional
    public void deleteUser(long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.getRoles().clear();
            userRepository.deleteById(id);
        }
    }
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    @Override
    public Map<User, List<String>> getAllUsersWithRoles() {
        return userRepository
                .findAll(Sort.by("id"))
                .stream()
                .sorted(Comparator.comparing(User::getId))
                .collect(Collectors.toMap(Function.identity(),
                        user -> user.getRoles().stream()
                        .map(Role::getRole)
                        .map(roleName -> roleName.replace("ROLE_", ""))
                        .sorted()
                        .toList(),
                        (oldValue, newValue) -> oldValue,
                        LinkedHashMap::new
                ));
    }

}