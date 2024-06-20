const apiUrl = 'https://localhost:5001/api/users';

// Función para crear un nuevo usuario
async function createUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Generar clave secreta usando speakeasy
    const secret = speakeasy.generateSecret({ length: 20 });

    const user = {
        username: username,
        password: password,
        key: secret.hex,
        is2FAEnabled: false,
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
            const errorData = await response.json();
            console.error('Error creando usuario:', response.statusText, errorData);
        }
    } catch (error) {
        console.error('Error creando usuario:', error);
    }
}

// Función para obtener todos los usuarios
async function getUsers() {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const users = await response.json();
            users.forEach(user => addUserToList(user));
        } else {
            console.error('Error obteniendo usuarios:', response.statusText);
        }
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
