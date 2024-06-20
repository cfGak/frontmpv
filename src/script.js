const apiUrl = 'https://localhost:5001/api/users';

// Función para crear un nuevo usuario
async function createUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const key = document.getElementById('key').value;
    const is2FAEnabled = document.getElementById('is2FAEnabled').checked;

    const user = {
        username: username,
        password: password,
        key: key,
        is2FAEnabled: is2FAEnabled,
        counter: 0
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const newUser = await response.json();
            addUserToList(newUser);
        } else {
            console.error('Error creando usuario:', response.statusText);
        }
    } catch (error) {
        console.error('Error creando usuario:', error);
    }
}

// Función para obtener todos los usuarios
async function getUsers() {
    try {
        const response = await fetch(apiUrl);
        const users = await response.json();
        users.forEach(user => addUserToList(user));
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
    }
}

// Función para añadir un usuario a la lista en la UI
function addUserToList(user) {
    const userList = document.getElementById('userList');
    const li = document.createElement('li');
    li.textContent = `ID: ${user.id}, Username: ${user.username}, 2FA Enabled: ${user.is2FAEnabled}, Counter: ${user.counter}`;
    userList.appendChild(li);
}

// Event listener para el formulario de creación de usuario
document.getElementById('createUserForm').addEventListener('submit', createUser);

// Obtener usuarios cuando la página cargue
getUsers();
