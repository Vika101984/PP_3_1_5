document.addEventListener('DOMContentLoaded', function () {

    const rolePanels = document.querySelectorAll('.rolePanel');
    const roleLinks = document.querySelectorAll('.roleLink');

    function hideAllRolePanels() {
        rolePanels.forEach(panel => panel.style.display = 'none');
    }

    function resetActiveRoleStyle() {
        const activeRole = document.querySelector('.bg-primary');
        if (activeRole) {
            activeRole.classList.remove('bg-primary', 'text-white');
        }
    }

    roleLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();

            resetActiveRoleStyle();
            hideAllRolePanels();

            event.target.classList.add('bg-primary', 'text-white');
            const rolePanel =
                document.getElementById(
                    `${event.target
                        .getAttribute('data-role')
                        .toLowerCase()}Panel`);
            if (rolePanel) {
                rolePanel.style.display = 'block';
            }
        });
    });

    hideAllRolePanels();
    document.getElementById('adminPanel').style.display = 'block';
    // код выше реализует смену ролей в админ панели в левой части страницы

    const CURRENT_ADMIN_URL = "/api/admin";
    const CSRF_TOKEN_NAME = "_csrf";
    const CSRF_HEADER_NAME = "X-CSRF-TOKEN";
    const LOGOUT_URL = "/logout";
    const SUCCESS_LOGOUT_URL = "/login?logout";
    const LOGOUT_BUTTON_CLASS = ".logout-button";

    // получаем данные для передачи в модальное окно edit
    function handleEditButtonClick(userId, username, age, role) {

        const editUserModal = document.querySelector('#editUserModal');

        const userIdInput = editUserModal.querySelector('#editUserId');
        const usernameInput = editUserModal.querySelector('#editUserName');
        const ageInput = editUserModal.querySelector('#editAge');
        const roleInput = editUserModal.querySelector('#editRole');

        userIdInput.value = userId;
        usernameInput.value = username;
        ageInput.value = age;
        roleInput.value = role;

}

    function handleDeleteButtonClick(userId, username, age, role) {

        const deleteUserModal = document.querySelector('#deleteUserModal');

        const userIdInput = deleteUserModal.querySelector('#deleteUserId');
        const usernameInput = deleteUserModal.querySelector('#deleteUserUserName');
        const ageInput = deleteUserModal.querySelector('#deleteUserAge');
        const roleInput = deleteUserModal.querySelector('#deleteUserRole');

        userIdInput.value = userId;
        usernameInput.value = username;
        ageInput.value = age;
        roleInput.value = role;
    }
    // функция для получения всех пользователей
    // и добавление данных в модальные окна
    function getUsersAndDisplayInTable() {
        fetch(CURRENT_ADMIN_URL + "/all-users")
            .then(response => {
                if (!response.ok) {
                    console.error('Ошибка при получении данных');
                }
                return response.json();
            })
            .then(data => {
                const usersWithRoles = data;
                const tableBody = document.querySelector('#usersTable');
                if (!tableBody) {
                    console.error('Элемент таблицы не найден');
                }
                tableBody.innerHTML = '';
                Object.values(usersWithRoles).forEach(user => {
                    const row = createTableRow(user);
                    tableBody.appendChild(row);

                    const editButton = row.querySelector('.edit-user-button');
                    const deleteButton = row.querySelector('.delete-user-button');

                    editButton.addEventListener('click', () => {
                        handleEditButtonClick(
                            user.id,
                            user.username,
                            user.age,
                            user.roles.map(role => role.role.replace('ROLE_', '')).sort().join(' ')
                        );
                    });

                    deleteButton.addEventListener('click', () => {
                        handleDeleteButtonClick(
                            user.id,
                            user.username,
                            user.age,
                            user.roles.map(role => role.role.replace('ROLE_', '')).sort().join(' ')
                        );
                    });
                });
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
    }

    // получение информации о текущем пользователе
    // используются в шапке админ панели
    // и в окне роли User в навигационной панели
    fetch(CURRENT_ADMIN_URL + "/current-user")
        .then(response => {
            if (!response.ok) {
                console.error('Ошибка при получении данных');
            }
            return response.json();
        })
        .then(data => {
            const currentUser = data;
            const userId = currentUser.id;
            const username = currentUser.username;
            const age = currentUser.age;
            const roles = currentUser.roles.map(role => role.role.replace('ROLE_', '')).sort();

            document.getElementById('user-username').textContent = username;
            document.getElementById('user-roles').textContent = roles.join(' ');

            document.getElementById('currentUserId').textContent = userId;
            document.getElementById('currentUserUserName').textContent = username;
            document.getElementById('currentUserAge').textContent = age;
            document.getElementById('currentUserRoles').textContent = roles.join(' ');
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });

    // создание таблицы с данными о пользователях
    // и добавление кнопок "Edit" и "Delete"
    function createTableRow(user) {
        const userId = user.id;
        const username = user.username;
        const age = user.age;
        const roles = user.roles.map(role => role.role.replace('ROLE_', '')).sort();

        const row = document.createElement('tr');
        row.innerHTML = `
  <td class="align-middle">${userId}</td>
  <td class="align-middle">${username}</td>
  <td class="align-middle">${age}</td>
  <td class="align-middle">${Array.isArray(roles) ? roles.join(' ') : ''}</td>
  <td class="align-middle">
    <button class="btn btn-sm btn-outline-primary edit-user-button" data-bs-toggle="modal"
            data-bs-target="#editUserModal">
      Edit
    </button>
  </td>
  <td class="align-middle">
    <button class="btn btn-outline-danger btn-sm delete-user-button" data-bs-toggle="modal"
            data-bs-target="#deleteUserModal">
      Delete
    </button>
  </td>
`;

        return row;
    }

    getUsersAndDisplayInTable();

    // реализация кнопки add new user в вкладке New user
    document.querySelector('.add-user-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById('new_userName').value;
        const age = document.getElementById('new_age').value;
        const password = document.getElementById('new_password').value;
        const selectedRoles = Array.from(document.getElementById('new_role').selectedOptions).map(option => option.value);

        const newUser = {
            username: userName,
            age: age,
            password: password,
            roles: selectedRoles
        };

        const token = document.querySelector(`meta[name="${CSRF_TOKEN_NAME}"]`).getAttribute("content");
        const headers = new Headers({
            "Content-Type": "application/json",
            [CSRF_HEADER_NAME]: token
        });

        fetch(CURRENT_ADMIN_URL + "/addUser", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newUser)
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Ошибка при добавлении пользователя');
                }
                return response.text();
            })
            .then(data => {
                // Обновляем таблицу
                getUsersAndDisplayInTable();
                // Переключаемся на вкладку User table
                $('a[href="#userTable"]').tab('show');
            })
            .catch(error => {
                console.error('Ошибка при добавлении пользователя:', error);
            });
    });

    // реализация кнопки delete в модальном окне для удаления пользователя
    document.querySelector('.delete-user-button-confirm').addEventListener('click', function () {

        const token = document.querySelector(`meta[name="${CSRF_TOKEN_NAME}"]`).getAttribute("content");
        const headers = new Headers({
            "Content-Type": "application/json",
            [CSRF_HEADER_NAME]: token
        });

        fetch(CURRENT_ADMIN_URL + "/deleteUser", {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({
                id: document.querySelector('#deleteUserId').value
            })
        })
            .then(function (response) {
                if (!response.ok) {
                    console.error('Ошибка при удалении пользователя');
                }
                // Обновляем таблицу
                getUsersAndDisplayInTable();
                // Закрываем модальное окно
                $('#deleteUserModal').modal('hide');
            })
            .catch(function (error) {
                console.error('Ошибка:', error);
            });
    });

    // реализация кнопки save changes в модальном окне для редактирования пользователя
    document.querySelector('.save-changes').addEventListener('click', function () {

        let user = {
            id: document.querySelector('#editUserId').value, // Добавьте это поле
            username: document.querySelector('#editUserName').value,
            age: document.querySelector('#editAge').value,
            password: document.querySelector('#editPassword').value,
            roles: Array.from(document.getElementById('editRole').selectedOptions).map(option => option.value.toUpperCase())
        };

        const token = document.querySelector(`meta[name="${CSRF_TOKEN_NAME}"]`).getAttribute("content");
        const headers = new Headers({
            "Content-Type": "application/json",
            [CSRF_HEADER_NAME]: token
        });

        fetch(CURRENT_ADMIN_URL + "/updateUser", {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Ошибка при обновлении пользователя');
                }
                return response.text();
            })
            .then(data => {
                // Обновляем таблицу
                getUsersAndDisplayInTable();
                // Закрываем модальное окно
                $('#editUserModal').modal('hide');
            })
            .catch(error => {
                console.error('Ошибка при обновлении пользователя:', error);
            });
    });

    // реализация кнопки logout
    document.querySelector(LOGOUT_BUTTON_CLASS).addEventListener("click", async function (event) {
        event.preventDefault();

        const token = document.querySelector(`meta[name="${CSRF_TOKEN_NAME}"]`).getAttribute("content");
        const headers = new Headers({
            "Content-Type": "application/json",
            [CSRF_HEADER_NAME]: token
        });

        try {
            const response = await fetch(LOGOUT_URL, {
                method: "POST",
                headers: headers,
                body: "dummy=data"
            });

            if (!response.ok) {
                console.error(`Ошибка выхода: ${response.statusText}`);
            }

            window.location.href = SUCCESS_LOGOUT_URL;
        } catch (error) {
            console.error("Ошибка:", error);
        }
    });
});